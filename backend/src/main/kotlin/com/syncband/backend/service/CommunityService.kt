package com.syncband.backend.service

import com.syncband.backend.dto.request.community.CommentCreateRequest
import com.syncband.backend.dto.request.community.CommentUpdateRequest
import com.syncband.backend.dto.request.community.PostCreateRequest
import com.syncband.backend.dto.request.community.PostSearchRequest
import com.syncband.backend.dto.request.community.PostUpdateRequest
import com.syncband.backend.dto.response.community.AttachmentResponse
import com.syncband.backend.dto.response.community.CategoryListResponse
import com.syncband.backend.dto.response.community.CategoryResponse
import com.syncband.backend.dto.response.community.CommentResponse
import com.syncband.backend.dto.response.community.PostDetailResponse
import com.syncband.backend.dto.response.community.PostLikeResponse
import com.syncband.backend.dto.response.community.PostListResponse
import com.syncband.backend.dto.response.community.PostResponse
import com.syncband.backend.dto.response.community.TagListResponse
import com.syncband.backend.dto.response.community.TagResponse
import com.syncband.backend.model.User
import com.syncband.backend.model.community.Category
import com.syncband.backend.model.community.Post
import com.syncband.backend.model.community.PostAttachment
import com.syncband.backend.model.community.PostComment
import com.syncband.backend.model.community.PostLike
import com.syncband.backend.model.community.PostTag
import com.syncband.backend.repository.UserRepository
import com.syncband.backend.repository.community.CategoryRepository
import com.syncband.backend.repository.community.PostAttachmentRepository
import com.syncband.backend.repository.community.PostCommentRepository
import com.syncband.backend.repository.community.PostLikeRepository
import com.syncband.backend.repository.community.PostRepository
import com.syncband.backend.repository.community.PostTagRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDateTime
import jakarta.persistence.EntityNotFoundException

@Service
class CommunityService(
    private val postRepository: PostRepository,
    private val categoryRepository: CategoryRepository,
    private val postTagRepository: PostTagRepository,
    private val postLikeRepository: PostLikeRepository,
    private val postCommentRepository: PostCommentRepository,
    private val postAttachmentRepository: PostAttachmentRepository,
    private val userRepository: UserRepository,
    private val storageService: StorageService
) {

    // Post 관련 메소드
    @Transactional
    fun createPost(userId: Long, request: PostCreateRequest, attachments: List<MultipartFile>?): PostDetailResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { EntityNotFoundException("User not found with id: $userId") }
        
        val category = categoryRepository.findById(request.categoryId)
            .orElseThrow { EntityNotFoundException("Category not found with id: ${request.categoryId}") }
        
        val post = Post(
            title = request.title,
            content = request.content,
            user = user,
            category = category
        )
        
        // 태그 처리
        if (request.tagIds.isNotEmpty()) {
            val tags = postTagRepository.findAllById(request.tagIds)
            post.tags.addAll(tags)
        }
        
        val savedPost = postRepository.save(post)
        
        // 첨부파일 처리
        val savedAttachments = attachments?.map { file ->
            val filePath = storageService.store(file, "community/posts/${savedPost.id}")  // storeFile → store로 변경
            val attachment = PostAttachment(
                post = savedPost,
                originalFileName = file.originalFilename ?: "unknown",
                storedFileName = filePath.substringAfterLast('/'),
                filePath = filePath,
                fileSize = file.size,
                fileType = file.contentType ?: "application/octet-stream"
            )
            postAttachmentRepository.save(attachment)
        } ?: emptyList()
        
        return convertToPostDetailResponse(savedPost, user, emptyList())
    }
    
    @Transactional(readOnly = true)
    fun getPostById(postId: Long, currentUserId: Long?): PostDetailResponse {
        val post = postRepository.findById(postId)
            .orElseThrow { EntityNotFoundException("Post not found with id: $postId") }
        
        // 조회수 증가
        post.viewCount++
        postRepository.save(post)
        
        val currentUser = currentUserId?.let { 
            userRepository.findById(it).orElse(null)
        }
        
        // 댓글 로드
        val comments = postCommentRepository.findRootCommentsByPost(post, PageRequest.of(0, 100))
        val commentResponses = comments.content.map { convertToCommentResponse(it) }
        
        return convertToPostDetailResponse(post, currentUser)
    }
    
    @Transactional
    fun updatePost(postId: Long, userId: Long, request: PostUpdateRequest): PostDetailResponse {
        val post = postRepository.findById(postId)
            .orElseThrow { EntityNotFoundException("Post not found with id: $postId") }
        
        if (post.user.id != userId) {
            throw SecurityException("User does not have permission to update this post")
        }
        
        post.title = request.title
        post.content = request.content
        post.updatedAt = LocalDateTime.now()
        
        // 카테고리 업데이트
        val category = categoryRepository.findById(request.categoryId)
            .orElseThrow { EntityNotFoundException("Category not found with id: ${request.categoryId}") }
        
        // 태그 업데이트
        if (request.tagIds.isNotEmpty()) {
            post.tags.clear()
            val tags = postTagRepository.findAllById(request.tagIds)
            post.tags.addAll(tags)
        }
        
        val updatedPost = postRepository.save(post)
        val user = userRepository.findById(userId).orElse(null)
        
        return convertToPostDetailResponse(updatedPost, user)
    }
    
    @Transactional
    fun deletePost(postId: Long, userId: Long) {
        val post = postRepository.findById(postId)
            .orElseThrow { EntityNotFoundException("Post not found with id: $postId") }
        
        if (post.user.id != userId) {
            throw SecurityException("User does not have permission to delete this post")
        }
        
        // 소프트 삭제 - 실제 삭제 대신 isDeleted 플래그 설정
        post.isDeleted = true
        postRepository.save(post)
    }
    
    @Transactional(readOnly = true)
    fun searchPosts(request: PostSearchRequest, currentUserId: Long?): PostListResponse {
        val currentUser = currentUserId?.let { 
            userRepository.findById(it).orElse(null)
        }
        
        val sortDirection = if (request.sortDirection?.equals("ASC", ignoreCase = true) == true) 
            Sort.Direction.ASC 
        else 
            Sort.Direction.DESC
            
        // 올바른 Sort.by 사용법으로 수정
        val pageable = PageRequest.of(
            request.page, 
            request.size, 
            Sort.by(sortDirection, request.sortBy ?: "createdAt")
        )
        
        val postsPage = when {
            // 키워드 검색
            !request.keyword.isNullOrBlank() -> 
                postRepository.searchActiveByKeyword(request.keyword, pageable)
                
            // 카테고리별 검색
            request.categoryId != null -> {
                val category = categoryRepository.findById(request.categoryId)
                    .orElseThrow { EntityNotFoundException("Category not found with id: ${request.categoryId}") }
                postRepository.findAllActiveByCategory(category, pageable)
            }
            
            // 사용자별 검색
            request.userId != null -> {
                val user = userRepository.findById(request.userId)
                    .orElseThrow { EntityNotFoundException("User not found with id: ${request.userId}") }
                postRepository.findAllActiveByUser(user, pageable)
            }
            
            // 기본 검색 - 모든 게시글
            else -> postRepository.findAllActive(pageable)
        }
        
        val posts = postsPage.content.map { convertToPostResponse(it, currentUser) }
        
        return PostListResponse(
            posts = posts,
            totalCount = postsPage.totalElements,
            page = request.page,
            size = request.size,
            totalPages = postsPage.totalPages
        )
    }
    
    // 카테고리 관련 메소드
    @Transactional(readOnly = true)
    fun getAllCategories(): CategoryListResponse {
        val categories = categoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc()
        return CategoryListResponse(
            categories = categories.map { convertToCategoryResponse(it) }
        )
    }
    
    // 댓글 관련 메소드
    @Transactional
    fun createComment(postId: Long, userId: Long, request: CommentCreateRequest): CommentResponse {
        val post = postRepository.findById(postId)
            .orElseThrow { EntityNotFoundException("Post not found with id: $postId") }
        
        val user = userRepository.findById(userId)
            .orElseThrow { EntityNotFoundException("User not found with id: $userId") }
        
        // parentId 필드명 수정
        var parentComment: PostComment? = null
        if (request.parentId != null) {  // parentCommentId → parentId로 변경
            parentComment = postCommentRepository.findById(request.parentId)
                .orElseThrow { EntityNotFoundException("Comment not found with id: ${request.parentId}") }
        }
        
        val comment = PostComment(
            content = request.content,
            post = post,
            user = user,
            parentComment = parentComment
        )
        
        val savedComment = postCommentRepository.save(comment)
        
        return convertToCommentResponse(savedComment)
    }
    
    @Transactional
    fun updateComment(commentId: Long, userId: Long, request: CommentUpdateRequest): CommentResponse {
        val comment = postCommentRepository.findById(commentId)
            .orElseThrow { EntityNotFoundException("Comment not found with id: $commentId") }
        
        if (comment.user.id != userId) {
            throw SecurityException("User does not have permission to update this comment")
        }
        
        comment.content = request.content
        comment.updatedAt = LocalDateTime.now()
        
        val updatedComment = postCommentRepository.save(comment)
        
        return convertToCommentResponse(updatedComment)
    }
    
    @Transactional
    fun deleteComment(commentId: Long, userId: Long) {
        val comment = postCommentRepository.findById(commentId)
            .orElseThrow { EntityNotFoundException("Comment not found with id: $commentId") }
        
        if (comment.user.id != userId) {
            throw SecurityException("User does not have permission to delete this comment")
        }
        
        // 소프트 삭제 - 실제 삭제 대신 isDeleted 플래그 설정
        comment.isDeleted = true
        postCommentRepository.save(comment)
    }
    
    // 좋아요 관련 메소드
    @Transactional
    fun likePost(postId: Long, userId: Long): PostLikeResponse {
        val post = postRepository.findById(postId)
            .orElseThrow { EntityNotFoundException("Post not found with id: $postId") }
        
        val user = userRepository.findById(userId)
            .orElseThrow { EntityNotFoundException("User not found with id: $userId") }
        
        val existingLike = postLikeRepository.findByPostAndUser(post, user)
        
        if (existingLike != null) {
            // 이미 좋아요를 눌렀다면 좋아요 취소
            postLikeRepository.delete(existingLike)
            
            return PostLikeResponse(
                postId = postId,
                userId = userId,
                liked = false,
                likeCount = postLikeRepository.countByPost(post).toInt(),  // Long → Int 변환
                timestamp = LocalDateTime.now()
            )
        } else {
            // 좋아요를 누르지 않았다면 좋아요 추가
            val postLike = PostLike(
                post = post,
                user = user
            )
            
            postLikeRepository.save(postLike)
            
            return PostLikeResponse(
                postId = postId,
                userId = userId,
                liked = true,
                likeCount = postLikeRepository.countByPost(post).toInt(),  // Long → Int 변환
                timestamp = LocalDateTime.now()
            )
        }
    }
    
    @Transactional(readOnly = true)
    fun isPostLikedByUser(postId: Long, userId: Long): Boolean {
        val post = postRepository.findById(postId)
            .orElseThrow { EntityNotFoundException("Post not found with id: $postId") }
        
        val user = userRepository.findById(userId)
            .orElseThrow { EntityNotFoundException("User not found with id: $userId") }
        
        return postLikeRepository.existsByPostAndUser(post, user)
    }
    
    // 태그 관련 메소드
    @Transactional(readOnly = true)
    fun getAllTags(): TagListResponse {
        val tags = postTagRepository.findAll()
        return TagListResponse(
            tags = tags.map { convertToTagResponse(it) }
        )
    }
    
    @Transactional(readOnly = true)
    fun getTopTags(limit: Int): TagListResponse {
        val tags = postTagRepository.findTopTags(limit)
        return TagListResponse(
            tags = tags.map { convertToTagResponse(it) }
        )
    }
    
    // 응답 변환 메소드
    private fun convertToPostResponse(post: Post, currentUser: User?): PostResponse {
        val isLiked = currentUser?.let { 
            postLikeRepository.existsByPostAndUser(post, it) 
        } ?: false
        
        return PostResponse(
            id = post.id,
            title = post.title,
            content = post.content,
            userId = post.user.id,
            username = post.user.username,
            profileImageUrl = post.user.profileImageUrl,  // profileImage → profileImageUrl로 수정
            categoryId = post.category.id,
            categoryName = post.category.name,
            createdAt = post.createdAt,
            updatedAt = post.updatedAt,
            viewCount = post.viewCount,
            likeCount = postLikeRepository.countByPost(post).toInt(),
            commentCount = postCommentRepository.countActiveCommentsByPost(post),
            tags = post.tags.map { it.name },
            isLikedByCurrentUser = isLiked
        )
    }
    
    private fun convertToPostDetailResponse(post: Post, currentUser: User?, comments: List<CommentResponse> = emptyList()): PostDetailResponse {
        val isLiked = currentUser?.let { 
            postLikeRepository.existsByPostAndUser(post, it) 
        } ?: false
        
        val loadedComments = comments.ifEmpty {
            val rootComments = postCommentRepository.findRootCommentsByPost(post, PageRequest.of(0, 100))
            rootComments.content.map { convertToCommentResponse(it) }
        }
        
        val attachments = postAttachmentRepository.findActiveByPost(post).map { convertToAttachmentResponse(it) }
        
        return PostDetailResponse(
            id = post.id,
            title = post.title,
            content = post.content,
            userId = post.user.id,
            username = post.user.username,
            profileImageUrl = post.user.profileImageUrl,  // profileImage → profileImageUrl로 수정
            categoryId = post.category.id,
            categoryName = post.category.name,
            createdAt = post.createdAt,
            updatedAt = post.updatedAt,
            viewCount = post.viewCount,
            likeCount = postLikeRepository.countByPost(post).toInt(),
            commentCount = postCommentRepository.countActiveCommentsByPost(post),
            tags = post.tags.map { it.name },
            isLikedByCurrentUser = isLiked,
            comments = loadedComments,
            attachments = attachments
        )
    }
    
    private fun convertToCategoryResponse(category: Category): CategoryResponse {
        return CategoryResponse(
            id = category.id,
            name = category.name,
            description = category.description,
            postCount = category.posts.size,
            displayOrder = category.displayOrder,
            isActive = category.isActive
        )
    }
    
    private fun convertToCommentResponse(comment: PostComment): CommentResponse {
        val replies = if (comment.replies.isNotEmpty()) {
            comment.replies.filter { !it.isDeleted }.map { convertToCommentResponse(it) }
        } else {
            postCommentRepository.findRepliesByParentComment(comment).map { convertToCommentResponse(it) }
        }
        
        return CommentResponse(
            id = comment.id,
            postId = comment.post?.id ?: 0, // safe call 사용
            content = comment.content,
            userId = comment.user.id,
            username = comment.user.username,
            profileImageUrl = comment.user.profileImageUrl,  // profileImage → profileImageUrl로 수정
            createdAt = comment.createdAt,
            updatedAt = comment.updatedAt,
            parentCommentId = comment.parentComment?.id,
            replies = replies,
            isDeleted = comment.isDeleted
        )
    }
    
    private fun convertToAttachmentResponse(attachment: PostAttachment): AttachmentResponse {
        return AttachmentResponse(
            id = attachment.id,
            postId = attachment.post.id,
            originalFileName = attachment.originalFileName,
            fileSize = attachment.fileSize,
            fileType = attachment.fileType,
            downloadUrl = "/api/community/posts/${attachment.post.id}/attachments/${attachment.id}/download",
            createdAt = attachment.createdAt
        )
    }
    
    private fun convertToTagResponse(tag: PostTag): TagResponse {
        return TagResponse(
            id = tag.id,
            name = tag.name,
            postCount = tag.posts.size
        )
    }
}
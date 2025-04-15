package com.syncband.backend.service

import com.syncband.backend.dto.*
import com.syncband.backend.exception.ResourceNotFoundException
import com.syncband.backend.model.*
import com.syncband.backend.repository.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class LearningContentService(
    private val learningContentRepository: LearningContentRepository,
    private val userRepository: UserRepository,
    private val tagRepository: TagRepository,
    private val commentRepository: CommentRepository
) {

    /**
     * 새로운 학습 콘텐츠 생성
     */
    @Transactional
    fun createLearningContent(userId: Long, request: LearningContentCreateRequest): LearningContentDetailResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User not found with id: $userId") }
        
        val learningContent = LearningContent(
            title = request.title,
            description = request.description,
            contentType = ContentType.valueOf(request.contentType),
            contentUrl = request.contentUrl,
            thumbnailUrl = request.thumbnailUrl,
            difficultyLevel = DifficultyLevel.valueOf(request.difficultyLevel),
            author = user
        )
        
        // 태그 처리
        val tags = processTagsForContent(request.tags, learningContent)
        learningContent.tags.addAll(tags)
        
        val savedContent = learningContentRepository.save(learningContent)
        
        return mapToLearningContentDetailResponse(savedContent, emptyList(), 0)
    }
    
    /**
     * 학습 콘텐츠 목록 조회
     */
    @Transactional(readOnly = true)
    fun getLearningContents(pageable: Pageable): Page<LearningContentListResponse> {
        return learningContentRepository.findAll(pageable)
            .map { content ->
                val commentCount = commentRepository.countByLearningContentId(content.id)
                mapToLearningContentListResponse(content, commentCount.toInt())
            }
    }
    
    /**
     * 특정 콘텐츠 타입별 학습 콘텐츠 목록 조회
     */
    @Transactional(readOnly = true)
    fun getLearningContentsByType(contentType: String, pageable: Pageable): Page<LearningContentListResponse> {
        val type = ContentType.valueOf(contentType)
        return learningContentRepository.findByContentType(type, pageable)
            .map { content ->
                val commentCount = commentRepository.countByLearningContentId(content.id)
                mapToLearningContentListResponse(content, commentCount.toInt())
            }
    }
    
    /**
     * 특정 악기 타입별 학습 콘텐츠 목록 조회
     */
    @Transactional(readOnly = true)
    fun getLearningContentsByInstrument(instrumentType: String, pageable: Pageable): Page<LearningContentListResponse> {
        val type = InstrumentType.valueOf(instrumentType)
        return learningContentRepository.findByInstrumentType(type, pageable)
            .map { content ->
                val commentCount = commentRepository.countByLearningContentId(content.id)
                mapToLearningContentListResponse(content, commentCount.toInt())
            }
    }
    
    /**
     * 특정 난이도별 학습 콘텐츠 목록 조회
     */
    @Transactional(readOnly = true)
    fun getLearningContentsByDifficulty(difficultyLevel: String, pageable: Pageable): Page<LearningContentListResponse> {
        val level = DifficultyLevel.valueOf(difficultyLevel)
        return learningContentRepository.findByDifficultyLevel(level, pageable)
            .map { content ->
                val commentCount = commentRepository.countByLearningContentId(content.id)
                mapToLearningContentListResponse(content, commentCount.toInt())
            }
    }
    
    /**
     * 키워드로 학습 콘텐츠 검색
     */
    @Transactional(readOnly = true)
    fun searchLearningContents(keyword: String, pageable: Pageable): Page<LearningContentListResponse> {
        return learningContentRepository.searchByKeyword(keyword, pageable)
            .map { content ->
                val commentCount = commentRepository.countByLearningContentId(content.id)
                mapToLearningContentListResponse(content, commentCount.toInt())
            }
    }
    
    /**
     * 특정 ID의 학습 콘텐츠 상세 조회
     */
    @Transactional
    fun getLearningContentById(contentId: Long): LearningContentDetailResponse {
        val content = learningContentRepository.findById(contentId)
            .orElseThrow { ResourceNotFoundException("Learning content not found with id: $contentId") }
        
        // 조회수 증가
        content.viewCount += 1
        learningContentRepository.save(content)
        
        // 댓글 조회
        val comments = commentRepository.findByLearningContentAndParentIsNullOrderByCreatedAtDesc(
            content, 
            Pageable.unpaged()
        ).content
        
        val commentResponses = comments.map { comment ->
            mapToCommentResponse(comment)
        }
        
        val totalComments = commentRepository.countByLearningContentId(contentId).toInt()
        
        return mapToLearningContentDetailResponse(content, commentResponses, totalComments)
    }
    
    /**
     * 학습 콘텐츠 수정
     */
    @Transactional
    fun updateLearningContent(
        contentId: Long,
        userId: Long,
        request: LearningContentUpdateRequest
    ): LearningContentDetailResponse {
        val content = learningContentRepository.findById(contentId)
            .orElseThrow { ResourceNotFoundException("Learning content not found with id: $contentId") }
        
        // 콘텐츠 작성자만 수정 가능
        if (content.author.id != userId) {
            throw IllegalAccessException("Only the creator can update this content")
        }
        
        // 필드 업데이트
        request.title?.let { content.title = it }
        request.description?.let { content.description = it }
        request.contentType?.let { content.contentType = ContentType.valueOf(it) }
        request.contentUrl?.let { content.contentUrl = it }
        request.thumbnailUrl?.let { content.thumbnailUrl = it }
        request.difficultyLevel?.let { content.difficultyLevel = DifficultyLevel.valueOf(it) }
        
        // 태그 업데이트
        if (request.tags != null) {
            content.tags.clear()
            val tags = processTagsForContent(request.tags, content)
            content.tags.addAll(tags)
        }
        
        content.updatedAt = LocalDateTime.now()
        val updatedContent = learningContentRepository.save(content)
        
        val comments = commentRepository.findByLearningContentAndParentIsNullOrderByCreatedAtDesc(
            updatedContent,
            Pageable.unpaged()
        ).content.map { mapToCommentResponse(it) }
        
        val totalComments = commentRepository.countByLearningContentId(contentId).toInt()
        
        return mapToLearningContentDetailResponse(updatedContent, comments, totalComments)
    }
    
    /**
     * 학습 콘텐츠 삭제
     */
    @Transactional
    fun deleteLearningContent(contentId: Long, userId: Long) {
        val content = learningContentRepository.findById(contentId)
            .orElseThrow { ResourceNotFoundException("Learning content not found with id: $contentId") }
        
        // 콘텐츠 작성자만 삭제 가능
        if (content.author.id != userId) {
            throw IllegalAccessException("Only the creator can delete this content")
        }
        
        // 댓글 삭제
        commentRepository.deleteAllByLearningContentId(contentId)
        
        // 콘텐츠 삭제
        learningContentRepository.delete(content)
    }
    
    /**
     * 댓글 작성
     */
    @Transactional
    fun createComment(contentId: Long, userId: Long, request: CommentCreateRequest): CommentResponse {
        val content = learningContentRepository.findById(contentId)
            .orElseThrow { ResourceNotFoundException("Learning content not found with id: $contentId") }
        
        val user = userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User not found with id: $userId") }
        
        // 부모 댓글이 있는 경우 (답글인 경우)
        var parentComment: Comment? = null
        if (request.parentId != null) {
            parentComment = commentRepository.findById(request.parentId)
                .orElseThrow { ResourceNotFoundException("Parent comment not found with id: ${request.parentId}") }
        }
        
        val comment = Comment(
            content = request.content,
            user = user,
            learningContent = content,
            parentComment = parentComment  // parent → parentComment로 수정
        )
        
        val savedComment = commentRepository.save(comment)
        
        return mapToCommentResponse(savedComment)
    }
    
    /**
     * 댓글 수정
     */
    @Transactional
    fun updateComment(commentId: Long, userId: Long, request: CommentUpdateRequest): CommentResponse {
        val comment = commentRepository.findById(commentId)
            .orElseThrow { ResourceNotFoundException("Comment not found with id: $commentId") }
        
        // 댓글 작성자만 수정 가능
        if (comment.user.id != userId) {
            throw IllegalAccessException("Only the author can update this comment")
        }
        
        comment.content = request.content
        comment.updatedAt = LocalDateTime.now()
        
        val updatedComment = commentRepository.save(comment)
        
        return mapToCommentResponse(updatedComment)
    }
    
    /**
     * 댓글 삭제
     */
    @Transactional
    fun deleteComment(commentId: Long, userId: Long) {
        val comment = commentRepository.findById(commentId)
            .orElseThrow { ResourceNotFoundException("Comment not found with id: $commentId") }
        
        // 댓글 작성자만 삭제 가능
        if (comment.user.id != userId) {
            throw IllegalAccessException("Only the author can delete this comment")
        }
        
        commentRepository.delete(comment)
    }
    
    /**
     * 태그 요청 처리 (존재하지 않는 태그 생성)
     */
    private fun processTagsForContent(tagNames: List<String>, content: LearningContent): Set<Tag> {
        return tagNames.map { tagName ->
            val trimmedName = tagName.trim().lowercase()
            val tag = tagRepository.findByName(trimmedName)
                .orElseGet {
                    val newTag = Tag(name = trimmedName)
                    tagRepository.save(newTag)
                }
            tag
        }.toSet()
    }
    
    /**
     * 태그 목록 조회
     */
    @Transactional(readOnly = true)
    fun getAllTags(): List<TagDto> {
        return tagRepository.findAll().map { mapToTagDto(it) }
    }
    
    /**
     * 인기 태그 목록 조회
     */
    @Transactional(readOnly = true)
    fun getPopularTags(limit: Int): List<TagDto> {
        return tagRepository.findPopularTags(limit).map { mapToTagDto(it) }
    }
    
    /**
     * 태그로 콘텐츠 검색
     */
    @Transactional(readOnly = true)
    fun getLearningContentsByTag(tagName: String, pageable: Pageable): Page<LearningContentListResponse> {
        return learningContentRepository.findByTagName(tagName, pageable)
            .map { content ->
                val commentCount = commentRepository.countByLearningContentId(content.id)
                mapToLearningContentListResponse(content, commentCount.toInt())
            }
    }
    
    /**
     * 학습 콘텐츠 엔티티를 상세 응답 DTO로 변환
     */
    private fun mapToLearningContentDetailResponse(
        content: LearningContent,
        comments: List<CommentResponse>,
        totalComments: Int
    ): LearningContentDetailResponse {
        return LearningContentDetailResponse(
            id = content.id,
            title = content.title,
            description = content.description,
            contentType = content.contentType.name,
            contentUrl = content.contentUrl ?: "",  // null이면 빈 문자열로 처리
            thumbnailUrl = content.thumbnailUrl,
            difficultyLevel = content.difficultyLevel.name,
            instrumentType = null,  // instrumentType 필드가 없으므로 null로 설정
            creator = UserSummary(
                id = content.author.id,
                username = content.author.username,
                profileImageUrl = content.author.profileImageUrl  // profileImage -> profileImageUrl로 수정
            ),
            viewCount = content.viewCount,
            likeCount = content.likeCount,
            createdAt = content.createdAt,
            updatedAt = content.updatedAt ?: content.createdAt,  // null이면 createdAt으로 대체
            tags = content.tags.map { mapToTagDto(it) },
            comments = comments,
            totalComments = totalComments
        )
    }
    
    /**
     * 학습 콘텐츠 엔티티를 목록 응답 DTO로 변환
     */
    private fun mapToLearningContentListResponse(
        content: LearningContent,
        commentCount: Int
    ): LearningContentListResponse {
        return LearningContentListResponse(
            id = content.id,
            title = content.title,
            description = content.description,
            contentType = content.contentType.name,
            thumbnailUrl = content.thumbnailUrl,
            difficultyLevel = content.difficultyLevel.name,
            instrumentType = null,  // instrumentType 필드가 없으므로 null로 설정
            creator = UserSummary(
                id = content.author.id,
                username = content.author.username,
                profileImageUrl = content.author.profileImageUrl  // profileImage -> profileImageUrl로 수정
            ),
            viewCount = content.viewCount,
            likeCount = content.likeCount,
            createdAt = content.createdAt,
            tags = content.tags.map { mapToTagDto(it) },
            commentCount = commentCount
        )
    }
    
    /**
     * 태그 엔티티를 DTO로 변환
     */
    private fun mapToTagDto(tag: Tag): TagDto {
        return TagDto(
            id = tag.id,
            name = tag.name
        )
    }
    
    /**
     * 댓글 엔티티를 응답 DTO로 변환 (재귀적으로 답글 포함)
     */
    private fun mapToCommentResponse(comment: Comment): CommentResponse {
        // 답글 조회 및 변환
        val replies = commentRepository.findByParentCommentOrderByCreatedAtAsc(comment)
            .map { reply -> mapToCommentResponse(reply) }
        
        return CommentResponse(
            id = comment.id,
            content = comment.content,
            user = UserSummary(
                id = comment.user.id,
                username = comment.user.username,
                profileImageUrl = comment.user.profileImageUrl  // profileImage -> profileImageUrl로 수정
            ),
            createdAt = comment.createdAt,
            updatedAt = comment.updatedAt ?: comment.createdAt,  // null이면 createdAt으로 대체
            parentId = comment.parentComment?.id,  // parent → parentComment로 수정
            replies = if (replies.isEmpty()) null else replies
        )
    }
}
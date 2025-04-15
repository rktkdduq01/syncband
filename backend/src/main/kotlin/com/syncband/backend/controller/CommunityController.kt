package com.syncband.backend.controller

import com.syncband.backend.dto.request.community.CommentCreateRequest
import com.syncband.backend.dto.request.community.CommentUpdateRequest
import com.syncband.backend.dto.request.community.PostCreateRequest
import com.syncband.backend.dto.request.community.PostSearchRequest
import com.syncband.backend.dto.request.community.PostUpdateRequest
import com.syncband.backend.dto.response.community.CategoryListResponse
import com.syncband.backend.dto.response.community.CommentResponse
import com.syncband.backend.dto.response.community.PostDetailResponse
import com.syncband.backend.dto.response.community.PostLikeResponse
import com.syncband.backend.dto.response.community.PostListResponse
import com.syncband.backend.dto.response.community.TagListResponse
import com.syncband.backend.security.CurrentUser
import com.syncband.backend.security.UserPrincipal
import com.syncband.backend.service.CommunityService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/community")
class CommunityController(private val communityService: CommunityService) {

    // 게시글 관련 엔드포인트
    @PostMapping("/posts")
    @PreAuthorize("hasRole('USER')")
    fun createPost(
        @CurrentUser userPrincipal: UserPrincipal,
        @RequestPart("post") @Valid postRequest: PostCreateRequest,
        @RequestPart("attachments", required = false) attachments: List<MultipartFile>?
    ): ResponseEntity<PostDetailResponse> {
        val response = communityService.createPost(userPrincipal.id, postRequest, attachments)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @GetMapping("/posts/{postId}")
    fun getPostById(
        @PathVariable postId: Long,
        @CurrentUser userPrincipal: UserPrincipal?
    ): ResponseEntity<PostDetailResponse> {
        val currentUserId = userPrincipal?.id
        val response = communityService.getPostById(postId, currentUserId)
        return ResponseEntity.ok(response)
    }

    @PutMapping("/posts/{postId}")
    @PreAuthorize("hasRole('USER')")
    fun updatePost(
        @PathVariable postId: Long,
        @CurrentUser userPrincipal: UserPrincipal,
        @RequestBody @Valid postRequest: PostUpdateRequest
    ): ResponseEntity<PostDetailResponse> {
        val response = communityService.updatePost(postId, userPrincipal.id, postRequest)
        return ResponseEntity.ok(response)
    }

    @DeleteMapping("/posts/{postId}")
    @PreAuthorize("hasRole('USER')")
    fun deletePost(
        @PathVariable postId: Long,
        @CurrentUser userPrincipal: UserPrincipal
    ): ResponseEntity<Void> {
        communityService.deletePost(postId, userPrincipal.id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/posts")
    fun searchPosts(
        @ModelAttribute searchRequest: PostSearchRequest,
        @CurrentUser userPrincipal: UserPrincipal?
    ): ResponseEntity<PostListResponse> {
        val currentUserId = userPrincipal?.id
        val response = communityService.searchPosts(searchRequest, currentUserId)
        return ResponseEntity.ok(response)
    }

    // 댓글 관련 엔드포인트
    @PostMapping("/posts/{postId}/comments")
    @PreAuthorize("hasRole('USER')")
    fun createComment(
        @PathVariable postId: Long,
        @CurrentUser userPrincipal: UserPrincipal,
        @RequestBody @Valid commentRequest: CommentCreateRequest
    ): ResponseEntity<CommentResponse> {
        val response = communityService.createComment(postId, userPrincipal.id, commentRequest)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @PutMapping("/comments/{commentId}")
    @PreAuthorize("hasRole('USER')")
    fun updateComment(
        @PathVariable commentId: Long,
        @CurrentUser userPrincipal: UserPrincipal,
        @RequestBody @Valid commentRequest: CommentUpdateRequest
    ): ResponseEntity<CommentResponse> {
        val response = communityService.updateComment(commentId, userPrincipal.id, commentRequest)
        return ResponseEntity.ok(response)
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("hasRole('USER')")
    fun deleteComment(
        @PathVariable commentId: Long,
        @CurrentUser userPrincipal: UserPrincipal
    ): ResponseEntity<Void> {
        communityService.deleteComment(commentId, userPrincipal.id)
        return ResponseEntity.noContent().build()
    }

    // 좋아요 관련 엔드포인트
    @PostMapping("/posts/{postId}/like")
    @PreAuthorize("hasRole('USER')")
    fun likePost(
        @PathVariable postId: Long,
        @CurrentUser userPrincipal: UserPrincipal
    ): ResponseEntity<PostLikeResponse> {
        val response = communityService.likePost(postId, userPrincipal.id)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/posts/{postId}/liked")
    @PreAuthorize("hasRole('USER')")
    fun isPostLikedByUser(
        @PathVariable postId: Long,
        @CurrentUser userPrincipal: UserPrincipal
    ): ResponseEntity<Map<String, Boolean>> {
        val isLiked = communityService.isPostLikedByUser(postId, userPrincipal.id)
        return ResponseEntity.ok(mapOf("liked" to isLiked))
    }

    // 카테고리 관련 엔드포인트
    @GetMapping("/categories")
    fun getAllCategories(): ResponseEntity<CategoryListResponse> {
        val response = communityService.getAllCategories()
        return ResponseEntity.ok(response)
    }

    // 태그 관련 엔드포인트
    @GetMapping("/tags")
    fun getAllTags(): ResponseEntity<TagListResponse> {
        val response = communityService.getAllTags()
        return ResponseEntity.ok(response)
    }

    @GetMapping("/tags/top")
    fun getTopTags(@RequestParam(defaultValue = "10") limit: Int): ResponseEntity<TagListResponse> {
        val response = communityService.getTopTags(limit)
        return ResponseEntity.ok(response)
    }
}
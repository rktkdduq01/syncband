package com.syncband.backend.controller

import com.syncband.backend.dto.*
import com.syncband.backend.service.LearningContentService
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/learn")
class LearningContentController(
    private val learningContentService: LearningContentService
) {

    @GetMapping("/contents")
    fun getLearningContents(pageable: Pageable): ResponseEntity<Page<LearningContentListResponse>> {
        val contents = learningContentService.getLearningContents(pageable)
        return ResponseEntity.ok(contents)
    }

    @GetMapping("/contents/type/{contentType}")
    fun getLearningContentsByType(
        @PathVariable contentType: String,
        pageable: Pageable
    ): ResponseEntity<Page<LearningContentListResponse>> {
        val contents = learningContentService.getLearningContentsByType(contentType, pageable)
        return ResponseEntity.ok(contents)
    }

    @GetMapping("/contents/instrument/{instrumentType}")
    fun getLearningContentsByInstrument(
        @PathVariable instrumentType: String,
        pageable: Pageable
    ): ResponseEntity<Page<LearningContentListResponse>> {
        val contents = learningContentService.getLearningContentsByInstrument(instrumentType, pageable)
        return ResponseEntity.ok(contents)
    }

    @GetMapping("/contents/difficulty/{difficultyLevel}")
    fun getLearningContentsByDifficulty(
        @PathVariable difficultyLevel: String,
        pageable: Pageable
    ): ResponseEntity<Page<LearningContentListResponse>> {
        val contents = learningContentService.getLearningContentsByDifficulty(difficultyLevel, pageable)
        return ResponseEntity.ok(contents)
    }

    @GetMapping("/contents/search")
    fun searchLearningContents(
        @RequestParam keyword: String,
        pageable: Pageable
    ): ResponseEntity<Page<LearningContentListResponse>> {
        val contents = learningContentService.searchLearningContents(keyword, pageable)
        return ResponseEntity.ok(contents)
    }

    @GetMapping("/contents/{contentId}")
    fun getLearningContentById(
        @PathVariable contentId: Long
    ): ResponseEntity<LearningContentDetailResponse> {
        val content = learningContentService.getLearningContentById(contentId)
        return ResponseEntity.ok(content)
    }

    @PostMapping("/contents")
    fun createLearningContent(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestBody request: LearningContentCreateRequest
    ): ResponseEntity<LearningContentDetailResponse> {
        val userId = extractUserId(userDetails)
        val createdContent = learningContentService.createLearningContent(userId, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdContent)
    }

    @PutMapping("/contents/{contentId}")
    fun updateLearningContent(
        @PathVariable contentId: Long,
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestBody request: LearningContentUpdateRequest
    ): ResponseEntity<LearningContentDetailResponse> {
        val userId = extractUserId(userDetails)
        val updatedContent = learningContentService.updateLearningContent(contentId, userId, request)
        return ResponseEntity.ok(updatedContent)
    }

    @DeleteMapping("/contents/{contentId}")
    fun deleteLearningContent(
        @PathVariable contentId: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Void> {
        val userId = extractUserId(userDetails)
        learningContentService.deleteLearningContent(contentId, userId)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/contents/tag/{tagName}")
    fun getLearningContentsByTag(
        @PathVariable tagName: String,
        pageable: Pageable
    ): ResponseEntity<Page<LearningContentListResponse>> {
        val contents = learningContentService.getLearningContentsByTag(tagName, pageable)
        return ResponseEntity.ok(contents)
    }

    @GetMapping("/tags")
    fun getAllTags(): ResponseEntity<List<TagDto>> {
        val tags = learningContentService.getAllTags()
        return ResponseEntity.ok(tags)
    }

    @GetMapping("/tags/popular")
    fun getPopularTags(
        @RequestParam(defaultValue = "20") limit: Int
    ): ResponseEntity<List<TagDto>> {
        val tags = learningContentService.getPopularTags(limit)
        return ResponseEntity.ok(tags)
    }

    @PostMapping("/contents/{contentId}/comments")
    fun createComment(
        @PathVariable contentId: Long,
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestBody request: CommentCreateRequest
    ): ResponseEntity<CommentResponse> {
        val userId = extractUserId(userDetails)
        val comment = learningContentService.createComment(contentId, userId, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(comment)
    }

    @PutMapping("/comments/{commentId}")
    fun updateComment(
        @PathVariable commentId: Long,
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestBody request: CommentUpdateRequest
    ): ResponseEntity<CommentResponse> {
        val userId = extractUserId(userDetails)
        val comment = learningContentService.updateComment(commentId, userId, request)
        return ResponseEntity.ok(comment)
    }

    @DeleteMapping("/comments/{commentId}")
    fun deleteComment(
        @PathVariable commentId: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Void> {
        val userId = extractUserId(userDetails)
        learningContentService.deleteComment(commentId, userId)
        return ResponseEntity.noContent().build()
    }

    // Spring Security에서 저장된 사용자 ID를 추출하는 유틸리티 메서드
    private fun extractUserId(userDetails: UserDetails): Long {
        // 실제 구현에서는 UserDetails 구현 클래스에서 사용자 ID를 가져와야 함
        // 아래 코드는 예시로, 실제로는 프로젝트 구현에 맞게 수정필요
        return userDetails.username.toLong()
    }
}
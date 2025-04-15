package com.syncband.backend.dto

import com.syncband.backend.model.ContentType
import com.syncband.backend.model.DifficultyLevel
import com.syncband.backend.model.InstrumentType
import java.time.LocalDateTime

/**
 * 학습 콘텐츠 생성 요청 DTO
 */
data class LearningContentCreateRequest(
    val title: String,
    val description: String,
    val contentType: String,
    val contentUrl: String,
    val thumbnailUrl: String?,
    val instrumentType: String?,
    val difficultyLevel: String,
    val tags: List<String>
)

/**
 * 학습 콘텐츠 수정 요청 DTO
 */
data class LearningContentUpdateRequest(
    val title: String?,
    val description: String?,
    val contentType: String?,
    val contentUrl: String?,
    val thumbnailUrl: String?,
    val instrumentType: String?,
    val difficultyLevel: String?,
    val tags: List<String>?
)

/**
 * 학습 콘텐츠 상세 응답 DTO
 */
data class LearningContentDetailResponse(
    val id: Long,
    val title: String,
    val description: String,
    val contentType: String,
    val contentUrl: String,
    val thumbnailUrl: String?,
    val instrumentType: String?,
    val difficultyLevel: String,
    val creator: UserSummary,
    val viewCount: Int,
    val likeCount: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val tags: List<TagDto>,
    val comments: List<CommentResponse>?,
    val totalComments: Int
)

/**
 * 학습 콘텐츠 목록 응답 DTO
 */
data class LearningContentListResponse(
    val id: Long,
    val title: String,
    val description: String,
    val contentType: String,
    val thumbnailUrl: String?,
    val instrumentType: String?,
    val difficultyLevel: String,
    val creator: UserSummary,
    val viewCount: Int,
    val likeCount: Int,
    val createdAt: LocalDateTime,
    val tags: List<TagDto>,
    val commentCount: Int
)

/**
 * 태그 DTO
 */
data class TagDto(
    val id: Long,
    val name: String
)

/**
 * 댓글 생성 요청 DTO
 */
data class CommentCreateRequest(
    val content: String,
    val parentId: Long?
)

/**
 * 댓글 수정 요청 DTO
 */
data class CommentUpdateRequest(
    val content: String
)

/**
 * 댓글 응답 DTO
 */
data class CommentResponse(
    val id: Long,
    val content: String,
    val user: UserSummary,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val parentId: Long?,
    val replies: List<CommentResponse>?
)
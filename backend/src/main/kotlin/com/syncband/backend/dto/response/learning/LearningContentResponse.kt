package com.syncband.backend.dto.response.learning

import com.syncband.backend.model.ContentType
import com.syncband.backend.model.DifficultyLevel
import com.syncband.backend.model.InstrumentType
import java.time.LocalDateTime

data class LearningContentResponse(
    val id: Long,
    val title: String,
    val content: String,
    val contentType: ContentType,
    val difficultyLevel: DifficultyLevel,
    val instrumentType: InstrumentType?,
    val videoUrl: String?,
    val thumbnailUrl: String?,
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val tags: List<String>,
    val isPublic: Boolean,
    val viewCount: Int,
    val likeCount: Int,
    val commentCount: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?
)

data class LearningContentDetailResponse(
    val id: Long,
    val title: String,
    val content: String,
    val contentType: ContentType,
    val difficultyLevel: DifficultyLevel,
    val instrumentType: InstrumentType?,
    val videoUrl: String?,
    val thumbnailUrl: String?,
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val tags: List<String>,
    val isPublic: Boolean,
    val viewCount: Int,
    val likeCount: Int,
    val comments: List<LearningContentCommentResponse>,
    val isLikedByCurrentUser: Boolean,
    val relatedContents: List<LearningContentSummaryResponse>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?
)

data class LearningContentListResponse(
    val contents: List<LearningContentResponse>,
    val totalCount: Long,
    val page: Int,
    val size: Int,
    val totalPages: Int
)

data class LearningContentSummaryResponse(
    val id: Long,
    val title: String,
    val contentType: ContentType,
    val difficultyLevel: DifficultyLevel,
    val instrumentType: InstrumentType?,
    val thumbnailUrl: String?,
    val username: String,
    val viewCount: Int,
    val createdAt: LocalDateTime
)

data class LearningContentCommentResponse(
    val id: Long,
    val contentId: Long,
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val text: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?
)

data class LearningProgressResponse(
    val contentId: Long,
    val userId: Long,
    val progress: Float,
    val isCompleted: Boolean,
    val lastAccessedAt: LocalDateTime
)

data class LearningContentLikeResponse(
    val contentId: Long,
    val userId: Long,
    val liked: Boolean,
    val likeCount: Int,
    val timestamp: LocalDateTime
)
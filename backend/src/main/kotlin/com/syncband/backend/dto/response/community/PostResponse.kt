package com.syncband.backend.dto.response.community

import java.time.LocalDateTime

data class PostResponse(
    val id: Long,
    val title: String,
    val content: String,
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val categoryId: Long,
    val categoryName: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?,
    val viewCount: Int,
    val likeCount: Int,
    val commentCount: Int,
    val tags: List<String>,
    val isLikedByCurrentUser: Boolean
)

data class PostDetailResponse(
    val id: Long,
    val title: String,
    val content: String,
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val categoryId: Long,
    val categoryName: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?,
    val viewCount: Int,
    val likeCount: Int,
    val commentCount: Int,
    val tags: List<String>,
    val isLikedByCurrentUser: Boolean,
    val comments: List<CommentResponse>,
    val attachments: List<AttachmentResponse>
)

data class PostListResponse(
    val posts: List<PostResponse>,
    val totalCount: Long,
    val page: Int,
    val size: Int,
    val totalPages: Int
)

data class PostLikeResponse(
    val postId: Long,
    val userId: Long,
    val liked: Boolean,
    val likeCount: Int,
    val timestamp: LocalDateTime
)
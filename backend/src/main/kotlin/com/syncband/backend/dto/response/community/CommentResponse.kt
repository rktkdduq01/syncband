package com.syncband.backend.dto.response.community

import java.time.LocalDateTime

data class CommentResponse(
    val id: Long,
    val postId: Long,
    val content: String,
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?,
    val parentCommentId: Long?,
    val replies: List<CommentResponse>,
    val isDeleted: Boolean
)
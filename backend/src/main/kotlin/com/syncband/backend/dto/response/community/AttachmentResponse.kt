package com.syncband.backend.dto.response.community

import java.time.LocalDateTime

data class AttachmentResponse(
    val id: Long,
    val postId: Long,
    val originalFileName: String,
    val fileSize: Long,
    val fileType: String,
    val downloadUrl: String,
    val createdAt: LocalDateTime
)
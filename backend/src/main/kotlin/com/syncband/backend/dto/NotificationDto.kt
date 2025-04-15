package com.syncband.backend.dto

import java.time.LocalDateTime

data class NotificationDto(
    val id: Long,
    val title: String,
    val content: String,
    val type: String,
    val isRead: Boolean,
    val createdAt: LocalDateTime,
    val relatedId: Long?
)

data class NotificationCountResponse(
    val unreadCount: Long
)
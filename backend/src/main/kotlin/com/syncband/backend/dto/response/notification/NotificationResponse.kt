package com.syncband.backend.dto.response.notification

import java.time.LocalDateTime

data class NotificationResponse(
    val id: Long,
    val userId: Long,
    val type: String,
    val title: String,
    val content: String,
    val isRead: Boolean,
    val targetId: Long?,
    val targetType: String?,
    val sourceUserId: Long?,
    val sourceUsername: String?,
    val sourceProfileImageUrl: String?,
    val createdAt: LocalDateTime
)

data class NotificationListResponse(
    val notifications: List<NotificationResponse>,
    val unreadCount: Int,
    val totalCount: Long,
    val page: Int,
    val size: Int,
    val totalPages: Int
)

data class NotificationMarkReadResponse(
    val notificationId: Long,
    val isRead: Boolean,
    val updatedAt: LocalDateTime
)

data class NotificationMarkAllReadResponse(
    val count: Int,
    val updatedAt: LocalDateTime
)

data class NotificationCountResponse(
    val unreadCount: Int,
    val lastNotificationAt: LocalDateTime?
)
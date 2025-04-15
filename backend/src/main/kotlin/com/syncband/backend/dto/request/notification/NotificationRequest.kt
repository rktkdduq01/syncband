package com.syncband.backend.dto.request.notification

import jakarta.validation.constraints.NotBlank

class NotificationMarkReadRequest(
    @field:NotBlank(message = "알림 ID는 필수 입력값입니다")
    val notificationId: Long
)

class NotificationMarkAllReadRequest(
    val before: Long? = null
)

class NotificationSearchRequest(
    val isRead: Boolean? = null,
    
    val page: Int = 0,
    
    val size: Int = 20
)
package com.syncband.backend.controller

import com.syncband.backend.dto.NotificationCountResponse
import com.syncband.backend.dto.NotificationDto
import com.syncband.backend.service.NotificationService
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/notifications")
class NotificationController(
    private val notificationService: NotificationService
) {
    
    @GetMapping
    fun getNotifications(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PageableDefault(size = 10) pageable: Pageable
    ): ResponseEntity<Page<NotificationDto>> {
        val userId = extractUserId(userDetails)
        val notifications = notificationService.getNotifications(userId, pageable)
        return ResponseEntity.ok(notifications)
    }
    
    @GetMapping("/unread-count")
    fun getUnreadCount(
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<NotificationCountResponse> {
        val userId = extractUserId(userDetails)
        val unreadCount = notificationService.countUnreadNotifications(userId)
        return ResponseEntity.ok(NotificationCountResponse(unreadCount))
    }
    
    @PostMapping("/{notificationId}/read")
    fun markAsRead(
        @PathVariable notificationId: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Map<String, Boolean>> {
        val userId = extractUserId(userDetails)
        val success = notificationService.markAsRead(userId, notificationId)
        return ResponseEntity.ok(mapOf("success" to success))
    }
    
    @PostMapping("/mark-all-read")
    fun markAllAsRead(
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Map<String, Int>> {
        val userId = extractUserId(userDetails)
        val count = notificationService.markAllAsRead(userId)
        return ResponseEntity.ok(mapOf("markedCount" to count))
    }
    
    // Spring Security에서 저장된 사용자 ID를 추출하는 유틸리티 메서드
    private fun extractUserId(userDetails: UserDetails): Long {
        // 실제 구현에서는 UserDetails 구현 클래스에서 사용자 ID를 가져와야 함
        // 아래 코드는 예시로, 실제로는 프로젝트 구현에 맞게 수정필요
        return userDetails.username.toLong()
    }
}
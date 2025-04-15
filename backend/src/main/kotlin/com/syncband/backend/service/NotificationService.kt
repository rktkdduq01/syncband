package com.syncband.backend.service

import com.syncband.backend.dto.NotificationDto
import com.syncband.backend.model.Notification
import com.syncband.backend.model.NotificationType
import com.syncband.backend.model.User
import com.syncband.backend.repository.NotificationRepository
import com.syncband.backend.repository.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class NotificationService(
    private val notificationRepository: NotificationRepository,
    private val userRepository: UserRepository,
    private val messagingTemplate: SimpMessagingTemplate
) {

    /**
     * 특정 사용자에게 알림 생성
     */
    @Transactional
    fun createNotification(
        userId: Long,
        title: String,
        content: String,
        type: NotificationType,
        relatedId: Long? = null
    ): NotificationDto {
        val user = userRepository.findById(userId)
            .orElseThrow { IllegalArgumentException("User not found with id: $userId") }

        val notification = Notification(
            user = user,
            title = title,
            content = content,
            type = type,
            relatedId = relatedId
        )

        val savedNotification = notificationRepository.save(notification)
        
        // 실시간 알림을 웹소켓을 통해 전송
        val notificationDto = mapToNotificationDto(savedNotification)
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/notifications",
            notificationDto
        )
        
        return notificationDto
    }

    /**
     * 알림 목록 조회
     */
    @Transactional(readOnly = true)
    fun getNotifications(userId: Long, pageable: Pageable): Page<NotificationDto> {
        val user = userRepository.findById(userId)
            .orElseThrow { IllegalArgumentException("User not found with id: $userId") }
        
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable)
            .map { notification -> mapToNotificationDto(notification) }
    }

    /**
     * 읽지 않은 알림 개수 조회
     */
    @Transactional(readOnly = true)
    fun countUnreadNotifications(userId: Long): Long {
        val user = userRepository.findById(userId)
            .orElseThrow { IllegalArgumentException("User not found with id: $userId") }
        
        return notificationRepository.countByUserAndIsRead(user, false)
    }

    /**
     * 알림을 읽음으로 표시
     */
    @Transactional
    fun markAsRead(userId: Long, notificationId: Long): Boolean {
        val notification = notificationRepository.findById(notificationId)
            .orElseThrow { IllegalArgumentException("Notification not found with id: $notificationId") }
        
        if (notification.user.id != userId) {
            throw IllegalArgumentException("Notification does not belong to the user")
        }
        
        notification.isRead = true
        notificationRepository.save(notification)
        return true
    }

    /**
     * 모든 알림을 읽음으로 표시
     */
    @Transactional
    fun markAllAsRead(userId: Long): Int {
        val user = userRepository.findById(userId)
            .orElseThrow { IllegalArgumentException("User not found with id: $userId") }
        
        return notificationRepository.markAllAsRead(user)
    }

    /**
     * 특정 방의 모든 참가자에게 알림 전송
     */
    @Transactional
    fun notifyRoomParticipants(
        roomId: Long,
        title: String,
        content: String,
        exceptUserId: Long? = null
    ) {
        // 방의 모든 참가자 목록 조회 로직 필요
        // 여기서는 직접 구현하지 않고 추후 구현 예정
    }

    /**
     * 오래된 알림 주기적으로 삭제 (1달 이상된 알림)
     */
    @Scheduled(cron = "0 0 1 * * ?") // 매일 새벽 1시에 실행
    @Transactional
    fun cleanupOldNotifications() {
        val beforeDate = LocalDateTime.now().minusMonths(1)
        notificationRepository.deleteOldNotifications(beforeDate)
    }

    /**
     * Notification 엔티티를 DTO로 변환
     */
    private fun mapToNotificationDto(notification: Notification): NotificationDto {
        return NotificationDto(
            id = notification.id,
            title = notification.title,
            content = notification.content,
            type = notification.type.name,
            isRead = notification.isRead,
            createdAt = notification.createdAt,
            relatedId = notification.relatedId
        )
    }
}
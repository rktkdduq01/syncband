package com.syncband.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "notifications")
class Notification(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    var user: User,
    
    @Column(nullable = false)
    var title: String,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    var content: String,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    var type: NotificationType,
    
    @Column(name = "is_read", nullable = false)
    var isRead: Boolean = false,
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "related_id")
    var relatedId: Long? = null
)

enum class NotificationType {
    SYSTEM,    // 시스템 알림
    ROOM,      // 방 관련 알림
    USER,      // 사용자 관련 알림
    TRACK      // 트랙 관련 알림
}
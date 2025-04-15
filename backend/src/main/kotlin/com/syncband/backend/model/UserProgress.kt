package com.syncband.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "user_progress")
class UserProgress(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learning_content_id", nullable = false)
    val learningContent: LearningContent,
    
    @Column(nullable = false)
    var progress: Float = 0.0f,  // 0.0 ~ 1.0 사이의 값 (0% ~ 100%)
    
    @Column(nullable = false)
    var isCompleted: Boolean = false,
    
    @Column(name = "last_accessed_at", nullable = false)
    var lastAccessedAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "completed_at")
    var completedAt: LocalDateTime? = null,
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
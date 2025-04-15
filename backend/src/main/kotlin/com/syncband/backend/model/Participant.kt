package com.syncband.backend.model

import java.time.LocalDateTime
import jakarta.persistence.*

@Entity
@Table(name = "participants", 
       uniqueConstraints = [UniqueConstraint(columnNames = ["user_id", "room_id"])])
data class Participant(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(name = "user_id", nullable = false)
    val userId: Long,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    val room: SyncRoom,
    
    @Column(nullable = false)
    var joinedAt: LocalDateTime = LocalDateTime.now(),
    
    @Column
    var leftAt: LocalDateTime? = null,
    
    @Column(nullable = false)
    var isActive: Boolean = true,
    
    @Column
    var role: String = "MEMBER",  // OWNER, MEMBER 등의 역할
    
    @Column
    var lastActiveAt: LocalDateTime = LocalDateTime.now()
)
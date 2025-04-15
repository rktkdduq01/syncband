package com.syncband.backend.model

import java.time.LocalDateTime
import jakarta.persistence.*

@Entity
@Table(name = "sync_rooms")
data class SyncRoom(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    var name: String,
    
    @Column
    var description: String? = null,
    
    @Column(name = "owner_id", nullable = false)
    val ownerId: Long,
    
    @Column(nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column
    var closedAt: LocalDateTime? = null,
    
    @Column(nullable = false)
    var isActive: Boolean = true,
    
    @Column(nullable = false)
    var maxParticipants: Int = 10,
    
    @Column(nullable = false)
    var isPublic: Boolean = true,
    
    @Column
    var password: String? = null,
    
    @OneToMany(mappedBy = "room", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var participants: MutableList<Participant> = mutableListOf(),
    
    @Column(name = "project_id")
    var currentProjectId: Long? = null
)
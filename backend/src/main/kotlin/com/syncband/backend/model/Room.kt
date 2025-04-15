package com.syncband.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "rooms")
class Room(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    var name: String,
    
    @Column(nullable = true)
    var description: String? = null,
    
    @Column(name = "is_public", nullable = false)
    var isPublic: Boolean = true,
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "max_participants", nullable = false)
    var maxParticipants: Int = 10,
    
    @ManyToMany(mappedBy = "rooms", fetch = FetchType.LAZY)
    var participants: MutableList<User> = mutableListOf(),
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    var owner: User,
    
    @OneToMany(mappedBy = "room", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var tracks: MutableList<Track> = mutableListOf()
)
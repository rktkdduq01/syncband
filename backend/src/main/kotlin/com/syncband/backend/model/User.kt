// src/main/kotlin/com/syncband/backend/model/User.kt
package com.syncband.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, length = 50, unique = true)
    var username: String,
    
    @Column(nullable = false, length = 100, unique = true)
    var email: String,
    
    @Column(nullable = false)
    var password: String,
    
    @Column(length = 100)
    var fullName: String? = null,
    
    @Column(length = 255)
    var profileImageUrl: String? = null,
    
    @Column(length = 500)
    var bio: String? = null,
    
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(nullable = false)
    var isActive: Boolean = true,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    var role: UserRole = UserRole.USER,
    
    @OneToMany(mappedBy = "author", cascade = [CascadeType.ALL], orphanRemoval = true)
    val learningContents: MutableList<LearningContent> = mutableListOf(),
    
    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
    val comments: MutableList<Comment> = mutableListOf(),
    
    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val tracks: MutableList<Track> = mutableListOf(),
    
    @ManyToMany
    @JoinTable(
        name = "user_rooms",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "room_id")]
    )
    val rooms: MutableList<Room> = mutableListOf()
)
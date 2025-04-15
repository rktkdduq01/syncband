package com.syncband.backend.model

import java.time.LocalDateTime
import jakarta.persistence.*

@Entity
@Table(name = "mix_projects")
data class MixProject(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    var name: String,
    
    @Column
    var description: String? = null,
    
    @Column(nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column
    var updatedAt: LocalDateTime? = null,
    
    @Column(name = "user_id", nullable = false)
    var userId: Long,
    
    @OneToMany(mappedBy = "project", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var tracks: MutableList<AudioTrack> = mutableListOf(),
    
    @Column
    var bpm: Int = 120,
    
    @Column
    var isPublic: Boolean = false
)
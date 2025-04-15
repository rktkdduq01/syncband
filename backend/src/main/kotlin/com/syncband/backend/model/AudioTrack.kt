package com.syncband.backend.model

import java.time.LocalDateTime
import jakarta.persistence.*

@Entity
@Table(name = "audio_tracks")
data class AudioTrack(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    var name: String,
    
    @Column(nullable = false)
    var filePath: String,
    
    @Column(nullable = false)
    var duration: Double = 0.0,  // 초 단위
    
    @Column
    var volume: Float = 1.0f,    // 0.0 ~ 1.0
    
    @Column
    var muted: Boolean = false,
    
    @Column(nullable = false)
    var fileSize: Long = 0,      // 바이트 단위
    
    @Column(nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column
    var updatedAt: LocalDateTime? = null,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    var project: MixProject
)
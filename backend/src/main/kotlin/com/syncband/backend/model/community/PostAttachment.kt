package com.syncband.backend.model.community

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "post_attachments")
class PostAttachment(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    val post: Post,
    
    @Column(nullable = false)
    val originalFileName: String,
    
    @Column(nullable = false)
    val storedFileName: String,
    
    @Column(nullable = false)
    val filePath: String,
    
    @Column(nullable = false)
    val fileSize: Long,
    
    @Column(nullable = false)
    val fileType: String,
    
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(nullable = false)
    var isDeleted: Boolean = false
)
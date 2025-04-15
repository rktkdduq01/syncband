package com.syncband.backend.model

import com.syncband.backend.model.community.PostComment
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "community_posts")
class Community(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    var title: String,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    var content: String,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val author: User,
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    var category: Category,
    
    @ManyToMany
    @JoinTable(
        name = "community_post_tags",
        joinColumns = [JoinColumn(name = "post_id")],
        inverseJoinColumns = [JoinColumn(name = "tag_id")]
    )
    val tags: MutableSet<Tag> = mutableSetOf(),
    
    @OneToMany(mappedBy = "community", cascade = [CascadeType.ALL], orphanRemoval = true)
    val comments: MutableList<PostComment> = mutableListOf(),
    
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(nullable = false)
    var viewCount: Int = 0,
    
    @Column(nullable = false)
    var likeCount: Int = 0,
    
    @Column(nullable = false)
    var commentCount: Int = 0,
    
    @Column
    var thumbnailUrl: String? = null,
    
    @Column(nullable = false)
    var isPublished: Boolean = true,
    
    @Column(nullable = false)
    var isPinned: Boolean = false
)
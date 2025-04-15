package com.syncband.backend.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "learning_contents")
class LearningContent(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    var title: String,
    
    @Column(nullable = false, columnDefinition = "TEXT")
    var description: String,
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var contentType: ContentType,
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    var difficultyLevel: DifficultyLevel,
    
    @Column
    var thumbnailUrl: String? = null,
    
    @Column
    var contentUrl: String? = null,
    
    @Column
    var duration: Int? = null, // 콘텐츠 재생 시간(초)
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    val author: User,
    
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column
    var updatedAt: LocalDateTime? = null,
    
    @Column
    var viewCount: Int = 0,
    
    @Column
    var likeCount: Int = 0,
    
    @OneToMany(mappedBy = "learningContent", cascade = [CascadeType.ALL], orphanRemoval = true)
    val comments: MutableList<Comment> = mutableListOf(),
    
    @ManyToMany
    @JoinTable(
        name = "learning_content_tags",
        joinColumns = [JoinColumn(name = "learning_content_id")],
        inverseJoinColumns = [JoinColumn(name = "tag_id")]
    )
    val tags: MutableSet<Tag> = mutableSetOf(),
    
    @OneToMany(mappedBy = "learningContent", cascade = [CascadeType.ALL], orphanRemoval = true)
    val userProgresses: MutableList<UserProgress> = mutableListOf()
)

// ContentType, DifficultyLevel, Comment 클래스는 각각 별도의 파일에 이미 정의되어 있으므로 여기서 제거했습니다.
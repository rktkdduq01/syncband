package com.syncband.backend.model

import jakarta.persistence.*

@Entity
@Table(name = "tags")
class Tag(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(unique = true, nullable = false)
    var name: String,
    
    @ManyToMany(mappedBy = "tags")
    val learningContents: MutableSet<LearningContent> = mutableSetOf()
)
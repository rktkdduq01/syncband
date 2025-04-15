package com.syncband.backend.model.community

import jakarta.persistence.*

@Entity
@Table(name = "post_tags")
class PostTag(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, unique = true)
    val name: String,
    
    @ManyToMany(mappedBy = "tags")
    val posts: MutableSet<Post> = mutableSetOf()
)
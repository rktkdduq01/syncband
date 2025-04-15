package com.syncband.backend.model.community

import jakarta.persistence.*

@Entity(name = "CommunityCategory")
@Table(name = "categories")
class Category(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, unique = true)
    val name: String,
    
    @Column(nullable = true)
    val description: String? = null,
    
    @OneToMany(mappedBy = "category", cascade = [CascadeType.ALL])
    val posts: MutableList<Post> = mutableListOf(),
    
    @Column(nullable = false)
    val displayOrder: Int = 0,
    
    @Column(nullable = false)
    val isActive: Boolean = true
)
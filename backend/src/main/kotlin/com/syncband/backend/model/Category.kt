package com.syncband.backend.model

import jakarta.persistence.*

@Entity(name = "MainCategory")
@Table(name = "categories")
class Category(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, unique = true)
    var name: String,
    
    @Column
    var description: String? = null,
    
    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    val posts: MutableList<Community> = mutableListOf()
)
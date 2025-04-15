package com.syncband.backend.model

import jakarta.persistence.*

@Entity
@Table(name = "roles")
class Role(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, unique = true, length = 20)
    var name: String = "ROLE_USER",
    
    @OneToMany(mappedBy = "role")
    val users: MutableList<User> = mutableListOf()
)
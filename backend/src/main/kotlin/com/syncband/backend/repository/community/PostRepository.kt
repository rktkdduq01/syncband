package com.syncband.backend.repository.community

import com.syncband.backend.model.User
import com.syncband.backend.model.community.Category
import com.syncband.backend.model.community.Post
import com.syncband.backend.model.community.PostTag
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface PostRepository : JpaRepository<Post, Long> {
    
    fun findByUser(user: User, pageable: Pageable): Page<Post>
    
    fun findByCategory(category: Category, pageable: Pageable): Page<Post>
    
    fun findByTagsContaining(tag: PostTag, pageable: Pageable): Page<Post>
    
    @Query("SELECT p FROM Post p WHERE p.title LIKE %:keyword% OR p.content LIKE %:keyword%")
    fun searchByKeyword(keyword: String, pageable: Pageable): Page<Post>
    
    @Query("SELECT p FROM Post p WHERE p.isDeleted = false")
    fun findAllActive(pageable: Pageable): Page<Post>
    
    @Query("SELECT p FROM Post p WHERE p.isDeleted = false AND p.user = :user")
    fun findAllActiveByUser(user: User, pageable: Pageable): Page<Post>
    
    @Query("SELECT p FROM Post p WHERE p.isDeleted = false AND p.category = :category")
    fun findAllActiveByCategory(category: Category, pageable: Pageable): Page<Post>
    
    @Query("SELECT p FROM Post p WHERE p.isDeleted = false AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%)")
    fun searchActiveByKeyword(keyword: String, pageable: Pageable): Page<Post>
    
    @Query("SELECT COUNT(p) FROM Post p WHERE p.user = :user AND p.isDeleted = false")
    fun countByUser(user: User): Long
}
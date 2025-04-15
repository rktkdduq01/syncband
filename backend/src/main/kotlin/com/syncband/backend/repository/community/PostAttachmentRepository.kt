package com.syncband.backend.repository.community

import com.syncband.backend.model.community.Post
import com.syncband.backend.model.community.PostAttachment
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface PostAttachmentRepository : JpaRepository<PostAttachment, Long> {
    
    fun findByPost(post: Post): List<PostAttachment>
    
    @Query("SELECT a FROM PostAttachment a WHERE a.post = :post AND a.isDeleted = false")
    fun findActiveByPost(post: Post): List<PostAttachment>
    
    @Query("SELECT COUNT(a) FROM PostAttachment a WHERE a.post = :post AND a.isDeleted = false")
    fun countActiveByPost(post: Post): Int
}
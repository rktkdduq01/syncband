package com.syncband.backend.repository.community

import com.syncband.backend.model.User
import com.syncband.backend.model.community.Post
import com.syncband.backend.model.community.PostLike
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface PostLikeRepository : JpaRepository<PostLike, Long> {
    
    fun findByPostAndUser(post: Post, user: User): PostLike?
    
    @Query("SELECT COUNT(pl) FROM PostLike pl WHERE pl.post = :post")
    fun countByPost(post: Post): Long
    
    fun existsByPostAndUser(post: Post, user: User): Boolean
    
    fun deleteByPostAndUser(post: Post, user: User)
}
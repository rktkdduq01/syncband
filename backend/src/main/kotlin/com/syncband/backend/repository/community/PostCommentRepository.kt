package com.syncband.backend.repository.community

import com.syncband.backend.model.User
import com.syncband.backend.model.community.Post
import com.syncband.backend.model.community.PostComment
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface PostCommentRepository : JpaRepository<PostComment, Long> {
    
    fun findByPost(post: Post, pageable: Pageable): Page<PostComment>
    
    @Query("SELECT c FROM PostComment c WHERE c.post = :post AND c.parentComment IS NULL AND c.isDeleted = false ORDER BY c.createdAt ASC")
    fun findRootCommentsByPost(post: Post, pageable: Pageable): Page<PostComment>
    
    @Query("SELECT c FROM PostComment c WHERE c.parentComment = :parentComment AND c.isDeleted = false ORDER BY c.createdAt ASC")
    fun findRepliesByParentComment(parentComment: PostComment): List<PostComment>
    
    @Query("SELECT COUNT(c) FROM PostComment c WHERE c.post = :post AND c.isDeleted = false")
    fun countActiveCommentsByPost(post: Post): Int
    
    fun findByUser(user: User, pageable: Pageable): Page<PostComment>
    
    @Query("SELECT c FROM PostComment c WHERE c.isDeleted = false AND c.user = :user")
    fun findAllActiveByUser(user: User, pageable: Pageable): Page<PostComment>
}
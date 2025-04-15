package com.syncband.backend.repository

import com.syncband.backend.model.Comment
import com.syncband.backend.model.LearningContent
import com.syncband.backend.model.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
interface CommentRepository : JpaRepository<Comment, Long> {
    
    // 특정 학습 콘텐츠에 달린 최상위 댓글 조회 (페이징)
    fun findByLearningContentAndParentIsNullOrderByCreatedAtDesc(
        learningContent: LearningContent,
        pageable: Pageable
    ): Page<Comment>
    
    // 특정 학습 콘텐츠에 달린 모든 댓글 조회
    fun findByLearningContentOrderByCreatedAtAsc(learningContent: LearningContent): List<Comment>
    
    // 특정 부모 댓글에 달린 답글 조회
    fun findByParentCommentOrderByCreatedAtAsc(parentComment: Comment): List<Comment>
    
    // 특정 사용자가 작성한 모든 댓글 조회
    fun findByUserOrderByCreatedAtDesc(user: User, pageable: Pageable): Page<Comment>
    
    // 특정 학습 콘텐츠에 달린 댓글 수
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.learningContent.id = :contentId")
    fun countByLearningContentId(@Param("contentId") contentId: Long): Long
    
    // 특정 부모 댓글에 달린 답글 수
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.parentComment = (SELECT p FROM Comment p WHERE p.id = :parentId)")
    fun countByParentId(@Param("parentId") parentId: Long): Long
    
    // 특정 학습 콘텐츠의 댓글 및 모든 답글 삭제
    @Modifying
    @Transactional
    @Query("DELETE FROM Comment c WHERE c.learningContent.id = :contentId")
    fun deleteAllByLearningContentId(@Param("contentId") contentId: Long)
}
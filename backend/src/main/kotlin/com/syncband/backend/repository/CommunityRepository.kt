package com.syncband.backend.repository

import com.syncband.backend.model.Community
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CommunityRepository : JpaRepository<Community, Long> {
    // 제목으로 커뮤니티 게시글 검색
    fun findByTitleContainingIgnoreCase(title: String): List<Community>
    
    // 작성자 ID로 커뮤니티 게시글 검색
    fun findByAuthorId(authorId: Long): List<Community>
    
    // 최신순으로 정렬된 인기 게시글 조회 (좋아요 수 기준)
    fun findTop10ByOrderByLikesCountDescCreatedAtDesc(): List<Community>
}
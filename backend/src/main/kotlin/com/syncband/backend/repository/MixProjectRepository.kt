package com.syncband.backend.repository

import com.syncband.backend.model.MixProject
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MixProjectRepository : JpaRepository<MixProject, Long> {
    // 사용자별 프로젝트 조회
    fun findByUserId(userId: Long): List<MixProject>
    
    // 이름으로 프로젝트 검색
    fun findByNameContainingIgnoreCase(name: String): List<MixProject>
    
    // 최근 업데이트된 프로젝트 조회
    fun findTop10ByUserIdOrderByUpdatedAtDesc(userId: Long): List<MixProject>
    
    // 공개된 프로젝트 조회
    fun findByIsPublicTrue(): List<MixProject>
}
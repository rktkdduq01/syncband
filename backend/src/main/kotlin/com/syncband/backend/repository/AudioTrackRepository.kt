package com.syncband.backend.repository

import com.syncband.backend.model.AudioTrack
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AudioTrackRepository : JpaRepository<AudioTrack, Long> {
    // 프로젝트별 오디오 트랙 조회
    fun findByProjectId(projectId: Long): List<AudioTrack>
    
    // 이름으로 오디오 트랙 검색
    fun findByNameContainingIgnoreCase(name: String): List<AudioTrack>
    
    // 프로젝트별 트랙 개수 조회
    fun countByProjectId(projectId: Long): Long
}
package com.syncband.backend.repository

import com.syncband.backend.model.SyncRoom
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SyncRoomRepository : JpaRepository<SyncRoom, Long> {
    // 활성화된 동기화 방 조회
    fun findByIsActiveTrue(): List<SyncRoom>
    
    // 공개된 동기화 방 조회
    fun findByIsPublicTrueAndIsActiveTrue(): List<SyncRoom>
}
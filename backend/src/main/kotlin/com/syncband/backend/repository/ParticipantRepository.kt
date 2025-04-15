package com.syncband.backend.repository

import com.syncband.backend.model.Participant
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ParticipantRepository : JpaRepository<Participant, Long> {
    fun findByRoomIdAndUserId(roomId: Long, userId: Long): Participant?
    fun countByRoomIdAndIsActiveTrue(roomId: Long): Int
}
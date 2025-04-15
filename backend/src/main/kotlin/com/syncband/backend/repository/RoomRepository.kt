package com.syncband.backend.repository

import com.syncband.backend.model.Room
import com.syncband.backend.model.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface RoomRepository : JpaRepository<Room, Long> {
    fun findByIsPublic(isPublic: Boolean, pageable: Pageable): Page<Room>
    
    fun findByOwner(owner: User, pageable: Pageable): Page<Room>
    
    @Query("SELECT r FROM Room r JOIN r.participants p WHERE p.id = :userId")
    fun findRoomsByParticipantId(userId: Long, pageable: Pageable): Page<Room>
    
    @Query("SELECT r FROM Room r WHERE r.isPublic = true AND LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    fun searchPublicRoomsByName(keyword: String, pageable: Pageable): Page<Room>
}
package com.syncband.backend.repository

import com.syncband.backend.model.InstrumentType
import com.syncband.backend.model.Room
import com.syncband.backend.model.Track
import com.syncband.backend.model.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TrackRepository : JpaRepository<Track, Long> {
    fun findByUser(user: User, pageable: Pageable): Page<Track>
    fun findByRoom(room: Room, pageable: Pageable): Page<Track>
    fun findByRoomAndInstrumentType(room: Room, instrumentType: InstrumentType, pageable: Pageable): Page<Track>
    fun findByUserAndRoom(user: User, room: Room, pageable: Pageable): Page<Track>
    fun countByRoom(room: Room): Long
}
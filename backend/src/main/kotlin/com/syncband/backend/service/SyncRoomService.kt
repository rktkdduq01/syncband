package com.syncband.backend.service

import com.syncband.backend.exception.BadRequestException
import com.syncband.backend.exception.ForbiddenException
import com.syncband.backend.exception.ResourceNotFoundException
import com.syncband.backend.model.Participant
import com.syncband.backend.model.SyncRoom
import com.syncband.backend.repository.ParticipantRepository
import com.syncband.backend.repository.SyncRoomRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class SyncRoomService(
    private val syncRoomRepository: SyncRoomRepository,
    private val participantRepository: ParticipantRepository
) {
    // 동기화 방 생성
    fun createRoom(name: String, description: String?, ownerId: Long, maxParticipants: Int, isPublic: Boolean, password: String?): SyncRoom {
        val room = SyncRoom(
            name = name,
            description = description,
            ownerId = ownerId,
            maxParticipants = maxParticipants,
            isPublic = isPublic,
            password = password
        )
        
        val savedRoom = syncRoomRepository.save(room)
        
        // 방장을 첫 번째 참가자로 등록
        val owner = Participant(
            userId = ownerId,
            room = savedRoom,
            role = "OWNER"
        )
        participantRepository.save(owner)
        
        return savedRoom
    }
    
    // 동기화 방 조회
    fun getRoom(id: Long): SyncRoom {
        return syncRoomRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("ID가 ${id}인 동기화 방을 찾을 수 없습니다") }
    }
    
    // 활성 상태인 모든 동기화 방 조회
    fun getAllActiveRooms(): List<SyncRoom> {
        return syncRoomRepository.findByIsActiveTrue()
    }
    
    // 공개된 활성 동기화 방만 조회
    fun getPublicRooms(): List<SyncRoom> {
        return syncRoomRepository.findByIsPublicTrueAndIsActiveTrue()
    }
    
    // 동기화 방 업데이트
    fun updateRoom(id: Long, name: String?, description: String?, maxParticipants: Int?, isPublic: Boolean?, password: String?, userId: Long): SyncRoom {
        val room = getRoom(id)
        
        // 방장만 방 정보를 수정할 수 있음
        if (room.ownerId != userId) {
            throw ForbiddenException("방장만 방 정보를 수정할 수 있습니다")
        }
        
        name?.let { room.name = it }
        description?.let { room.description = it }
        maxParticipants?.let { room.maxParticipants = it }
        isPublic?.let { room.isPublic = it }
        password?.let { room.password = it }
        
        return syncRoomRepository.save(room)
    }
    
    // 방 참가
    fun joinRoom(roomId: Long, userId: Long, password: String?): Participant {
        val room = getRoom(roomId)
        
        // 방이 활성 상태인지 확인
        if (!room.isActive) {
            throw BadRequestException("비활성화된 방에 참가할 수 없습니다")
        }
        
        // 비밀번호 확인 (비밀번호가 설정된 방인 경우)
        if (!room.isPublic && room.password != null && room.password != password) {
            throw ForbiddenException("잘못된 비밀번호입니다")
        }
        
        // 참가자 수 제한 확인
        val activeParticipants = participantRepository.countByRoomIdAndIsActiveTrue(roomId)
        if (activeParticipants >= room.maxParticipants) {
            throw BadRequestException("방이 가득 찼습니다")
        }
        
        // 이미 참가한 사용자인지 확인
        val existingParticipant = participantRepository.findByRoomIdAndUserId(roomId, userId)
        if (existingParticipant != null) {
            if (existingParticipant.isActive) {
                throw BadRequestException("이미 방에 참가 중입니다")
            } else {
                // 이전에 나간 참가자라면 다시 활성화
                existingParticipant.isActive = true
                existingParticipant.joinedAt = LocalDateTime.now()
                existingParticipant.leftAt = null
                return participantRepository.save(existingParticipant)
            }
        }
        
        // 새 참가자 생성
        val participant = Participant(
            userId = userId,
            room = room,
            role = "MEMBER"
        )
        
        return participantRepository.save(participant)
    }
    
    // 방 나가기
    fun leaveRoom(roomId: Long, userId: Long): Participant {
        val participant = participantRepository.findByRoomIdAndUserId(roomId, userId)
            ?: throw ResourceNotFoundException("해당 방에 참가 중이 아닙니다")
        
        participant.isActive = false
        participant.leftAt = LocalDateTime.now()
        
        return participantRepository.save(participant)
    }
    
    // 방 삭제 (비활성화)
    fun deleteRoom(id: Long, userId: Long) {
        val room = getRoom(id)
        
        // 방장만 방을 삭제할 수 있음
        if (room.ownerId != userId) {
            throw ForbiddenException("방장만 방을 삭제할 수 있습니다")
        }
        
        room.isActive = false
        room.closedAt = LocalDateTime.now()
        
        syncRoomRepository.save(room)
    }
}
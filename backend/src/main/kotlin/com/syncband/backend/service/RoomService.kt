package com.syncband.backend.service

import com.syncband.backend.dto.*
import com.syncband.backend.event.*
import com.syncband.backend.exception.AccessDeniedException
import com.syncband.backend.exception.ResourceNotFoundException
import com.syncband.backend.model.Room
import com.syncband.backend.model.User
import com.syncband.backend.repository.RoomRepository
import com.syncband.backend.repository.UserRepository
import org.springframework.context.ApplicationEventPublisher
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class RoomService(
    private val roomRepository: RoomRepository,
    private val userRepository: UserRepository,
    private val eventPublisher: ApplicationEventPublisher
) {

    @Transactional
    fun createRoom(ownerId: Long, request: RoomCreateRequest): RoomResponse {
        val owner = userRepository.findById(ownerId)
            .orElseThrow { ResourceNotFoundException("User not found with id: $ownerId") }

        val room = Room(
            name = request.name,
            description = request.description,
            isPublic = request.isPublic,
            maxParticipants = request.maxParticipants,
            owner = owner
        )

        // 방 생성자를 참가자 목록에 추가
        owner.rooms.add(room)
        room.participants.add(owner)

        val savedRoom = roomRepository.save(room)
        
        // 방 생성 이벤트 발행
        eventPublisher.publishEvent(RoomCreatedEvent(this, savedRoom.id, ownerId))
        
        return mapToRoomResponse(savedRoom)
    }

    @Transactional(readOnly = true)
    fun getRoomById(roomId: Long): RoomResponse {
        val room = roomRepository.findById(roomId)
            .orElseThrow { ResourceNotFoundException("Room not found with id: $roomId") }
        
        return mapToRoomResponse(room)
    }

    @Transactional(readOnly = true)
    fun getPublicRooms(pageable: Pageable): Page<RoomListResponse> {
        return roomRepository.findByIsPublic(true, pageable)
            .map { room -> mapToRoomListResponse(room) }
    }

    @Transactional(readOnly = true)
    fun searchRooms(keyword: String, pageable: Pageable): Page<RoomListResponse> {
        return roomRepository.searchPublicRoomsByName(keyword, pageable)
            .map { room -> mapToRoomListResponse(room) }
    }

    @Transactional(readOnly = true)
    fun getRoomsByUser(userId: Long, pageable: Pageable): Page<RoomListResponse> {
        return roomRepository.findRoomsByParticipantId(userId, pageable)
            .map { room -> mapToRoomListResponse(room) }
    }

    @Transactional(readOnly = true)
    fun getOwnedRooms(userId: Long, pageable: Pageable): Page<RoomListResponse> {
        val owner = userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User not found with id: $userId") }
        
        return roomRepository.findByOwner(owner, pageable)
            .map { room -> mapToRoomListResponse(room) }
    }

    @Transactional
    fun updateRoom(roomId: Long, userId: Long, request: RoomUpdateRequest): RoomResponse {
        val room = roomRepository.findById(roomId)
            .orElseThrow { ResourceNotFoundException("Room not found with id: $roomId") }

        // 방장만 방 정보 업데이트 가능
        if (room.owner.id != userId) {
            throw AccessDeniedException("Only the room owner can update the room")
        }

        request.name?.let { room.name = it }
        request.description?.let { room.description = it }
        request.isPublic?.let { room.isPublic = it }
        request.maxParticipants?.let { room.maxParticipants = it }
        
        room.updatedAt = LocalDateTime.now()
        
        val updatedRoom = roomRepository.save(room)
        
        // 방 업데이트 이벤트 발행
        eventPublisher.publishEvent(RoomUpdatedEvent(this, updatedRoom.id, userId))
        
        return mapToRoomResponse(updatedRoom)
    }

    @Transactional
    fun deleteRoom(roomId: Long, userId: Long) {
        val room = roomRepository.findById(roomId)
            .orElseThrow { ResourceNotFoundException("Room not found with id: $roomId") }

        // 방장만 방 삭제 가능
        if (room.owner.id != userId) {
            throw AccessDeniedException("Only the room owner can delete the room")
        }

        roomRepository.delete(room)
        
        // 방 삭제 이벤트 발행
        eventPublisher.publishEvent(RoomDeletedEvent(this, roomId, userId))
    }

    @Transactional
    fun joinRoom(roomId: Long, userId: Long): RoomResponse {
        val room = roomRepository.findById(roomId)
            .orElseThrow { ResourceNotFoundException("Room not found with id: $roomId") }
        
        val user = userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User not found with id: $userId") }

        // 이미 참여 중인지 확인
        if (room.participants.any { it.id == userId }) {
            return mapToRoomResponse(room)
        }

        // 최대 참여 인원 확인
        if (room.participants.size >= room.maxParticipants) {
            throw IllegalStateException("Room is full")
        }

        // 비공개방인 경우 초대 여부 확인 (추후 구현 필요)
        if (!room.isPublic) {
            // 초대 로직 구현 필요
        }

        room.participants.add(user)
        user.rooms.add(room)
        
        val updatedRoom = roomRepository.save(room)
        
        // 사용자 방 참가 이벤트 발행
        eventPublisher.publishEvent(UserJoinedRoomEvent(this, roomId, userId))
        
        return mapToRoomResponse(updatedRoom)
    }

    @Transactional
    fun leaveRoom(roomId: Long, userId: Long) {
        val room = roomRepository.findById(roomId)
            .orElseThrow { ResourceNotFoundException("Room not found with id: $roomId") }
        
        val user = userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User not found with id: $userId") }

        // 방장은 방을 떠날 수 없음 (방을 삭제해야 함)
        if (room.owner.id == userId) {
            throw IllegalStateException("Room owner cannot leave the room. Delete the room instead.")
        }

        room.participants.removeIf { it.id == userId }
        user.rooms.removeIf { it.id == roomId }
        
        roomRepository.save(room)
        
        // 사용자 방 퇴장 이벤트 발행
        eventPublisher.publishEvent(UserLeftRoomEvent(this, roomId, userId))
    }

    // Room 엔티티를 RoomResponse DTO로 매핑하는 유틸리티 메서드
    private fun mapToRoomResponse(room: Room): RoomResponse {
        return RoomResponse(
            id = room.id,
            name = room.name,
            description = room.description,
            isPublic = room.isPublic,
            createdAt = room.createdAt,
            updatedAt = room.updatedAt,
            maxParticipants = room.maxParticipants,
            currentParticipants = room.participants.size,
            owner = mapToUserSummary(room.owner)
        )
    }

    // Room 엔티티를 간략한 RoomListResponse DTO로 매핑하는 유틸리티 메서드
    private fun mapToRoomListResponse(room: Room): RoomListResponse {
        return RoomListResponse(
            id = room.id,
            name = room.name,
            description = room.description,
            isPublic = room.isPublic,
            createdAt = room.createdAt,
            participantCount = room.participants.size,
            maxParticipants = room.maxParticipants,
            owner = mapToUserSummary(room.owner)
        )
    }

    // User 엔티티를 UserSummary DTO로 매핑하는 유틸리티 메서드
    private fun mapToUserSummary(user: User): UserSummary {
        return UserSummary(
            id = user.id,
            username = user.username,
            profileImageUrl = user.profileImageUrl
        )
    }
}
package com.syncband.backend.service

import com.syncband.backend.dto.TrackCreateRequest
import com.syncband.backend.dto.TrackResponse
import com.syncband.backend.dto.TrackUpdateRequest
import com.syncband.backend.dto.UserSummary
import com.syncband.backend.event.TrackCreatedEvent
import com.syncband.backend.event.TrackDeletedEvent
import com.syncband.backend.event.TrackUpdatedEvent
import com.syncband.backend.exception.AccessDeniedException
import com.syncband.backend.exception.ResourceNotFoundException
import com.syncband.backend.model.InstrumentType
import com.syncband.backend.model.Track
import com.syncband.backend.repository.RoomRepository
import com.syncband.backend.repository.TrackRepository
import com.syncband.backend.repository.UserRepository
import com.syncband.backend.util.ModelMappers
import org.springframework.context.ApplicationEventPublisher
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.time.LocalDateTime
import java.util.UUID

@Service
class TrackService(
    private val trackRepository: TrackRepository,
    private val roomRepository: RoomRepository,
    private val userRepository: UserRepository,
    private val eventPublisher: ApplicationEventPublisher
) {
    // 파일 저장 경로
    private val uploadDir: Path = Paths.get("uploads/tracks")

    init {
        // 업로드 디렉토리 생성
        Files.createDirectories(uploadDir)
    }

    @Transactional
    fun uploadTrack(
        userId: Long,
        roomId: Long,
        request: TrackCreateRequest,
        file: MultipartFile
    ): TrackResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User not found with id: $userId") }

        val room = roomRepository.findById(roomId)
            .orElseThrow { ResourceNotFoundException("Room not found with id: $roomId") }

        // 사용자가 방에 참여했는지 확인
        if (!room.participants.any { it.id == userId }) {
            throw AccessDeniedException("User is not a participant of this room")
        }

        // 파일 저장
        val fileName = "${UUID.randomUUID()}_${file.originalFilename}"
        val filePath = uploadDir.resolve(fileName)
        Files.copy(file.inputStream, filePath)

        // 트랙 정보 저장
        val track = Track(
            name = request.name,
            description = request.description,
            fileUrl = "/api/tracks/files/$fileName",
            instrumentType = request.instrumentType,
            user = user,
            room = room
        )

        val savedTrack = trackRepository.save(track)
        
        // 트랙을 사용자와 방에 연결
        user.tracks.add(savedTrack)
        room.tracks.add(savedTrack)
        
        // 트랙 생성 이벤트 발행
        eventPublisher.publishEvent(TrackCreatedEvent(this, savedTrack.id, roomId, userId))
        
        return ModelMappers.mapTrackToResponse(savedTrack)
    }

    @Transactional(readOnly = true)
    fun getTrackById(trackId: Long): TrackResponse {
        val track = trackRepository.findById(trackId)
            .orElseThrow { ResourceNotFoundException("Track not found with id: $trackId") }
        
        return ModelMappers.mapTrackToResponse(track)
    }

    @Transactional(readOnly = true)
    fun getTracksByRoom(roomId: Long, pageable: Pageable): Page<TrackResponse> {
        val room = roomRepository.findById(roomId)
            .orElseThrow { ResourceNotFoundException("Room not found with id: $roomId") }
        
        return trackRepository.findByRoom(room, pageable)
            .map { track -> ModelMappers.mapTrackToResponse(track) }
    }

    @Transactional(readOnly = true)
    fun getTracksByRoomAndInstrument(
        roomId: Long,
        instrumentType: InstrumentType,
        pageable: Pageable
    ): Page<TrackResponse> {
        val room = roomRepository.findById(roomId)
            .orElseThrow { ResourceNotFoundException("Room not found with id: $roomId") }
        
        return trackRepository.findByRoomAndInstrumentType(room, instrumentType, pageable)
            .map { track -> ModelMappers.mapTrackToResponse(track) }
    }

    @Transactional(readOnly = true)
    fun getTracksByUser(userId: Long, pageable: Pageable): Page<TrackResponse> {
        val user = userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User not found with id: $userId") }
        
        return trackRepository.findByUser(user, pageable)
            .map { track -> ModelMappers.mapTrackToResponse(track) }
    }

    @Transactional
    fun updateTrack(trackId: Long, userId: Long, request: TrackUpdateRequest): TrackResponse {
        val track = trackRepository.findById(trackId)
            .orElseThrow { ResourceNotFoundException("Track not found with id: $trackId") }

        // 트랙 소유자만 수정 가능
        if (track.user.id != userId) {
            throw AccessDeniedException("Only the track owner can update the track")
        }

        request.name?.let { track.name = it }
        request.description?.let { track.description = it }
        request.instrumentType?.let { track.instrumentType = it }
        
        track.updatedAt = LocalDateTime.now()
        
        val updatedTrack = trackRepository.save(track)
        
        // 트랙 업데이트 이벤트 발행
        eventPublisher.publishEvent(TrackUpdatedEvent(this, updatedTrack.id, track.room.id, userId))
        
        return ModelMappers.mapTrackToResponse(updatedTrack)
    }

    @Transactional
    fun deleteTrack(trackId: Long, userId: Long) {
        val track = trackRepository.findById(trackId)
            .orElseThrow { ResourceNotFoundException("Track not found with id: $trackId") }

        // 트랙 소유자와 방장만 삭제 가능
        if (track.user.id != userId && track.room.owner.id != userId) {
            throw AccessDeniedException("Only the track owner or room owner can delete the track")
        }

        val roomId = track.room.id

        // 파일 시스템에서 파일 삭제
        val fileName = track.fileUrl.substringAfterLast("/")
        val filePath = uploadDir.resolve(fileName)
        Files.deleteIfExists(filePath)

        trackRepository.delete(track)
        
        // 트랙 삭제 이벤트 발행
        eventPublisher.publishEvent(TrackDeletedEvent(this, trackId, roomId, userId))
    }
}
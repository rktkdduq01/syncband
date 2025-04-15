package com.syncband.backend.controller

import com.syncband.backend.dto.TrackCreateRequest
import com.syncband.backend.dto.TrackResponse
import com.syncband.backend.dto.TrackUpdateRequest
import com.syncband.backend.dto.TrackUploadResponse
import com.syncband.backend.model.InstrumentType
import com.syncband.backend.service.TrackService
import jakarta.validation.Valid
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Path
import java.nio.file.Paths

@RestController
@RequestMapping("/api/tracks")
class TrackController(private val trackService: TrackService) {

    private val uploadDir: Path = Paths.get("uploads/tracks")

    @PostMapping("/{roomId}/upload")
    fun uploadTrack(
        @PathVariable roomId: Long,
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestParam("file") file: MultipartFile,
        @Valid @ModelAttribute request: TrackCreateRequest
    ): ResponseEntity<TrackResponse> {
        val userId = extractUserId(userDetails)
        val trackResponse = trackService.uploadTrack(userId, roomId, request, file)
        return ResponseEntity.status(HttpStatus.CREATED).body(trackResponse)
    }

    @GetMapping("/{trackId}")
    fun getTrackById(@PathVariable trackId: Long): ResponseEntity<TrackResponse> {
        val track = trackService.getTrackById(trackId)
        return ResponseEntity.ok(track)
    }

    @GetMapping("/room/{roomId}")
    fun getTracksByRoom(
        @PathVariable roomId: Long,
        @PageableDefault(size = 20) pageable: Pageable
    ): ResponseEntity<Page<TrackResponse>> {
        val tracks = trackService.getTracksByRoom(roomId, pageable)
        return ResponseEntity.ok(tracks)
    }

    @GetMapping("/room/{roomId}/instrument/{instrumentType}")
    fun getTracksByRoomAndInstrument(
        @PathVariable roomId: Long,
        @PathVariable instrumentType: InstrumentType,
        @PageableDefault(size = 20) pageable: Pageable
    ): ResponseEntity<Page<TrackResponse>> {
        val tracks = trackService.getTracksByRoomAndInstrument(roomId, instrumentType, pageable)
        return ResponseEntity.ok(tracks)
    }

    @GetMapping("/user")
    fun getTracksByUser(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PageableDefault(size = 20) pageable: Pageable
    ): ResponseEntity<Page<TrackResponse>> {
        val userId = extractUserId(userDetails)
        val tracks = trackService.getTracksByUser(userId, pageable)
        return ResponseEntity.ok(tracks)
    }

    @PutMapping("/{trackId}")
    fun updateTrack(
        @PathVariable trackId: Long,
        @AuthenticationPrincipal userDetails: UserDetails,
        @Valid @RequestBody request: TrackUpdateRequest
    ): ResponseEntity<TrackResponse> {
        val userId = extractUserId(userDetails)
        val updatedTrack = trackService.updateTrack(trackId, userId, request)
        return ResponseEntity.ok(updatedTrack)
    }

    @DeleteMapping("/{trackId}")
    fun deleteTrack(
        @PathVariable trackId: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Map<String, String>> {
        val userId = extractUserId(userDetails)
        trackService.deleteTrack(trackId, userId)
        return ResponseEntity.ok(mapOf("message" to "Track deleted successfully"))
    }

    @GetMapping("/files/{fileName:.+}")
    fun downloadFile(@PathVariable fileName: String): ResponseEntity<Resource> {
        val file = uploadDir.resolve(fileName)
        val resource = UrlResource(file.toUri())

        if (resource.exists() && resource.isReadable) {
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"${resource.filename}\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource)
        } else {
            return ResponseEntity.notFound().build()
        }
    }

    // Spring Security에서 저장된 사용자 ID를 추출하는 유틸리티 메서드
    private fun extractUserId(userDetails: UserDetails): Long {
        // 실제 구현에서는 UserDetails 구현 클래스에서 사용자 ID를 가져와야 함
        // 아래 코드는 예시로, 실제로는 프로젝트 구현에 맞게 수정필요
        return userDetails.username.toLong()
    }
}
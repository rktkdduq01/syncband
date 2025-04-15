package com.syncband.backend.controller

import com.syncband.backend.dto.RoomCreateRequest
import com.syncband.backend.dto.RoomListResponse
import com.syncband.backend.dto.RoomResponse
import com.syncband.backend.dto.RoomUpdateRequest
import com.syncband.backend.service.RoomService
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/rooms")
class RoomController(private val roomService: RoomService) {

    @PostMapping
    fun createRoom(
        @AuthenticationPrincipal userDetails: UserDetails,
        @Valid @RequestBody request: RoomCreateRequest
    ): ResponseEntity<RoomResponse> {
        // UserDetails에서 사용자 ID를 추출 (Spring Security 컨텍스트에서 가져와야 함)
        val userId = extractUserId(userDetails)
        val room = roomService.createRoom(userId, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(room)
    }

    @GetMapping("/{roomId}")
    fun getRoomById(@PathVariable roomId: Long): ResponseEntity<RoomResponse> {
        val room = roomService.getRoomById(roomId)
        return ResponseEntity.ok(room)
    }

    @GetMapping("/public")
    fun getPublicRooms(
        @PageableDefault(size = 10) pageable: Pageable
    ): ResponseEntity<Page<RoomListResponse>> {
        val rooms = roomService.getPublicRooms(pageable)
        return ResponseEntity.ok(rooms)
    }

    @GetMapping("/search")
    fun searchRooms(
        @RequestParam keyword: String,
        @PageableDefault(size = 10) pageable: Pageable
    ): ResponseEntity<Page<RoomListResponse>> {
        val rooms = roomService.searchRooms(keyword, pageable)
        return ResponseEntity.ok(rooms)
    }

    @GetMapping("/my")
    fun getMyRooms(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PageableDefault(size = 10) pageable: Pageable
    ): ResponseEntity<Page<RoomListResponse>> {
        val userId = extractUserId(userDetails)
        val rooms = roomService.getRoomsByUser(userId, pageable)
        return ResponseEntity.ok(rooms)
    }

    @GetMapping("/owned")
    fun getOwnedRooms(
        @AuthenticationPrincipal userDetails: UserDetails,
        @PageableDefault(size = 10) pageable: Pageable
    ): ResponseEntity<Page<RoomListResponse>> {
        val userId = extractUserId(userDetails)
        val rooms = roomService.getOwnedRooms(userId, pageable)
        return ResponseEntity.ok(rooms)
    }

    @PutMapping("/{roomId}")
    fun updateRoom(
        @PathVariable roomId: Long,
        @AuthenticationPrincipal userDetails: UserDetails,
        @Valid @RequestBody request: RoomUpdateRequest
    ): ResponseEntity<RoomResponse> {
        val userId = extractUserId(userDetails)
        val updatedRoom = roomService.updateRoom(roomId, userId, request)
        return ResponseEntity.ok(updatedRoom)
    }

    @DeleteMapping("/{roomId}")
    fun deleteRoom(
        @PathVariable roomId: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Map<String, String>> {
        val userId = extractUserId(userDetails)
        roomService.deleteRoom(roomId, userId)
        return ResponseEntity.ok(mapOf("message" to "Room deleted successfully"))
    }

    @PostMapping("/{roomId}/join")
    fun joinRoom(
        @PathVariable roomId: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<RoomResponse> {
        val userId = extractUserId(userDetails)
        val room = roomService.joinRoom(roomId, userId)
        return ResponseEntity.ok(room)
    }

    @PostMapping("/{roomId}/leave")
    fun leaveRoom(
        @PathVariable roomId: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Map<String, String>> {
        val userId = extractUserId(userDetails)
        roomService.leaveRoom(roomId, userId)
        return ResponseEntity.ok(mapOf("message" to "Left room successfully"))
    }

    // Spring Security에서 저장된 사용자 ID를 추출하는 유틸리티 메서드
    private fun extractUserId(userDetails: UserDetails): Long {
        // 실제 구현에서는 UserDetails 구현 클래스에서 사용자 ID를 가져와야 함
        // 아래 코드는 예시로, 실제로는 프로젝트 구현에 맞게 수정필요
        return userDetails.username.toLong()
    }
}
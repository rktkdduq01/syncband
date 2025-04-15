package com.syncband.backend.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/rooms")
class SyncRoomController {

    // 동기화 방 생성
    @PostMapping
    fun createRoom(@RequestBody roomRequest: Map<String, Any>): ResponseEntity<Map<String, Any>> {
        // 방 생성 로직
        val room = HashMap<String, Any>().apply {
            put("id", "room-${System.currentTimeMillis()}")
            put("name", roomRequest["name"] ?: "Unnamed Room")
            put("capacity", roomRequest["capacity"] ?: 10)
            put("owner", roomRequest["owner"] ?: "anonymous")
            put("createdAt", System.currentTimeMillis())
            put("participants", listOf<String>())
        }
        
        return ResponseEntity(room, HttpStatus.CREATED)
    }
    
    // 특정 방 조회
    @GetMapping("/{id}")
    fun getRoom(@PathVariable id: String): ResponseEntity<Map<String, Any>> {
        // 방 조회 로직
        val room = HashMap<String, Any>().apply {
            put("id", id)
            put("name", "Jam Session Room")
            put("participants", listOf("user1", "user2"))
            put("createdAt", System.currentTimeMillis())
        }
        
        return ResponseEntity(room, HttpStatus.OK)
    }
    
    // 모든 방 목록 조회
    @GetMapping
    fun getAllRooms(): ResponseEntity<List<Map<String, Any>>> {
        // 모든 방 조회 로직
        val room1 = HashMap<String, Any>().apply {
            put("id", "room-1")
            put("name", "Rock Session")
            put("participantCount", 3)
        }
        
        val room2 = HashMap<String, Any>().apply {
            put("id", "room-2")
            put("name", "Jazz Session")
            put("participantCount", 2)
        }
        
        val rooms = listOf(room1, room2)
        
        return ResponseEntity(rooms, HttpStatus.OK)
    }
    
    // 방 참가
    @PostMapping("/{id}/join")
    fun joinRoom(@PathVariable id: String, @RequestBody userInfo: Map<String, String>): ResponseEntity<Map<String, Any>> {
        // 방 참가 로직
        val response = HashMap<String, Any>().apply {
            put("roomId", id)
            put("user", userInfo["userId"] ?: "unknown")
            put("joined", true)
            put("message", "성공적으로 방에 참가했습니다.")
        }
        
        return ResponseEntity(response, HttpStatus.OK)
    }
    
    // 방 나가기
    @PostMapping("/{id}/leave")
    fun leaveRoom(@PathVariable id: String, @RequestBody userInfo: Map<String, String>): ResponseEntity<Map<String, Any>> {
        // 방 나가기 로직
        val response = HashMap<String, Any>().apply {
            put("roomId", id)
            put("user", userInfo["userId"] ?: "unknown")
            put("left", true)
            put("message", "성공적으로 방을 나갔습니다.")
        }
        
        return ResponseEntity(response, HttpStatus.OK)
    }
    
    // 방 설정 업데이트
    @PutMapping("/{id}")
    fun updateRoom(@PathVariable id: String, @RequestBody updates: Map<String, Any>): ResponseEntity<Map<String, Any>> {
        // 방 업데이트 로직
        val updatedRoom = HashMap<String, Any>().apply {
            put("id", id)
            put("name", updates["name"] ?: "Unnamed Room")
            put("capacity", updates["capacity"] ?: 10)
            put("updated", true)
        }
        
        return ResponseEntity(updatedRoom, HttpStatus.OK)
    }
    
    // 방 삭제
    @DeleteMapping("/{id}")
    fun deleteRoom(@PathVariable id: String): ResponseEntity<Map<String, String>> {
        // 방 삭제 로직
        val response = HashMap<String, String>().apply {
            put("message", "동기화 방이 성공적으로 삭제되었습니다")
            put("id", id)
        }
        
        return ResponseEntity(response, HttpStatus.OK)
    }
}
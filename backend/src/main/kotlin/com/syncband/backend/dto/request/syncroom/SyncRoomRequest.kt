package com.syncband.backend.dto.request.syncroom

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

class SyncRoomCreateRequest(
    @field:NotBlank(message = "방 이름은 필수 입력값입니다")
    @field:Size(min = 2, max = 100, message = "방 이름은 2자 이상 100자 이하여야 합니다")
    val name: String,
    
    val description: String? = null,
    
    val password: String? = null,
    
    val maxParticipants: Int = 10,
    
    val isPrivate: Boolean = false
)

class SyncRoomJoinRequest(
    val password: String? = null
)

class SyncRoomUpdateRequest(
    @field:Size(min = 2, max = 100, message = "방 이름은 2자 이상 100자 이하여야 합니다")
    val name: String? = null,
    
    val description: String? = null,
    
    val password: String? = null,
    
    val isPrivate: Boolean? = null
)

class SyncRoomMessageRequest(
    @field:NotBlank(message = "메시지 내용은 필수 입력값입니다")
    @field:Size(max = 500, message = "메시지는 500자를 초과할 수 없습니다")
    val content: String
)
package com.syncband.backend.dto.request.room

import com.syncband.backend.model.InstrumentType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

class RoomCreateRequest(
    @field:NotBlank(message = "방 이름은 필수 입력값입니다")
    @field:Size(min = 2, max = 100, message = "방 이름은 2자 이상 100자 이하여야 합니다")
    val name: String,
    
    val description: String? = null,
    
    val password: String? = null,
    
    val maxParticipants: Int = 10,
    
    val isPrivate: Boolean = false,
    
    val allowSpectators: Boolean = true,
    
    val tags: List<String>? = null
)

class RoomUpdateRequest(
    @field:Size(min = 2, max = 100, message = "방 이름은 2자 이상 100자 이하여야 합니다")
    val name: String? = null,
    
    val description: String? = null,
    
    val password: String? = null,
    
    val maxParticipants: Int? = null,
    
    val isPrivate: Boolean? = null,
    
    val allowSpectators: Boolean? = null,
    
    val tags: List<String>? = null
)

class RoomJoinRequest(
    val password: String? = null,
    
    @field:NotBlank(message = "악기 유형은 필수 입력값입니다")
    val instrumentType: InstrumentType
)

class RoomSearchRequest(
    val keyword: String? = null,
    
    val tags: List<String>? = null,
    
    val includePrivate: Boolean = false,
    
    val includePassword: Boolean = false,
    
    val page: Int = 0,
    
    val size: Int = 20
)
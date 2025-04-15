package com.syncband.backend.dto.request.track

import com.syncband.backend.model.InstrumentType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

class TrackCreateRequest(
    @field:NotBlank(message = "트랙 이름은 필수 입력값입니다")
    @field:Size(min = 1, max = 100, message = "트랙 이름은 1자 이상 100자 이하여야 합니다")
    val name: String,
    
    val description: String? = null,
    
    @field:NotBlank(message = "악기 유형은 필수 입력값입니다")
    val instrumentType: InstrumentType,
    
    val isPublic: Boolean = true,
    
    val tags: List<String>? = null
)

class TrackUpdateRequest(
    @field:Size(min = 1, max = 100, message = "트랙 이름은 1자 이상 100자 이하여야 합니다")
    val name: String? = null,
    
    val description: String? = null,
    
    val isPublic: Boolean? = null,
    
    val tags: List<String>? = null
)

class TrackSearchRequest(
    val keyword: String? = null,
    
    val instrumentType: InstrumentType? = null,
    
    val userId: Long? = null,
    
    val tags: List<String>? = null,
    
    val includePrivate: Boolean = false,
    
    val page: Int = 0,
    
    val size: Int = 20,
    
    val sortBy: String = "createdAt",
    
    val sortDirection: String = "DESC"
)
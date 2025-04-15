package com.syncband.backend.dto.request.mix

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

class MixProjectCreateRequest(
    @field:NotBlank(message = "프로젝트 이름은 필수 입력값입니다")
    @field:Size(min = 1, max = 100, message = "프로젝트 이름은 1자 이상 100자 이하여야 합니다")
    val name: String,
    
    val description: String? = null,
    
    val isPublic: Boolean = true,
    
    val tags: List<String>? = null,
    
    val trackIds: List<Long>? = null
)

class MixProjectUpdateRequest(
    @field:Size(min = 1, max = 100, message = "프로젝트 이름은 1자 이상 100자 이하여야 합니다")
    val name: String? = null,
    
    val description: String? = null,
    
    val isPublic: Boolean? = null,
    
    val tags: List<String>? = null
)

class MixProjectAddTrackRequest(
    @field:NotBlank(message = "트랙 ID는 필수 입력값입니다")
    val trackId: Long
)

class MixProjectRemoveTrackRequest(
    @field:NotBlank(message = "트랙 ID는 필수 입력값입니다")
    val trackId: Long
)

class MixProjectSearchRequest(
    val keyword: String? = null,
    
    val userId: Long? = null,
    
    val tags: List<String>? = null,
    
    val includePrivate: Boolean = false,
    
    val page: Int = 0,
    
    val size: Int = 20,
    
    val sortBy: String = "createdAt",
    
    val sortDirection: String = "DESC"
)
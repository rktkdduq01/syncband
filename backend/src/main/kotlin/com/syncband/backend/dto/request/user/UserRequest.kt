package com.syncband.backend.dto.request.user

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

class UserUpdateRequest(
    @field:NotBlank(message = "사용자 이름은 필수 입력값입니다")
    @field:Size(min = 2, max = 50, message = "사용자 이름은 2자 이상 50자 이하여야 합니다")
    val username: String,
    
    val profileImageUrl: String? = null,
    
    val bio: String? = null
)

class UserSearchRequest(
    val username: String? = null,
    val email: String? = null,
    val page: Int = 0,
    val size: Int = 20
)

class UserFollowRequest(
    @field:NotBlank(message = "사용자 ID는 필수 입력값입니다")
    val targetUserId: Long
)
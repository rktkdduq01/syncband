package com.syncband.backend.dto.request.auth

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

class LoginRequest(
    @field:NotBlank(message = "이메일은 필수 입력값입니다")
    @field:Email(message = "유효한 이메일 주소를 입력해주세요")
    val email: String,

    @field:NotBlank(message = "비밀번호는 필수 입력값입니다")
    val password: String
)

class RegisterRequest(
    @field:NotBlank(message = "이메일은 필수 입력값입니다")
    @field:Email(message = "유효한 이메일 주소를 입력해주세요")
    val email: String,

    @field:NotBlank(message = "비밀번호는 필수 입력값입니다")
    @field:Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다")
    val password: String,

    @field:NotBlank(message = "사용자 이름은 필수 입력값입니다")
    @field:Size(min = 2, max = 50, message = "사용자 이름은 2자 이상 50자 이하여야 합니다")
    val username: String,

    val profileImageUrl: String? = null
)

class TokenRefreshRequest(
    @field:NotBlank(message = "리프레시 토큰은 필수 입력값입니다")
    val refreshToken: String
)

class PasswordResetRequest(
    @field:NotBlank(message = "이메일은 필수 입력값입니다")
    @field:Email(message = "유효한 이메일 주소를 입력해주세요")
    val email: String
)

class PasswordChangeRequest(
    @field:NotBlank(message = "현재 비밀번호는 필수 입력값입니다")
    val currentPassword: String,

    @field:NotBlank(message = "새 비밀번호는 필수 입력값입니다")
    @field:Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다")
    val newPassword: String
)
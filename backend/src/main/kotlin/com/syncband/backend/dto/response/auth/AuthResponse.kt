package com.syncband.backend.dto.response.auth

import java.time.LocalDateTime

data class LoginResponse(
    val accessToken: String,
    val refreshToken: String,
    val userId: Long,
    val username: String,
    val email: String,
    val profileImageUrl: String?,
    val expiresIn: Long
)

data class RegisterResponse(
    val userId: Long,
    val username: String,
    val email: String,
    val profileImageUrl: String?,
    val createdAt: LocalDateTime
)

data class TokenRefreshResponse(
    val accessToken: String,
    val refreshToken: String,
    val expiresIn: Long
)

data class PasswordResetResponse(
    val message: String,
    val email: String,
    val resetRequestedAt: LocalDateTime
)

data class PasswordChangeResponse(
    val message: String,
    val updatedAt: LocalDateTime
)

data class AuthErrorResponse(
    val error: String,
    val message: String,
    val timestamp: LocalDateTime = LocalDateTime.now()
)
package com.syncband.backend.dto

import java.time.LocalDateTime

data class UserProfileResponse(
    val id: Long,
    val username: String,
    val email: String,
    val fullName: String?,
    val profileImageUrl: String?,
    val bio: String?,
    val role: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class UserProfileUpdateRequest(
    val fullName: String? = null,
    val bio: String? = null
)

data class PasswordChangeRequest(
    val currentPassword: String,
    val newPassword: String,
    val confirmPassword: String
)
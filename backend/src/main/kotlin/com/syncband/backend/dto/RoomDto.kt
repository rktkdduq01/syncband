package com.syncband.backend.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

data class RoomCreateRequest(
    @field:NotBlank(message = "Room name is required")
    @field:Size(min = 3, max = 50, message = "Room name must be between 3 and 50 characters")
    val name: String,
    
    val description: String?,
    
    val isPublic: Boolean = true,
    
    @field:Min(value = 2, message = "Minimum 2 participants required")
    @field:Max(value = 20, message = "Maximum 20 participants allowed")
    val maxParticipants: Int = 10
)

data class RoomUpdateRequest(
    @field:Size(min = 3, max = 50, message = "Room name must be between 3 and 50 characters")
    val name: String?,
    
    val description: String?,
    
    val isPublic: Boolean?,
    
    @field:Min(value = 2, message = "Minimum 2 participants required")
    @field:Max(value = 20, message = "Maximum 20 participants allowed")
    val maxParticipants: Int?
)

data class RoomResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val isPublic: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val maxParticipants: Int,
    val currentParticipants: Int,
    val owner: UserSummary
)

data class UserSummary(
    val id: Long,
    val username: String,
    val profileImageUrl: String?
)

data class RoomListResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val isPublic: Boolean,
    val createdAt: LocalDateTime,
    val participantCount: Int,
    val maxParticipants: Int,
    val owner: UserSummary
)
package com.syncband.backend.dto.response.syncroom

import java.time.LocalDateTime

data class SyncRoomResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val ownerId: Long,
    val ownerUsername: String,
    val currentParticipants: Int,
    val maxParticipants: Int,
    val isPrivate: Boolean,
    val hasPassword: Boolean,
    val createdAt: LocalDateTime,
    val isActive: Boolean
)

data class SyncRoomDetailResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val ownerId: Long,
    val ownerUsername: String,
    val ownerProfileImageUrl: String?,
    val currentParticipants: Int,
    val maxParticipants: Int,
    val isPrivate: Boolean,
    val hasPassword: Boolean,
    val participants: List<SyncRoomParticipantResponse>,
    val createdAt: LocalDateTime,
    val isActive: Boolean,
    val sessionId: String
)

data class SyncRoomListResponse(
    val rooms: List<SyncRoomResponse>,
    val totalCount: Long,
    val page: Int,
    val size: Int,
    val totalPages: Int
)

data class SyncRoomParticipantResponse(
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val joinedAt: LocalDateTime,
    val isOwner: Boolean
)

data class SyncRoomJoinResponse(
    val roomId: Long,
    val success: Boolean,
    val message: String,
    val sessionId: String?,
    val joinedAt: LocalDateTime
)

data class SyncRoomMessageResponse(
    val messageId: Long,
    val roomId: Long,
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val content: String,
    val timestamp: LocalDateTime
)
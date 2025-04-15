package com.syncband.backend.dto.response.room

import com.syncband.backend.model.InstrumentType
import java.time.LocalDateTime

data class RoomResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val ownerId: Long,
    val ownerUsername: String,
    val currentParticipants: Int,
    val maxParticipants: Int,
    val isPrivate: Boolean,
    val hasPassword: Boolean,
    val allowSpectators: Boolean,
    val tags: List<String>,
    val createdAt: LocalDateTime,
    val isActive: Boolean
)

data class RoomDetailResponse(
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
    val allowSpectators: Boolean,
    val tags: List<String>,
    val participants: List<RoomParticipantResponse>,
    val createdAt: LocalDateTime,
    val isActive: Boolean,
    val sessionId: String
)

data class RoomListResponse(
    val rooms: List<RoomResponse>,
    val totalCount: Long,
    val page: Int,
    val size: Int,
    val totalPages: Int
)

data class RoomParticipantResponse(
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val instrumentType: InstrumentType,
    val joinedAt: LocalDateTime,
    val isOwner: Boolean,
    val isSpectator: Boolean
)

data class RoomJoinResponse(
    val roomId: Long,
    val success: Boolean,
    val message: String,
    val sessionId: String?,
    val joinedAt: LocalDateTime
)

data class RoomMessageResponse(
    val messageId: Long,
    val roomId: Long,
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val content: String,
    val timestamp: LocalDateTime
)

data class RoomSessionInfoResponse(
    val roomId: Long,
    val sessionId: String,
    val participantCount: Int,
    val startTime: LocalDateTime,
    val duration: Long // 세션 지속 시간(초)
)

data class RoomInviteResponse(
    val inviteId: String,
    val roomId: Long,
    val inviterId: Long,
    val inviterUsername: String,
    val roomName: String,
    val expiresAt: LocalDateTime
)
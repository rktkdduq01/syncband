package com.syncband.backend.dto.response.track

import com.syncband.backend.model.InstrumentType
import java.time.LocalDateTime

data class TrackResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val instrumentType: InstrumentType,
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val audioUrl: String,
    val waveformData: List<Float>?,
    val duration: Float,
    val isPublic: Boolean,
    val tags: List<String>,
    val likeCount: Int,
    val commentCount: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?
)

data class TrackDetailResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val instrumentType: InstrumentType,
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val audioUrl: String,
    val waveformData: List<Float>?,
    val duration: Float,
    val isPublic: Boolean,
    val tags: List<String>,
    val likeCount: Int,
    val commentCount: Int,
    val isLikedByCurrentUser: Boolean,
    val comments: List<TrackCommentResponse>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?
)

data class TrackListResponse(
    val tracks: List<TrackResponse>,
    val totalCount: Long,
    val page: Int,
    val size: Int,
    val totalPages: Int
)

data class TrackCommentResponse(
    val id: Long,
    val trackId: Long,
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val content: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?
)

data class TrackLikeResponse(
    val trackId: Long,
    val userId: Long,
    val liked: Boolean,
    val likeCount: Int,
    val timestamp: LocalDateTime
)

data class TrackUploadResponse(
    val id: Long,
    val name: String,
    val audioUrl: String,
    val waveformData: List<Float>?,
    val duration: Float,
    val uploadedAt: LocalDateTime
)

data class TrackAnalysisResponse(
    val trackId: Long,
    val bpm: Float,
    val key: String,
    val loudness: Float,
    val waveformData: List<Float>,
    val frequencyData: Map<String, List<Float>>,
    val analyzedAt: LocalDateTime
)
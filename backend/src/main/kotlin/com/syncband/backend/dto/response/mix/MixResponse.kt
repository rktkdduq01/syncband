package com.syncband.backend.dto.response.mix

import com.syncband.backend.model.InstrumentType
import java.time.LocalDateTime

data class MixProjectResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val trackCount: Int,
    val isPublic: Boolean,
    val tags: List<String>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?
)

data class MixProjectDetailResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val userId: Long,
    val username: String,
    val profileImageUrl: String?,
    val tracks: List<MixTrackResponse>,
    val isPublic: Boolean,
    val tags: List<String>,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?
)

data class MixTrackResponse(
    val id: Long,
    val name: String,
    val instrumentType: InstrumentType,
    val userId: Long,
    val username: String,
    val audioUrl: String,
    val waveformData: List<Float>?,
    val duration: Float,
    val volume: Float,
    val pan: Float,
    val muted: Boolean,
    val soloed: Boolean
)

data class MixProjectListResponse(
    val mixProjects: List<MixProjectResponse>,
    val totalCount: Long,
    val page: Int,
    val size: Int,
    val totalPages: Int
)

data class MixProjectTrackAddResponse(
    val mixProjectId: Long,
    val trackId: Long,
    val success: Boolean,
    val message: String
)

data class MixProjectTrackRemoveResponse(
    val mixProjectId: Long,
    val trackId: Long,
    val success: Boolean,
    val message: String
)

data class MixingStateResponse(
    val mixProjectId: Long,
    val tracks: List<MixTrackStateResponse>
)

data class MixTrackStateResponse(
    val trackId: Long,
    val volume: Float,
    val pan: Float,
    val muted: Boolean,
    val soloed: Boolean,
    val effects: List<MixEffectResponse>
)

data class MixEffectResponse(
    val type: String,
    val enabled: Boolean,
    val parameters: Map<String, Any>
)
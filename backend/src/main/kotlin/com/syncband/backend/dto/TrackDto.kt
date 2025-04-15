package com.syncband.backend.dto

import com.syncband.backend.model.InstrumentType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

data class TrackCreateRequest(
    @field:NotBlank(message = "Track name is required")
    val name: String,
    
    val description: String?,
    
    @field:NotNull(message = "Instrument type is required")
    val instrumentType: InstrumentType
)

data class TrackUpdateRequest(
    val name: String?,
    val description: String?,
    val instrumentType: InstrumentType?
)

data class TrackResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val fileUrl: String,
    val instrumentType: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val user: UserSummary,
    val roomId: Long
)

data class TrackUploadResponse(
    val id: Long,
    val name: String,
    val fileUrl: String,
    val instrumentType: String,
    val message: String = "Track uploaded successfully"
)
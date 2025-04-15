package com.syncband.backend.dto

import java.time.LocalDateTime

/**
 * 트랙 믹싱 요청 DTO
 */
data class MixingRequest(
    val name: String,
    val trackSettings: List<TrackSetting>
)

/**
 * 믹싱 시 각 트랙에 대한 설정
 */
data class TrackSetting(
    val trackId: Long,
    val volume: Double,
    val pan: Double = 0.0,
    val muted: Boolean = false
)

/**
 * 믹싱 결과 응답 DTO
 */
data class MixingResponse(
    val mixId: String,
    val fileUrl: String,
    val fileName: String,
    val createdAt: LocalDateTime,
    val duration: Float,
    val sampleRate: Float,
    val channels: Int,
    val trackCount: Int
)
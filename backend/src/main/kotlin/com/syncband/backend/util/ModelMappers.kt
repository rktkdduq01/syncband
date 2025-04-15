package com.syncband.backend.util

import com.syncband.backend.dto.TrackResponse
import com.syncband.backend.dto.UserSummary
import com.syncband.backend.model.Track

/**
 * 모델 엔티티와 DTO 간의 매핑을 담당하는 유틸리티 클래스
 */
object ModelMappers {
    
    /**
     * Track 엔티티를 TrackResponse DTO로 변환
     */
    fun mapTrackToResponse(track: Track): TrackResponse {
        return TrackResponse(
            id = track.id,
            name = track.name,
            description = track.description,
            fileUrl = track.fileUrl,
            instrumentType = track.instrumentType.name,
            createdAt = track.createdAt,
            updatedAt = track.updatedAt,
            user = UserSummary(
                id = track.user.id,
                username = track.user.username,
                profileImageUrl = track.user.profileImageUrl
            ),
            roomId = track.room.id
        )
    }
    
    // 추후 다른 매핑 메서드들도 여기에 추가 가능
}
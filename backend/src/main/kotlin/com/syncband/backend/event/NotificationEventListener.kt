package com.syncband.backend.event

import com.syncband.backend.model.NotificationType
import com.syncband.backend.service.NotificationService
import com.syncband.backend.service.RoomService
import com.syncband.backend.service.TrackService
import org.slf4j.LoggerFactory
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component

@Component
class NotificationEventListener(
    private val notificationService: NotificationService,
    private val roomService: RoomService,
    private val trackService: TrackService
) {
    private val logger = LoggerFactory.getLogger(NotificationEventListener::class.java)

    @EventListener
    fun handleTrackCreatedEvent(event: TrackCreatedEvent) {
        try {
            // 트랙 정보 조회
            val trackResponse = trackService.getTrackById(event.trackId)
            val roomResponse = roomService.getRoomById(event.roomId)
            
            // 방의 소유자에게만 알림 전송 (트랙 생성자 본인은 제외)
            if (roomResponse.owner.id != event.userId) {
                notificationService.createNotification(
                    roomResponse.owner.id,
                    "새로운 트랙 업로드",
                    "${trackResponse.user.username}님이 '${roomResponse.name}' 방에 '${trackResponse.name}' 트랙을 업로드했습니다.",
                    NotificationType.TRACK,
                    event.trackId
                )
            }
        } catch (e: Exception) {
            logger.error("트랙 생성 알림 전송 실패", e)
        }
    }

    @EventListener
    fun handleUserJoinedRoomEvent(event: UserJoinedRoomEvent) {
        try {
            val roomResponse = roomService.getRoomById(event.roomId)
            
            // 방 소유자에게 알림 (참가자 본인은 제외)
            if (roomResponse.owner.id != event.userId) {
                notificationService.createNotification(
                    roomResponse.owner.id,
                    "새 참가자 알림",
                    "새로운 참가자가 '${roomResponse.name}' 방에 참여했습니다.",
                    NotificationType.ROOM,
                    event.roomId
                )
            }
        } catch (e: Exception) {
            logger.error("방 참여 알림 전송 실패", e)
        }
    }

    @EventListener
    fun handleRoomUpdatedEvent(event: RoomUpdatedEvent) {
        try {
            val roomResponse = roomService.getRoomById(event.roomId)
            
            // 참가자들에게 알림 전송 (방장 본인은 제외)
            // 실제 구현에서는 room.participants를 순회하며 방장을 제외한 모든 참가자에게 알림을 보냄
            // 현재는 예시로만 구현
        } catch (e: Exception) {
            logger.error("방 업데이트 알림 전송 실패", e)
        }
    }

    @EventListener
    fun handleTrackDeletedEvent(event: TrackDeletedEvent) {
        try {
            val roomResponse = roomService.getRoomById(event.roomId)
            
            // 방 소유자에게 알림 (삭제자 본인은 제외)
            if (roomResponse.owner.id != event.userId) {
                notificationService.createNotification(
                    roomResponse.owner.id,
                    "트랙 삭제 알림",
                    "방 '${roomResponse.name}'에서 트랙이 삭제되었습니다.",
                    NotificationType.TRACK,
                    event.trackId
                )
            }
        } catch (e: Exception) {
            logger.error("트랙 삭제 알림 전송 실패", e)
        }
    }
}
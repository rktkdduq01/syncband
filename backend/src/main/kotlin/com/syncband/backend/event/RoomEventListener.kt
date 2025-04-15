package com.syncband.backend.event

import com.syncband.backend.websocket.RoomWebSocketHandler
import org.slf4j.LoggerFactory
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component

@Component
class RoomEventListener(
    private val roomWebSocketHandler: RoomWebSocketHandler
) {
    private val logger = LoggerFactory.getLogger(RoomEventListener::class.java)

    @EventListener
    fun handleRoomCreatedEvent(event: RoomCreatedEvent) {
        logger.info("방 생성 이벤트 수신: roomId=${event.roomId}, ownerId=${event.ownerId}")
        // WebSocket을 통해 방 생성 알림
        roomWebSocketHandler.handleRoomCreated(event.roomId)
    }

    @EventListener
    fun handleRoomUpdatedEvent(event: RoomUpdatedEvent) {
        logger.info("방 업데이트 이벤트 수신: roomId=${event.roomId}, userId=${event.userId}")
        // WebSocket을 통해 방 업데이트 알림
        roomWebSocketHandler.handleRoomUpdated(event.roomId)
    }

    @EventListener
    fun handleRoomDeletedEvent(event: RoomDeletedEvent) {
        logger.info("방 삭제 이벤트 수신: roomId=${event.roomId}, userId=${event.userId}")
        // WebSocket을 통해 방 삭제 알림
        roomWebSocketHandler.handleRoomDeleted(event.roomId)
    }

    @EventListener
    fun handleUserJoinedRoomEvent(event: UserJoinedRoomEvent) {
        logger.info("사용자 방 참가 이벤트 수신: roomId=${event.roomId}, userId=${event.userId}")
        // WebSocket을 통해 사용자 참가 알림
        roomWebSocketHandler.notifyRoomUpdate(event.roomId)
    }

    @EventListener
    fun handleUserLeftRoomEvent(event: UserLeftRoomEvent) {
        logger.info("사용자 방 퇴장 이벤트 수신: roomId=${event.roomId}, userId=${event.userId}")
        // WebSocket을 통해 사용자 퇴장 알림
        roomWebSocketHandler.notifyRoomUpdate(event.roomId)
    }
}
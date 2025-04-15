package com.syncband.backend.event

import com.syncband.backend.service.TrackService
import com.syncband.backend.websocket.WebSocketMessageHandler
import org.slf4j.LoggerFactory
import org.springframework.context.event.EventListener
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import com.syncband.backend.websocket.TrackUpdateMessage

@Component
class TrackEventListener(
    private val trackService: TrackService,
    private val messagingTemplate: SimpMessagingTemplate
) {
    private val logger = LoggerFactory.getLogger(TrackEventListener::class.java)

    @EventListener
    fun handleTrackCreatedEvent(event: TrackCreatedEvent) {
        logger.info("트랙 생성 이벤트 수신: trackId=${event.trackId}, roomId=${event.roomId}")
        
        try {
            // 트랙 정보를 가져와서 방의 모든 참가자에게 알림
            val trackResponse = trackService.getTrackById(event.trackId)
            
            val updateMessage = TrackUpdateMessage(
                updateType = "ADD",
                trackId = event.trackId,
                data = trackResponse,
                userId = event.userId
            )
            
            // 해당 방의 모든 사용자에게 트랙 추가 알림 전송
            messagingTemplate.convertAndSend("/topic/room/${event.roomId}/tracks", updateMessage)
        } catch (e: Exception) {
            logger.error("트랙 생성 이벤트 처리 중 오류 발생", e)
        }
    }

    @EventListener
    fun handleTrackUpdatedEvent(event: TrackUpdatedEvent) {
        logger.info("트랙 업데이트 이벤트 수신: trackId=${event.trackId}, roomId=${event.roomId}")
        
        try {
            // 업데이트된 트랙 정보를 가져와서 방의 모든 참가자에게 알림
            val trackResponse = trackService.getTrackById(event.trackId)
            
            val updateMessage = TrackUpdateMessage(
                updateType = "UPDATE",
                trackId = event.trackId,
                data = trackResponse,
                userId = event.userId
            )
            
            // 해당 방의 모든 사용자에게 트랙 업데이트 알림 전송
            messagingTemplate.convertAndSend("/topic/room/${event.roomId}/tracks", updateMessage)
        } catch (e: Exception) {
            logger.error("트랙 업데이트 이벤트 처리 중 오류 발생", e)
        }
    }

    @EventListener
    fun handleTrackDeletedEvent(event: TrackDeletedEvent) {
        logger.info("트랙 삭제 이벤트 수신: trackId=${event.trackId}, roomId=${event.roomId}")
        
        try {
            val updateMessage = TrackUpdateMessage(
                updateType = "DELETE",
                trackId = event.trackId,
                data = mapOf("trackId" to event.trackId),
                userId = event.userId
            )
            
            // 해당 방의 모든 사용자에게 트랙 삭제 알림 전송
            messagingTemplate.convertAndSend("/topic/room/${event.roomId}/tracks", updateMessage)
        } catch (e: Exception) {
            logger.error("트랙 삭제 이벤트 처리 중 오류 발생", e)
        }
    }
}
package com.syncband.backend.websocket

import org.slf4j.LoggerFactory
import org.springframework.context.event.EventListener
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.stereotype.Component
import org.springframework.web.socket.messaging.SessionConnectedEvent
import org.springframework.web.socket.messaging.SessionDisconnectEvent

@Component
class WebSocketEventListener(
    private val webSocketMessageHandler: WebSocketMessageHandler
) {
    private val logger = LoggerFactory.getLogger(WebSocketEventListener::class.java)

    @EventListener
    fun handleWebSocketConnectListener(event: SessionConnectedEvent) {
        logger.info("새로운 웹소켓 연결이 설정되었습니다")
    }

    @EventListener
    fun handleWebSocketDisconnectListener(event: SessionDisconnectEvent) {
        val headerAccessor = StompHeaderAccessor.wrap(event.message)
        
        // 세션에 저장된 룸 ID와 사용자 ID 가져오기
        val roomId = headerAccessor.sessionAttributes?.get("room_id") as? Long
        val userId = headerAccessor.sessionAttributes?.get("user_id") as? Long
        
        if (roomId != null && userId != null) {
            logger.info("사용자($userId)가 룸($roomId)에서 연결이 끊겼습니다")
            
            // 사용자 연결 종료 처리
            webSocketMessageHandler.handleUserDisconnect(roomId, userId)
        }
    }
}
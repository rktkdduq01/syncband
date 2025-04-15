package com.syncband.backend.websocket

import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.util.concurrent.ConcurrentHashMap

@Component
class WebSocketHandler : TextWebSocketHandler() {
    
    private val logger = LoggerFactory.getLogger(WebSocketHandler::class.java)
    private val objectMapper = ObjectMapper()
    
    // 모든 활성 세션을 저장
    private val sessions = ConcurrentHashMap<String, WebSocketSession>()
    
    // 사용자 ID와 세션 매핑
    private val userSessions = ConcurrentHashMap<String, WebSocketSession>()
    
    override fun afterConnectionEstablished(session: WebSocketSession) {
        val userId = session.uri?.query?.substringAfter("user=")?.substringBefore("&")
        
        logger.info("WebSocket 연결 수립: sessionId=${session.id}, userId=$userId")
        
        // 세션 저장
        sessions[session.id] = session
        
        // 사용자 ID가 제공된 경우 매핑 저장
        if (!userId.isNullOrEmpty()) {
            userSessions[userId] = session
            
            // 연결 상태 메시지 전송
            session.sendMessage(TextMessage(objectMapper.writeValueAsString(mapOf(
                "type" to "connection-established",
                "sessionId" to session.id,
                "userId" to userId,
                "timestamp" to System.currentTimeMillis()
            ))))
        }
    }
    
    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        try {
            val payload = objectMapper.readValue(message.payload, Map::class.java)
            val type = payload["type"] as? String ?: "message"
            
            when (type) {
                "direct-message" -> {
                    // 특정 사용자에게 직접 메시지 전송
                    val targetUserId = payload["targetUserId"] as? String ?: return
                    val targetSession = userSessions[targetUserId]
                    
                    if (targetSession != null && targetSession.isOpen) {
                        targetSession.sendMessage(message)
                    } else {
                        session.sendMessage(TextMessage(objectMapper.writeValueAsString(mapOf(
                            "type" to "error",
                            "error" to "user-not-found",
                            "message" to "대상 사용자를 찾을 수 없거나 연결이 종료되었습니다.",
                            "timestamp" to System.currentTimeMillis()
                        ))))
                    }
                }
                "broadcast" -> {
                    // 모든 연결된 클라이언트에게 브로드캐스트
                    val broadcastMessage = TextMessage(objectMapper.writeValueAsString(payload))
                    sessions.values.forEach { s ->
                        if (s.isOpen && s.id != session.id) {
                            s.sendMessage(broadcastMessage)
                        }
                    }
                }
                else -> {
                    // 기타 메시지 타입은 에코
                    logger.debug("메시지 수신: ${message.payload}")
                    session.sendMessage(message)
                }
            }
            
        } catch (e: Exception) {
            logger.error("메시지 처리 중 오류 발생: ${e.message}", e)
            
            // 오류 응답 전송
            try {
                session.sendMessage(TextMessage(objectMapper.writeValueAsString(mapOf(
                    "type" to "error",
                    "error" to "message-processing-failed",
                    "message" to "메시지 처리 중 오류가 발생했습니다.",
                    "timestamp" to System.currentTimeMillis()
                ))))
            } catch (ex: Exception) {
                logger.error("오류 메시지 전송 실패", ex)
            }
        }
    }
    
    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        logger.info("WebSocket 연결 종료: sessionId=${session.id}, status=${status.code}")
        
        // 세션 제거
        sessions.remove(session.id)
        
        // 사용자 세션 매핑에서도 제거
        val userIdToRemove = userSessions.entries
            .find { (_, s) -> s.id == session.id }?.key
            
        if (userIdToRemove != null) {
            userSessions.remove(userIdToRemove)
        }
    }
    
    override fun handleTransportError(session: WebSocketSession, exception: Throwable) {
        logger.error("WebSocket 전송 오류: sessionId=${session.id}", exception)
    }
}
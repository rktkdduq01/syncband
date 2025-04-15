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
class SyncRoomHandler : TextWebSocketHandler() {
    
    private val logger = LoggerFactory.getLogger(SyncRoomHandler::class.java)
    private val objectMapper = ObjectMapper()
    
    // 방 ID별로 세션을 관리하는 맵
    private val roomSessions = ConcurrentHashMap<String, MutableList<WebSocketSession>>()
    // 세션 ID와 사용자 ID 매핑
    private val sessionUserMap = ConcurrentHashMap<String, String>()
    // 세션 ID와 방 ID 매핑
    private val sessionRoomMap = ConcurrentHashMap<String, String>()
    
    override fun afterConnectionEstablished(session: WebSocketSession) {
        // URL 파라미터에서 방 ID와 사용자 ID 추출
        val roomId = session.uri?.query?.substringAfter("room=")?.substringBefore("&") 
            ?: throw IllegalArgumentException("방 ID가 제공되지 않았습니다.")
        val userId = session.uri?.query?.substringAfter("user=")?.substringBefore("&")
            ?: throw IllegalArgumentException("사용자 ID가 제공되지 않았습니다.")
        
        logger.info("SyncRoom WebSocket 연결 수립: roomId=$roomId, userId=$userId")
        
        // 세션 정보 저장
        sessionUserMap[session.id] = userId
        sessionRoomMap[session.id] = roomId
        
        // 방 세션 목록에 추가
        roomSessions.computeIfAbsent(roomId) { mutableListOf() }.add(session)
        
        // 접속 알림 메시지 브로드캐스트
        broadcastToRoom(roomId, mapOf(
            "type" to "user-connected",
            "userId" to userId,
            "timestamp" to System.currentTimeMillis()
        ), excludeSession = null)
    }
    
    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        val roomId = sessionRoomMap[session.id] ?: return
        val userId = sessionUserMap[session.id] ?: return
        
        try {
            // 메시지 파싱
            val payload = objectMapper.readValue(message.payload, Map::class.java)
            val type = payload["type"] as? String ?: "message"
            
            // 메시지에 발신자 정보 추가
            val enhancedPayload = payload.toMutableMap().apply {
                put("senderId", userId)
                put("timestamp", System.currentTimeMillis())
            }
            
            when (type) {
                "chat" -> {
                    // 채팅 메시지
                    logger.debug("채팅 메시지: roomId=$roomId, userId=$userId")
                    broadcastToRoom(roomId, enhancedPayload, session)
                }
                "sync" -> {
                    // 동기화 메시지 (재생 상태, 커서 위치 등)
                    logger.debug("동기화 메시지: roomId=$roomId, userId=$userId")
                    broadcastToRoom(roomId, enhancedPayload, null)
                }
                "control" -> {
                    // 제어 메시지 (트랙 추가/삭제, 볼륨 변경 등)
                    logger.debug("제어 메시지: roomId=$roomId, userId=$userId")
                    broadcastToRoom(roomId, enhancedPayload, null)
                }
                else -> {
                    // 기타 메시지
                    broadcastToRoom(roomId, enhancedPayload, session)
                }
            }
        } catch (e: Exception) {
            logger.error("메시지 처리 오류: ${e.message}", e)
        }
    }
    
    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        val roomId = sessionRoomMap.remove(session.id) ?: return
        val userId = sessionUserMap.remove(session.id) ?: return
        
        logger.info("SyncRoom WebSocket 연결 종료: roomId=$roomId, userId=$userId")
        
        // 방 세션 목록에서 제거
        roomSessions[roomId]?.remove(session)
        
        // 방이 비었으면 방 정보도 제거
        if (roomSessions[roomId]?.isEmpty() == true) {
            roomSessions.remove(roomId)
        }
        
        // 접속 종료 알림 메시지 브로드캐스트
        broadcastToRoom(roomId, mapOf(
            "type" to "user-disconnected",
            "userId" to userId,
            "timestamp" to System.currentTimeMillis()
        ), excludeSession = null)
    }
    
    private fun broadcastToRoom(roomId: String, message: Map<*, *>, excludeSession: WebSocketSession?) {
        val sessions = roomSessions[roomId] ?: return
        val messageJson = objectMapper.writeValueAsString(message)
        val textMessage = TextMessage(messageJson)
        
        for (session in sessions) {
            if (session != excludeSession && session.isOpen) {
                try {
                    session.sendMessage(textMessage)
                } catch (e: Exception) {
                    logger.error("메시지 전송 오류: ${e.message}")
                }
            }
        }
    }
}
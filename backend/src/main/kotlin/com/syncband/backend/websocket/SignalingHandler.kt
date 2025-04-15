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
class SignalingHandler : TextWebSocketHandler() {
    
    private val logger = LoggerFactory.getLogger(SignalingHandler::class.java)
    private val objectMapper = ObjectMapper()
    
    // 세션 관리 (roomId -> (userId -> session))
    private val rooms = ConcurrentHashMap<String, ConcurrentHashMap<String, WebSocketSession>>()
    
    override fun afterConnectionEstablished(session: WebSocketSession) {
        val roomId = session.uri?.query?.substringAfter("room=")?.substringBefore("&") ?: return
        val userId = session.uri?.query?.substringAfter("user=")?.substringBefore("&") ?: return
        
        logger.info("WebSocket 연결 수립: roomId=$roomId, userId=$userId")
        
        // 방이 존재하지 않으면 생성
        val room = rooms.computeIfAbsent(roomId) { ConcurrentHashMap() }
        room[userId] = session
        
        // 새 참가자 입장 알림
        val joinMessage = mapOf(
            "type" to "user-joined",
            "userId" to userId,
            "timestamp" to System.currentTimeMillis()
        )
        broadcastToRoom(roomId, userId, joinMessage)
    }
    
    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        try {
            val messageMap = objectMapper.readValue(message.payload, Map::class.java)
            val type = messageMap["type"] as? String ?: return
            val roomId = messageMap["roomId"] as? String ?: return
            val senderId = messageMap["senderId"] as? String ?: return
            
            logger.debug("메시지 수신: type=$type, roomId=$roomId, senderId=$senderId")
            
            when (type) {
                "offer", "answer", "ice-candidate" -> {
                    // WebRTC 시그널링 메시지 처리
                    val targetId = messageMap["targetId"] as? String ?: return
                    val room = rooms[roomId] ?: return
                    val targetSession = room[targetId] ?: return
                    
                    if (targetSession.isOpen) {
                        targetSession.sendMessage(message)
                    }
                }
                "broadcast" -> {
                    // 방 전체 메시지 브로드캐스트
                    broadcastToRoom(roomId, senderId, messageMap)
                }
                "sync-state" -> {
                    // 동기화 상태 브로드캐스트 (재생/일시정지, 위치 등)
                    broadcastToRoom(roomId, senderId, messageMap)
                }
            }
        } catch (e: Exception) {
            logger.error("메시지 처리 중 오류 발생", e)
        }
    }
    
    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        // 세션에 해당하는 방과 사용자 ID 찾기
        val sessionInfo = findSessionInfo(session)
        
        // 세션 정보가 있으면 처리
        if (sessionInfo != null) {
            val (roomId, userId) = sessionInfo
            logger.info("WebSocket 연결 종료: roomId=$roomId, userId=$userId")
            
            // 방에서 사용자 제거
            rooms[roomId]?.remove(userId)
            
            // 방이 비었으면 방도 제거
            if (rooms[roomId]?.isEmpty() == true) {
                rooms.remove(roomId)
            }
            
            // 나간 사용자 알림
            val leaveMessage = mapOf(
                "type" to "user-left",
                "userId" to userId,
                "timestamp" to System.currentTimeMillis()
            )
            broadcastToRoom(roomId, userId, leaveMessage)
        }
    }
    
    /**
     * 세션에 해당하는 방 ID와 사용자 ID를 찾아 반환
     */
    private fun findSessionInfo(session: WebSocketSession): Pair<String, String>? {
        rooms.forEach { (roomId, users) ->
            users.forEach { (userId, s) ->
                if (s.id == session.id) {
                    return Pair(roomId, userId)
                }
            }
        }
        return null
    }
    
    private fun broadcastToRoom(roomId: String, senderId: String, message: Map<*, *>) {
        val room = rooms[roomId] ?: return
        val messageJson = objectMapper.writeValueAsString(message)
        val textMessage = TextMessage(messageJson)
        
        room.forEach { (userId, session) ->
            if (userId != senderId && session.isOpen) {
                session.sendMessage(textMessage)
            }
        }
    }
}
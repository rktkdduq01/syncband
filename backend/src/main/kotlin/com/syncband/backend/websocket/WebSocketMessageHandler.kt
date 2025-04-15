package com.syncband.backend.websocket

import com.syncband.backend.dto.UserSummary
import org.slf4j.LoggerFactory
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Controller
import java.security.Principal
import java.time.LocalDateTime
import java.util.concurrent.ConcurrentHashMap

@Controller
class WebSocketMessageHandler(
    private val messagingTemplate: SimpMessagingTemplate
) {
    private val logger = LoggerFactory.getLogger(WebSocketMessageHandler::class.java)
    
    // 룸 ID별 현재 접속 중인 사용자 관리
    private val roomParticipants = ConcurrentHashMap<Long, MutableSet<ParticipantInfo>>()

    @MessageMapping("/room/{roomId}/join")
    fun handleJoinRoom(
        @DestinationVariable roomId: Long,
        @Payload message: JoinMessage,
        headerAccessor: SimpMessageHeaderAccessor,
        principal: Principal
    ) {
        val username = principal.name
        logger.info("User $username joined room $roomId")

        // 사용자 정보를 저장
        val participants = roomParticipants.computeIfAbsent(roomId) { mutableSetOf() }
        val participant = ParticipantInfo(message.userId, username, message.userSummary)
        participants.add(participant)
        
        // 세션에 룸 ID 저장 (연결 종료 시 사용)
        headerAccessor.sessionAttributes?.put("room_id", roomId)
        headerAccessor.sessionAttributes?.put("user_id", message.userId)

        // 참가자 목록 업데이트 메시지 전송
        val participantsMessage = ParticipantsMessage(
            participants = participants.toList(),
            timestamp = LocalDateTime.now(),
            type = "PARTICIPANTS_UPDATE"
        )
        
        messagingTemplate.convertAndSend("/topic/room/$roomId/participants", participantsMessage)
        
        // 새 사용자 참가 메시지 전송
        val joinNotification = UserActionMessage(
            userSummary = message.userSummary,
            timestamp = LocalDateTime.now(),
            type = "USER_JOINED"
        )
        
        messagingTemplate.convertAndSend("/topic/room/$roomId/user-actions", joinNotification)
    }

    @MessageMapping("/room/{roomId}/leave")
    fun handleLeaveRoom(
        @DestinationVariable roomId: Long,
        @Payload message: LeaveMessage,
        principal: Principal
    ) {
        handleUserLeave(roomId, message.userId)
    }

    @MessageMapping("/room/{roomId}/audio-event")
    fun handleAudioEvent(
        @DestinationVariable roomId: Long,
        @Payload message: AudioEventMessage,
        principal: Principal
    ) {
        // 다른 참가자들에게 오디오 이벤트 전송
        messagingTemplate.convertAndSend("/topic/room/$roomId/audio-events", message)
    }

    @MessageMapping("/room/{roomId}/chat")
    fun handleChatMessage(
        @DestinationVariable roomId: Long,
        @Payload message: ChatMessage,
        principal: Principal
    ) {
        val enhancedMessage = message.copy(
            timestamp = LocalDateTime.now(),
            senderUsername = principal.name
        )
        
        // 룸의 모든 참가자에게 채팅 메시지 전송
        messagingTemplate.convertAndSend("/topic/room/$roomId/chat", enhancedMessage)
    }

    @MessageMapping("/room/{roomId}/track-update")
    fun handleTrackUpdate(
        @DestinationVariable roomId: Long,
        @Payload message: TrackUpdateMessage,
        principal: Principal
    ) {
        // 트랙 업데이트 메시지 전송 (새 트랙 추가, 트랙 수정, 삭제 등)
        messagingTemplate.convertAndSend("/topic/room/$roomId/tracks", message)
    }

    // 사용자가 연결이 끊겼을 때 호출될 메서드
    fun handleUserDisconnect(roomId: Long, userId: Long) {
        handleUserLeave(roomId, userId)
    }

    private fun handleUserLeave(roomId: Long, userId: Long) {
        val participants = roomParticipants[roomId] ?: return
        val participant = participants.find { it.userId == userId } ?: return
        
        // 사용자 정보 제거
        participants.remove(participant)
        if (participants.isEmpty()) {
            roomParticipants.remove(roomId)
        }

        logger.info("User ${participant.username} left room $roomId")

        // 참가자 목록 업데이트 메시지 전송
        val participantsMessage = ParticipantsMessage(
            participants = participants.toList(),
            timestamp = LocalDateTime.now(),
            type = "PARTICIPANTS_UPDATE"
        )
        
        messagingTemplate.convertAndSend("/topic/room/$roomId/participants", participantsMessage)
        
        // 사용자 퇴장 메시지 전송
        val leaveNotification = UserActionMessage(
            userSummary = participant.userSummary,
            timestamp = LocalDateTime.now(),
            type = "USER_LEFT"
        )
        
        messagingTemplate.convertAndSend("/topic/room/$roomId/user-actions", leaveNotification)
    }
}

// WebSocket 메시지 데이터 클래스들
data class JoinMessage(
    val userId: Long,
    val userSummary: UserSummary
)

data class LeaveMessage(
    val userId: Long
)

data class ParticipantInfo(
    val userId: Long,
    val username: String,
    val userSummary: UserSummary
)

data class ParticipantsMessage(
    val participants: List<ParticipantInfo>,
    val timestamp: LocalDateTime,
    val type: String
)

data class UserActionMessage(
    val userSummary: UserSummary,
    val timestamp: LocalDateTime,
    val type: String
)

data class ChatMessage(
    val content: String,
    val senderId: Long,
    val senderUsername: String? = null,
    val timestamp: LocalDateTime = LocalDateTime.now()
)

data class AudioEventMessage(
    val eventType: String,
    val userId: Long,
    val trackId: Long?,
    val data: Map<String, Any>,
    val timestamp: LocalDateTime = LocalDateTime.now()
)

data class TrackUpdateMessage(
    val updateType: String, // ADD, UPDATE, DELETE
    val trackId: Long?,
    val data: Any?,
    val userId: Long,
    val timestamp: LocalDateTime = LocalDateTime.now()
)
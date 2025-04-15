package com.syncband.backend.websocket

import com.syncband.backend.dto.RoomResponse
import com.syncband.backend.service.RoomService
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Controller
import java.security.Principal
import java.time.LocalDateTime

@Controller
class RoomWebSocketHandler(
    private val roomService: RoomService,
    private val messagingTemplate: SimpMessagingTemplate
) {

    // 룸 정보가 업데이트될 때 구독자에게 알림
    fun notifyRoomUpdate(roomId: Long) {
        val roomResponse = roomService.getRoomById(roomId)
        messagingTemplate.convertAndSend("/topic/room/$roomId/info", roomResponse)
    }

    // 룸 목록이 업데이트될 때 구독자에게 알림
    fun notifyRoomListUpdate() {
        // 서비스에서 공개 방 목록을 페이징 없이 가져오는 기능 필요
        // 여기서는 간단히 알림 메시지만 전송
        val updateMessage = mapOf(
            "type" to "ROOM_LIST_UPDATED",
            "timestamp" to LocalDateTime.now().toString()
        )
        messagingTemplate.convertAndSend("/topic/rooms/updates", updateMessage)
    }

    // 클라이언트가 룸 업데이트를 요청
    @MessageMapping("/room/{roomId}/request-update")
    @SendTo("/topic/room/{roomId}/info")
    fun handleRoomUpdateRequest(
        @DestinationVariable roomId: Long,
        principal: Principal
    ): RoomResponse {
        return roomService.getRoomById(roomId)
    }

    // 내부 이벤트 핸들러: 룸이 생성됨
    fun handleRoomCreated(roomId: Long) {
        notifyRoomUpdate(roomId)
        notifyRoomListUpdate()
    }

    // 내부 이벤트 핸들러: 룸이 수정됨
    fun handleRoomUpdated(roomId: Long) {
        notifyRoomUpdate(roomId)
    }

    // 내부 이벤트 핸들러: 룸이 삭제됨
    fun handleRoomDeleted(roomId: Long) {
        val deleteMessage = mapOf(
            "type" to "ROOM_DELETED",
            "roomId" to roomId,
            "timestamp" to LocalDateTime.now().toString()
        )
        messagingTemplate.convertAndSend("/topic/room/$roomId/info", deleteMessage)
        notifyRoomListUpdate()
    }
}
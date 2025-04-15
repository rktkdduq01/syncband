package com.syncband.backend.event

import org.springframework.context.ApplicationEvent

// 방이 생성되었을 때 발생하는 이벤트
class RoomCreatedEvent(source: Any, val roomId: Long, val ownerId: Long) : ApplicationEvent(source)

// 방이 업데이트되었을 때 발생하는 이벤트
class RoomUpdatedEvent(source: Any, val roomId: Long, val userId: Long) : ApplicationEvent(source)

// 방이 삭제되었을 때 발생하는 이벤트
class RoomDeletedEvent(source: Any, val roomId: Long, val userId: Long) : ApplicationEvent(source)

// 사용자가 방에 참가했을 때 발생하는 이벤트
class UserJoinedRoomEvent(source: Any, val roomId: Long, val userId: Long) : ApplicationEvent(source)

// 사용자가 방에서 나갔을 때 발생하는 이벤트
class UserLeftRoomEvent(source: Any, val roomId: Long, val userId: Long) : ApplicationEvent(source)
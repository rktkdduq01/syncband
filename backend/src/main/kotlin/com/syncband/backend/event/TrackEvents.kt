package com.syncband.backend.event

import org.springframework.context.ApplicationEvent

// 트랙이 생성되었을 때 발생하는 이벤트
class TrackCreatedEvent(source: Any, val trackId: Long, val roomId: Long, val userId: Long) : ApplicationEvent(source)

// 트랙이 업데이트되었을 때 발생하는 이벤트
class TrackUpdatedEvent(source: Any, val trackId: Long, val roomId: Long, val userId: Long) : ApplicationEvent(source)

// 트랙이 삭제되었을 때 발생하는 이벤트
class TrackDeletedEvent(source: Any, val trackId: Long, val roomId: Long, val userId: Long) : ApplicationEvent(source)
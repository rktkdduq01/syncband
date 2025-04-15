/**
 * 이벤트 관리 유틸리티 함수들
 */

type EventHandler<T = any> = (data: T) => void;

interface EventMap {
  [eventName: string]: EventHandler[];
}

// 이벤트 버스 클래스
class EventBus {
  private events: EventMap = {};
  
  /**
   * 이벤트 구독하기
   */
  subscribe<T>(eventName: string, handler: EventHandler<T>): () => void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    
    this.events[eventName].push(handler as EventHandler);
    
    // 구독 취소 함수 반환
    return () => {
      this.events[eventName] = this.events[eventName].filter(
        eventHandler => eventHandler !== handler
      );
    };
  }
  
  /**
   * 이벤트 발행하기
   */
  publish<T>(eventName: string, data?: T): void {
    if (!this.events[eventName]) {
      return;
    }
    
    this.events[eventName].forEach(handler => {
      handler(data);
    });
  }
  
  /**
   * 특정 이벤트의 모든 핸들러 제거
   */
  clearEvent(eventName: string): void {
    delete this.events[eventName];
  }
  
  /**
   * 모든 이벤트 핸들러 제거
   */
  clearAll(): void {
    this.events = {};
  }
}

// 전역 이벤트 버스 인스턴스
const eventBus = new EventBus();

export default eventBus;

// 타입 보장을 위한 이벤트 키 상수
export const EventKeys = {
  AUDIO_TRACK_ADDED: 'AUDIO_TRACK_ADDED',
  AUDIO_TRACK_REMOVED: 'AUDIO_TRACK_REMOVED',
  AUDIO_PLAYBACK_STARTED: 'AUDIO_PLAYBACK_STARTED',
  AUDIO_PLAYBACK_PAUSED: 'AUDIO_PLAYBACK_PAUSED',
  AUDIO_PLAYBACK_STOPPED: 'AUDIO_PLAYBACK_STOPPED',
  AUDIO_VOLUME_CHANGED: 'AUDIO_VOLUME_CHANGED',
  USER_LOGGED_IN: 'USER_LOGGED_IN',
  USER_LOGGED_OUT: 'USER_LOGGED_OUT',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  NEW_MESSAGE_RECEIVED: 'NEW_MESSAGE_RECEIVED',
  COLLABORATION_INVITATION: 'COLLABORATION_INVITATION',
  CONNECTION_STATUS_CHANGED: 'CONNECTION_STATUS_CHANGED',
  JAM_SESSION_JOINED: 'JAM_SESSION_JOINED',
  JAM_SESSION_LEFT: 'JAM_SESSION_LEFT',
  INSTRUMENT_CHANGED: 'INSTRUMENT_CHANGED',
};

// 타입 보장을 위한 헬퍼 함수
export function subscribeToEvent<T>(eventName: string, handler: EventHandler<T>): () => void {
  return eventBus.subscribe(eventName, handler);
}

export function publishEvent<T>(eventName: string, data?: T): void {
  eventBus.publish(eventName, data);
}
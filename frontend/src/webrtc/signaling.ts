/**
 * WebRTC 시그널링 서버 통신을 위한 클래스
 */
import { Socket, io } from 'socket.io-client';

// WebRTC 신호 메시지 유형
export enum SignalMessageType {
  JOIN_ROOM = 'join-room',
  USER_JOINED = 'user-joined',
  USER_LEFT = 'user-left',
  OFFER = 'offer',
  ANSWER = 'answer',
  ICE_CANDIDATE = 'ice-candidate',
  ROOM_INFO = 'room-info',
  CHAT_MESSAGE = 'chat-message',
  INSTRUMENT_CHANGED = 'instrument-changed',
  SYNC_STATE = 'sync-state',
  ERROR = 'error',
}

// 사용자 유형
export interface User {
  id: string;
  name: string;
  instrument?: string;
}

// 방 정보 유형
export interface RoomInfo {
  id: string;
  name: string;
  users: User[];
  hostId: string;
  songId?: string;
  songTitle?: string;
}

// 시그널링 이벤트 핸들러 인터페이스
export interface SignalingHandlers {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: any) => void;
  onUserJoined?: (user: User) => void;
  onUserLeft?: (userId: string) => void;
  onOffer?: (userId: string, offer: RTCSessionDescriptionInit) => void;
  onAnswer?: (userId: string, answer: RTCSessionDescriptionInit) => void;
  onIceCandidate?: (userId: string, candidate: RTCIceCandidate) => void;
  onRoomInfo?: (roomInfo: RoomInfo) => void;
  onChatMessage?: (userId: string, message: string) => void;
  onInstrumentChanged?: (userId: string, instrument: string) => void;
  onSyncState?: (state: any) => void;
}

export class SignalingService {
  private socket: Socket | null = null;
  private handlers: SignalingHandlers;
  private userId: string = '';
  private roomId: string = '';
  private serverUrl: string;

  constructor(serverUrl: string = 'http://localhost:3001', handlers: SignalingHandlers = {}) {
    this.serverUrl = serverUrl;
    this.handlers = handlers;
  }

  /**
   * 시그널링 서버에 연결합니다.
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.serverUrl, {
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
          console.log('시그널링 서버에 연결되었습니다.');
          if (this.handlers.onConnected) {
            this.handlers.onConnected();
          }
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('시그널링 서버 연결 오류:', error);
          if (this.handlers.onError) {
            this.handlers.onError(error);
          }
          reject(error);
        });

        this.socket.on('disconnect', () => {
          console.log('시그널링 서버와 연결이 끊어졌습니다.');
          if (this.handlers.onDisconnected) {
            this.handlers.onDisconnected();
          }
        });

        this.setupEventHandlers();
      } catch (error) {
        console.error('시그널링 서버 초기화 오류:', error);
        reject(error);
      }
    });
  }

  /**
   * 이벤트 핸들러를 설정합니다.
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // 사용자 입장
    this.socket.on(SignalMessageType.USER_JOINED, (user: User) => {
      console.log(`사용자가 입장했습니다: ${user.name} (${user.id})`);
      if (this.handlers.onUserJoined) {
        this.handlers.onUserJoined(user);
      }
    });

    // 사용자 퇴장
    this.socket.on(SignalMessageType.USER_LEFT, (userId: string) => {
      console.log(`사용자가 퇴장했습니다: ${userId}`);
      if (this.handlers.onUserLeft) {
        this.handlers.onUserLeft(userId);
      }
    });

    // 오퍼 수신
    this.socket.on(SignalMessageType.OFFER, ({ userId, offer }: { userId: string; offer: RTCSessionDescriptionInit }) => {
      console.log(`사용자 ${userId}로부터 오퍼를 받았습니다.`);
      if (this.handlers.onOffer) {
        this.handlers.onOffer(userId, offer);
      }
    });

    // 응답 수신
    this.socket.on(SignalMessageType.ANSWER, ({ userId, answer }: { userId: string; answer: RTCSessionDescriptionInit }) => {
      console.log(`사용자 ${userId}로부터 응답을 받았습니다.`);
      if (this.handlers.onAnswer) {
        this.handlers.onAnswer(userId, answer);
      }
    });

    // ICE 후보 수신
    this.socket.on(SignalMessageType.ICE_CANDIDATE, ({ userId, candidate }: { userId: string; candidate: RTCIceCandidate }) => {
      console.log(`사용자 ${userId}로부터 ICE 후보를 받았습니다.`);
      if (this.handlers.onIceCandidate) {
        this.handlers.onIceCandidate(userId, candidate);
      }
    });

    // 방 정보 수신
    this.socket.on(SignalMessageType.ROOM_INFO, (roomInfo: RoomInfo) => {
      console.log('방 정보를 받았습니다:', roomInfo);
      if (this.handlers.onRoomInfo) {
        this.handlers.onRoomInfo(roomInfo);
      }
    });

    // 채팅 메시지 수신
    this.socket.on(SignalMessageType.CHAT_MESSAGE, ({ userId, message }: { userId: string; message: string }) => {
      if (this.handlers.onChatMessage) {
        this.handlers.onChatMessage(userId, message);
      }
    });

    // 악기 변경 수신
    this.socket.on(SignalMessageType.INSTRUMENT_CHANGED, ({ userId, instrument }: { userId: string; instrument: string }) => {
      console.log(`사용자 ${userId}가 악기를 ${instrument}(으)로 변경했습니다.`);
      if (this.handlers.onInstrumentChanged) {
        this.handlers.onInstrumentChanged(userId, instrument);
      }
    });

    // 동기화 상태 수신
    this.socket.on(SignalMessageType.SYNC_STATE, (state: any) => {
      if (this.handlers.onSyncState) {
        this.handlers.onSyncState(state);
      }
    });

    // 오류 수신
    this.socket.on(SignalMessageType.ERROR, (error: any) => {
      console.error('서버에서 오류가 발생했습니다:', error);
      if (this.handlers.onError) {
        this.handlers.onError(error);
      }
    });
  }

  /**
   * 방에 참가합니다.
   */
  joinRoom(roomId: string, userInfo: { name: string; instrument?: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('시그널링 서버에 연결되어 있지 않습니다.'));
        return;
      }

      this.roomId = roomId;
      this.socket.emit(SignalMessageType.JOIN_ROOM, { roomId, userInfo }, (response: { success: boolean; userId?: string; error?: string }) => {
        if (response.success && response.userId) {
          this.userId = response.userId;
          console.log(`방 ${roomId}에 참가했습니다. 내 ID: ${this.userId}`);
          resolve();
        } else {
          console.error('방 참가 오류:', response.error);
          reject(new Error(response.error));
        }
      });
    });
  }

  /**
   * 오퍼를 전송합니다.
   */
  sendOffer(targetUserId: string, offer: RTCSessionDescriptionInit): void {
    if (!this.socket) {
      throw new Error('시그널링 서버에 연결되어 있지 않습니다.');
    }

    this.socket.emit(SignalMessageType.OFFER, {
      targetUserId,
      offer,
    });
  }

  /**
   * 응답을 전송합니다.
   */
  sendAnswer(targetUserId: string, answer: RTCSessionDescriptionInit): void {
    if (!this.socket) {
      throw new Error('시그널링 서버에 연결되어 있지 않습니다.');
    }

    this.socket.emit(SignalMessageType.ANSWER, {
      targetUserId,
      answer,
    });
  }

  /**
   * ICE 후보를 전송합니다.
   */
  sendIceCandidate(targetUserId: string, candidate: RTCIceCandidate): void {
    if (!this.socket) {
      throw new Error('시그널링 서버에 연결되어 있지 않습니다.');
    }

    this.socket.emit(SignalMessageType.ICE_CANDIDATE, {
      targetUserId,
      candidate,
    });
  }

  /**
   * 채팅 메시지를 전송합니다.
   */
  sendChatMessage(message: string): void {
    if (!this.socket) {
      throw new Error('시그널링 서버에 연결되어 있지 않습니다.');
    }

    this.socket.emit(SignalMessageType.CHAT_MESSAGE, {
      roomId: this.roomId,
      message,
    });
  }

  /**
   * 악기 변경 정보를 전송합니다.
   */
  changeInstrument(instrument: string): void {
    if (!this.socket) {
      throw new Error('시그널링 서버에 연결되어 있지 않습니다.');
    }

    this.socket.emit(SignalMessageType.INSTRUMENT_CHANGED, {
      roomId: this.roomId,
      instrument,
    });
  }

  /**
   * 방에서 나갑니다.
   */
  leaveRoom(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.socket || !this.roomId) {
        resolve();
        return;
      }

      this.socket.emit('leave-room', { roomId: this.roomId }, () => {
        this.roomId = '';
        resolve();
      });
    });
  }

  /**
   * 시그널링 서버와 연결을 종료합니다.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * 현재 사용자 ID를 반환합니다.
   */
  getCurrentUserId(): string {
    return this.userId;
  }

  /**
   * 현재 방 ID를 반환합니다.
   */
  getCurrentRoomId(): string {
    return this.roomId;
  }
}
/**
 * 협업 세션 상태 관리 스토어
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

import { post, get } from '../lib/api';
import { EventKeys, publishEvent } from '../lib/events';

// 세션 참가자 인터페이스
export interface Participant {
  id: string;
  username: string;
  avatar?: string;
  isHost: boolean;
  instrument?: string;
  isConnected: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  lastPing?: number;
}

// 메시지 인터페이스
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  isSystem?: boolean;
}

// 세션 상태 인터페이스
interface SessionState {
  // 세션 정보
  currentRoom: {
    id: string;
    name: string;
    description?: string;
    isPrivate: boolean;
    createdAt: number;
  } | null;
  
  // 연결 상태
  isConnected: boolean;
  isConnecting: boolean;
  connectionError: string | null;
  
  // 참가자
  participants: Participant[];
  localParticipant: Participant | null;
  
  // 채팅
  messages: ChatMessage[];
  
  // 오디오/비디오 설정
  audioEnabled: boolean;
  videoEnabled: boolean;
  
  // 액션
  createRoom: (name: string, isPrivate: boolean, description?: string) => Promise<string | null>;
  joinRoom: (roomId: string) => Promise<boolean>;
  leaveRoom: () => void;
  
  // 참가자 관리
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void;
  
  // 미디어 제어
  toggleAudio: () => void;
  toggleVideo: () => void;
  
  // 채팅
  sendMessage: (content: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id'>) => void;
}

const useSessionStore = create<SessionState>((set, get) => ({
  // 초기 상태
  currentRoom: null,
  isConnected: false,
  isConnecting: false,
  connectionError: null,
  
  participants: [],
  localParticipant: null,
  
  messages: [],
  
  audioEnabled: true,
  videoEnabled: false,
  
  // 방 생성
  createRoom: async (name, isPrivate, description) => {
    try {
      set({ isConnecting: true, connectionError: null });
      
      const response = await post('/sync-room/create', {
        name,
        isPrivate,
        description
      });
      
      if (response.error) {
        set({ connectionError: response.error, isConnecting: false });
        return null;
      }
      
      const roomId = response.data?.roomId;
      if (roomId) {
        const success = await get().joinRoom(roomId);
        if (!success) return null;
        return roomId;
      }
      
      set({ isConnecting: false });
      return null;
      
    } catch (err) {
      set({ 
        connectionError: err instanceof Error ? err.message : '방 생성 중 오류가 발생했습니다.',
        isConnecting: false
      });
      return null;
    }
  },
  
  // 방 참가
  joinRoom: async (roomId) => {
    try {
      set({ isConnecting: true, connectionError: null });
      
      const response = await post(`/sync-room/${roomId}/join`, {});
      
      if (response.error) {
        set({ connectionError: response.error, isConnecting: false });
        return false;
      }
      
      const { room, participants } = response.data;
      
      // 로컬 참가자 정보 설정 (서버에서 전달받음)
      const localParticipant = participants.find((p: Participant) => p.id === response.data.localParticipantId);
      
      set({
        currentRoom: {
          id: room.id,
          name: room.name,
          description: room.description,
          isPrivate: room.isPrivate,
          createdAt: room.createdAt,
        },
        participants,
        localParticipant,
        isConnected: true,
        isConnecting: false,
        connectionError: null,
      });
      
      publishEvent(EventKeys.JAM_SESSION_JOINED, { roomId });
      
      // 시스템 메시지 추가
      get().addMessage({
        senderId: 'system',
        senderName: 'System',
        content: '세션에 참가했습니다.',
        timestamp: Date.now(),
        isSystem: true,
      });
      
      return true;
      
    } catch (err) {
      set({ 
        connectionError: err instanceof Error ? err.message : '방 참가 중 오류가 발생했습니다.',
        isConnecting: false
      });
      return false;
    }
  },
  
  // 방 나가기
  leaveRoom: () => {
    const { currentRoom } = get();
    
    if (currentRoom) {
      // 서버에 방 나가기 요청
      post(`/sync-room/${currentRoom.id}/leave`, {})
        .catch(err => console.error('방 나가기 오류:', err));
      
      publishEvent(EventKeys.JAM_SESSION_LEFT, { roomId: currentRoom.id });
    }
    
    set({
      currentRoom: null,
      participants: [],
      localParticipant: null,
      messages: [],
      isConnected: false,
    });
  },
  
  // 참가자 관리
  addParticipant: (participant) => {
    set(state => ({
      participants: [...state.participants, participant]
    }));
    
    // 시스템 메시지 추가
    get().addMessage({
      senderId: 'system',
      senderName: 'System',
      content: `${participant.username}님이 입장했습니다.`,
      timestamp: Date.now(),
      isSystem: true,
    });
  },
  
  removeParticipant: (participantId) => {
    const { participants } = get();
    const participant = participants.find(p => p.id === participantId);
    
    set(state => ({
      participants: state.participants.filter(p => p.id !== participantId)
    }));
    
    // 시스템 메시지 추가
    if (participant) {
      get().addMessage({
        senderId: 'system',
        senderName: 'System',
        content: `${participant.username}님이 퇴장했습니다.`,
        timestamp: Date.now(),
        isSystem: true,
      });
    }
  },
  
  updateParticipant: (participantId, updates) => {
    set(state => ({
      participants: state.participants.map(participant =>
        participant.id === participantId
          ? { ...participant, ...updates }
          : participant
      ),
      // 로컬 참가자인 경우 업데이트
      localParticipant: state.localParticipant?.id === participantId
        ? { ...state.localParticipant, ...updates }
        : state.localParticipant
    }));
    
    // 악기 변경 시 이벤트 발생
    if (updates.instrument) {
      publishEvent(EventKeys.INSTRUMENT_CHANGED, { 
        participantId, 
        instrument: updates.instrument 
      });
    }
  },
  
  // 미디어 제어
  toggleAudio: () => {
    const { audioEnabled, localParticipant } = get();
    const newState = !audioEnabled;
    
    set({ audioEnabled: newState });
    
    if (localParticipant) {
      get().updateParticipant(localParticipant.id, { audioEnabled: newState });
    }
  },
  
  toggleVideo: () => {
    const { videoEnabled, localParticipant } = get();
    const newState = !videoEnabled;
    
    set({ videoEnabled: newState });
    
    if (localParticipant) {
      get().updateParticipant(localParticipant.id, { videoEnabled: newState });
    }
  },
  
  // 채팅
  sendMessage: (content) => {
    const { currentRoom, localParticipant } = get();
    
    if (!currentRoom || !localParticipant || !content.trim()) {
      return;
    }
    
    const message = {
      senderId: localParticipant.id,
      senderName: localParticipant.username,
      content: content.trim(),
      timestamp: Date.now(),
    };
    
    // 메시지를 서버로 전송
    post(`/sync-room/${currentRoom.id}/message`, message)
      .catch(err => console.error('메시지 전송 오류:', err));
    
    // 로컬에 메시지 추가
    get().addMessage(message);
  },
  
  addMessage: (message) => {
    const newMessage = {
      ...message,
      id: uuidv4(), // 고유 ID 생성
    };
    
    set(state => ({
      messages: [...state.messages, newMessage]
    }));
    
    // 새 메시지 알림
    if (!message.isSystem) {
      publishEvent(EventKeys.NEW_MESSAGE_RECEIVED, newMessage);
    }
  },
}));

export default useSessionStore;
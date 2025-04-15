/**
 * WebRTC 관련 타입 정의
 */

// WebRTC 설정 인터페이스
export interface RTCConfig {
  iceServers: RTCIceServer[];
  iceCandidatePoolSize?: number;
  bundlePolicy?: RTCBundlePolicy;
  rtcpMuxPolicy?: RTCRtcpMuxPolicy;
}

// 기본 WebRTC 설정
export const DEFAULT_RTC_CONFIG: RTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 10,
};

// 피어 상태 열거형
export enum PeerConnectionState {
  NEW = 'new',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  FAILED = 'failed',
  CLOSED = 'closed',
}

// 사용자 정보 인터페이스
export interface PeerUser {
  id: string;
  name: string;
  instrument?: string;
  isHost?: boolean;
}

// 오디오 설정 인터페이스
export interface AudioSettings {
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  sampleRate?: number;
  channelCount?: number;
}

// 기본 오디오 설정
export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: 48000,
  channelCount: 2,
};

// 연결 이벤트 리스너 인터페이스
export interface ConnectionEventHandlers {
  onConnectionStateChange?: (state: RTCPeerConnectionState, peerId: string) => void;
  onIceConnectionStateChange?: (state: RTCIceConnectionState, peerId: string) => void;
  onIceCandidate?: (candidate: RTCIceCandidate | null, peerId: string) => void;
  onTrack?: (event: RTCTrackEvent, peerId: string) => void;
  onDataChannel?: (event: RTCDataChannelEvent, peerId: string) => void;
  onNegotiationNeeded?: (peerId: string) => void;
  onError?: (error: Error, peerId: string) => void;
}

// 데이터 채널 메시지 인터페이스
export interface DataChannelMessage {
  type: string;
  payload: any;
  senderId: string;
  timestamp: number;
}

// 데이터 채널 이벤트 핸들러 인터페이스
export interface DataChannelEventHandlers {
  onOpen?: (event: Event, peerId: string) => void;
  onClose?: (event: Event, peerId: string) => void;
  onMessage?: (message: DataChannelMessage, peerId: string) => void;
  onError?: (event: Event, peerId: string) => void;
}
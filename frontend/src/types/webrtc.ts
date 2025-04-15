// 피어 연결 상태 타입
export type PeerConnectionState = 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed';

// 피어 아이스 연결 상태 타입
export type PeerIceConnectionState = 'new' | 'checking' | 'connected' | 'completed' | 'disconnected' | 'failed' | 'closed';

// 시그널링 메시지 타입
export type SignalingMessage = {
  type: 'offer' | 'answer' | 'candidate' | 'connected' | 'disconnected' | 'mute' | 'unmute';
  sender: string;
  receiver?: string;
  room: string;
  payload: any;
  timestamp: number;
};

// 시그널링 오퍼 페이로드 타입
export type OfferPayload = {
  sdp: string;
  instrument?: string;
  userName?: string;
};

// 시그널링 앤서 페이로드 타입
export type AnswerPayload = {
  sdp: string;
};

// 시그널링 아이스 캔디데이트 페이로드 타입
export type CandidatePayload = {
  candidate: RTCIceCandidateInit;
};

// 참가자 정보 타입 (WebRTC 컨텍스트에서)
export type PeerInfo = {
  id: string;
  name: string;
  connection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
  audioStream?: MediaStream;
  instrument: string;
  isMuted: boolean;
  isRecording: boolean;
  isConnected: boolean;
  isHost: boolean;
  connectionState: PeerConnectionState;
  iceConnectionState: PeerIceConnectionState;
  latency?: number;
  networkStats?: NetworkStats;
};

// 네트워크 통계 타입
export type NetworkStats = {
  jitter?: number;
  packetsLost?: number;
  roundTripTime?: number;
  audioLevel?: number;
  bytesReceived?: number;
  bytesSent?: number;
  timestamp: number;
};

// WebRTC 설정 타입
export type WebRTCConfig = {
  iceServers: RTCIceServer[];
  iceTransportPolicy?: RTCIceTransportPolicy;
  bundlePolicy?: RTCBundlePolicy;
  rtcpMuxPolicy?: RTCRtcpMuxPolicy;
  peerConnectionConfig?: RTCConfiguration;
  mediaConstraints: MediaStreamConstraints;
  audioConstraints?: MediaTrackConstraints;
  videoConstraints?: MediaTrackConstraints;
  dataChannelConfig?: RTCDataChannelInit;
  maxRetryAttempts: number;
  retryDelay: number;
  autoReconnect: boolean;
};

// 미디어 디바이스 정보 타입
export type MediaDeviceInfo = {
  id: string;
  label: string;
  kind: 'audioinput' | 'audiooutput' | 'videoinput';
};

// 오디오 수준 데이터 타입
export type AudioLevelData = {
  peerId: string;
  level: number;
  timestamp: number;
};

// 시그널링 서버 타입
export type SignalingServerConfig = {
  url: string;
  options?: {
    reconnection: boolean;
    reconnectionAttempts: number;
    reconnectionDelay: number;
    reconnectionDelayMax: number;
    timeout: number;
    autoConnect: boolean;
  };
};

// WebRTC 상태 타입
export type WebRTCState = {
  isInitialized: boolean;
  localStream?: MediaStream;
  peers: Record<string, PeerInfo>;
  localAudioLevel: number;
  isMuted: boolean;
  isConnectionLoading: boolean;
  isReconnecting: boolean;
  connectionError?: string;
  selectedAudioInput?: string;
  selectedAudioOutput?: string;
  availableDevices: {
    audioInput: MediaDeviceInfo[];
    audioOutput: MediaDeviceInfo[];
  };
  roomInfo?: {
    id: string;
    name: string;
    hostId: string;
    participantCount: number;
    maxParticipants: number;
  };
  signalingConnected: boolean;
  effectsEnabled: boolean;
  lastHeartbeat?: number;
};

// 네트워크 품질 타입
export type NetworkQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'bad' | 'disconnected';

// 오디오 처리 노드 타입
export type AudioProcessingNodes = {
  source?: MediaStreamAudioSourceNode;
  destination?: MediaStreamAudioDestinationNode;
  gainNode?: GainNode;
  analyserNode?: AnalyserNode;
  compressorNode?: DynamicsCompressorNode;
  pannerNode?: StereoPannerNode;
  effects?: {
    reverb?: ConvolverNode;
    delay?: DelayNode;
    distortion?: WaveShaperNode;
    equalizer?: BiquadFilterNode[];
  };
};
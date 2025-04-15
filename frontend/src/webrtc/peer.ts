 /**
 * WebRTC 피어 연결 관리를 위한 유틸리티
 */

// ICE 서버 설정 (실제 구현 시 STUN/TURN 서버를 사용해야 함)
const DEFAULT_ICE_SERVERS = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302', // Google의 공개 STUN 서버
    },
    // 프로덕션 환경에서는 아래와 같이 TURN 서버도 설정 필요
    // {
    //   urls: 'turn:your-turn-server.com:3478',
    //   username: 'username',
    //   credential: 'credential',
    // }
  ],
};

// 오디오 제약 조건 (저지연 최적화)
const DEFAULT_AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  latency: 0.01, // 최소 지연 설정
  sampleRate: 48000, // 고품질 샘플레이트
};

export interface PeerConnectionConfig {
  iceServers?: RTCConfiguration;
  audioConstraints?: MediaTrackConstraints;
  videoEnabled?: boolean;
  videoConstraints?: MediaTrackConstraints;
  onIceCandidate?: (candidate: RTCIceCandidate | null) => void;
  onTrack?: (event: RTCTrackEvent) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  onNegotiationNeeded?: () => void;
  onDataChannel?: (event: RTCDataChannelEvent) => void;
}

export class PeerConnectionManager {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private config: PeerConnectionConfig;

  constructor(config?: PeerConnectionConfig) {
    this.config = {
      iceServers: DEFAULT_ICE_SERVERS,
      audioConstraints: DEFAULT_AUDIO_CONSTRAINTS,
      videoEnabled: false,
      ...config,
    };
  }

  /**
   * 로컬 미디어 스트림을 초기화합니다.
   */
  async initializeLocalStream(): Promise<MediaStream> {
    try {
      const constraints = {
        audio: this.config.audioConstraints,
        video: this.config.videoEnabled ? this.config.videoConstraints || true : false,
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (error) {
      console.error('미디어 스트림 초기화 오류:', error);
      throw new Error('마이크 접근 권한이 필요합니다.');
    }
  }

  /**
   * RTCPeerConnection을 생성합니다.
   */
  createPeerConnection(): RTCPeerConnection {
    if (this.peerConnection) {
      this.closePeerConnection();
    }

    this.peerConnection = new RTCPeerConnection(this.config.iceServers);

    // 이벤트 핸들러 설정
    this.peerConnection.onicecandidate = (event) => {
      if (this.config.onIceCandidate) {
        this.config.onIceCandidate(event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      if (this.config.onTrack) {
        this.config.onTrack(event);
      }
    };

    this.peerConnection.onnegotiationneeded = () => {
      if (this.config.onNegotiationNeeded) {
        this.config.onNegotiationNeeded();
      }
    };

    this.peerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.setupDataChannel();
      
      if (this.config.onDataChannel) {
        this.config.onDataChannel(event);
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      if (this.config.onConnectionStateChange && this.peerConnection) {
        this.config.onConnectionStateChange(this.peerConnection.connectionState);
      }
    };

    return this.peerConnection;
  }

  /**
   * 로컬 스트림을 피어 연결에 추가합니다.
   */
  addLocalStreamTracks(): void {
    if (!this.peerConnection) {
      throw new Error('먼저 createPeerConnection을 호출해야 합니다.');
    }

    if (!this.localStream) {
      throw new Error('먼저 initializeLocalStream을 호출해야 합니다.');
    }

    this.localStream.getTracks().forEach(track => {
      if (this.peerConnection && this.localStream) {
        this.peerConnection.addTrack(track, this.localStream);
      }
    });
  }

  /**
   * 데이터 채널을 생성합니다.
   */
  createDataChannel(label: string, options?: RTCDataChannelInit): RTCDataChannel | null {
    if (!this.peerConnection) {
      throw new Error('먼저 createPeerConnection을 호출해야 합니다.');
    }

    this.dataChannel = this.peerConnection.createDataChannel(label, options);
    this.setupDataChannel();
    return this.dataChannel;
  }

  /**
   * 데이터 채널 설정
   */
  private setupDataChannel(): void {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      console.log('데이터 채널이 열렸습니다.');
    };

    this.dataChannel.onclose = () => {
      console.log('데이터 채널이 닫혔습니다.');
    };

    this.dataChannel.onerror = (error) => {
      console.error('데이터 채널 오류:', error);
    };
  }

  /**
   * 오퍼를 생성합니다.
   */
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('먼저 createPeerConnection을 호출해야 합니다.');
    }

    const offer = await this.peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: this.config.videoEnabled,
    });
    
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  /**
   * 응답을 생성합니다.
   */
  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('먼저 createPeerConnection을 호출해야 합니다.');
    }

    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  /**
   * 원격 설명(SDP)을 설정합니다.
   */
  async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('먼저 createPeerConnection을 호출해야 합니다.');
    }

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(description));
  }

  /**
   * ICE 후보를 추가합니다.
   */
  async addIceCandidate(candidate: RTCIceCandidate): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('먼저 createPeerConnection을 호출해야 합니다.');
    }

    if (this.peerConnection.remoteDescription) {
      await this.peerConnection.addIceCandidate(candidate);
    }
  }

  /**
   * 데이터 채널을 통해 메시지를 전송합니다.
   */
  sendMessage(message: string | object): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      throw new Error('데이터 채널이 열려있지 않습니다.');
    }

    const data = typeof message === 'string' ? message : JSON.stringify(message);
    this.dataChannel.send(data);
  }

  /**
   * 피어 연결을 종료합니다.
   */
  closePeerConnection(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }

  /**
   * 현재 피어 연결 객체를 반환합니다.
   */
  getPeerConnection(): RTCPeerConnection | null {
    return this.peerConnection;
  }

  /**
   * 로컬 미디어 스트림을 반환합니다.
   */
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  /**
   * 특정 트랙의 활성 상태를 변경합니다.
   */
  setTrackEnabled(kind: 'audio' | 'video', enabled: boolean): void {
    if (!this.localStream) return;

    const tracks = kind === 'audio' 
      ? this.localStream.getAudioTracks()
      : this.localStream.getVideoTracks();
    
    tracks.forEach(track => {
      track.enabled = enabled;
    });
  }
}
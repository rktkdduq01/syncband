/**
 * 잼 세션 방 정보 타입
 */
export interface Room {
  id: string;
  name: string;
  description?: string;
  host: string;
  participants: Participant[];
  createdAt: number;
  isPrivate: boolean;
  maxParticipants: number;
  genre?: string;
  bpm?: number;
}

/**
 * 참가자 정보 타입
 */
export interface Participant {
  id: string;
  name: string;
  instrument: string;
  isMuted: boolean;
  isRecording: boolean;
  isLocal?: boolean;
}

/**
 * 오디오 트랙 타입
 */
export interface AudioTrackType {
  id: string;
  name: string;
  audioUrl: string;
  createdBy: string;
  createdAt: number;
  duration: number;
  instrument?: string;
  bpm?: number;
  key?: string;
  isRecording?: boolean;
  waveform?: number[];
}

/**
 * 간단한 믹스 프로젝트 타입
 */
export interface SimpleMixProject {
  id: string;
  name: string;
  description?: string;
  owner: string;
  collaborators: string[];
  tracks: AudioTrackType[];
  createdAt: number;
  updatedAt: number;
  isPublic: boolean;
  coverImage?: string;
  genre?: string;
  bpm: number;
  key?: string;
}

/**
 * 악기 타입
 */
export interface Instrument {
  id: string;
  name: string;
  type: 'piano' | 'synthesizer' | 'drums' | 'guitar' | 'bass' | 'other';
  icon: string;
  presets?: InstrumentPreset[];
}

/**
 * 악기 프리셋 타입
 */
export interface InstrumentPreset {
  id: string;
  name: string;
  settings: Record<string, any>;
}

// 오디오 트랙 타입
export type AudioTrack = {
  id: string;
  name: string;
  type: 'input' | 'instrument' | 'recorded' | 'imported';
  instrument?: string;
  volume: number;
  pan: number;
  isMuted: boolean;
  isSolo: boolean;
  isArmed: boolean;
  effects: AudioEffect[];
  color?: string;
};

// 오디오 효과 타입
export type AudioEffect = {
  id: string;
  type: 'reverb' | 'delay' | 'chorus' | 'distortion' | 'eq' | 'compressor';
  name: string;
  enabled: boolean;
  parameters: Record<string, number>;
};

// 믹서 설정 타입
export type MixerSettings = {
  masterVolume: number;
  bpm: number;
  timeSignature: string;
  isMetronomeEnabled: boolean;
  isSnapToGridEnabled: boolean;
  quantizeValue: string;
};

// 가상 악기 타입
export type VirtualInstrument = {
  id: string;
  type: 'guitar' | 'piano' | 'drums' | 'bass' | 'synth';
  name: string;
  presets: InstrumentPreset[];
  currentPresetId: string;
};

// 녹음 세션 타입
export type RecordingSession = {
  id: string;
  name: string;
  createdAt: Date;
  duration: number;
  tracks: AudioTrack[];
  mixerSettings: MixerSettings;
};

// 믹싱 프로젝트 타입 (상세)
export type MixProject = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  collaborators?: string[];
  isPublic: boolean;
  tracks: AudioTrack[];
  mixerSettings: MixerSettings;
  markers: TimelineMarker[];
  tags?: string[];
  thumbnailUrl?: string;
};

// 타임라인 마커 타입
export type TimelineMarker = {
  id: string;
  name: string;
  timePosition: number;
  color?: string;
};

// 오디오 워크스테이션 상태 타입
export type DAWState = {
  currentProjectId: string | null;
  isPlaying: boolean;
  isRecording: boolean;
  currentPosition: number;
  loopStart: number | null;
  loopEnd: number | null;
  isLooping: boolean;
  zoom: number;
  selectedTrackIds: string[];
  history: HistoryState[];
  historyIndex: number;
};

// 히스토리 상태 타입 (실행 취소/다시 실행용)
export type HistoryState = {
  tracks: AudioTrack[];
  mixerSettings: MixerSettings;
  markers: TimelineMarker[];
  timestamp: number;
  label: string;
};
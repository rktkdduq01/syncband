/**
 * 오디오 관련 상태 관리 스토어
 */

import { create } from 'zustand';
import { EventKeys, publishEvent } from '../lib/events';

interface AudioTrack {
  id: string;
  name: string;
  url: string;
  waveform?: number[];
  volume: number;
  pan: number;
  muted: boolean;
  soloed: boolean;
}

interface AudioState {
  // 오디오 컨텍스트
  audioContext: AudioContext | null;
  
  // 재생 상태
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  bpm: number;
  
  // 트랙 관리
  tracks: AudioTrack[];
  selectedTrackId: string | null;
  
  // 마스터 출력
  masterVolume: number;
  isMasterMuted: boolean;
  
  // 액션
  initializeAudioContext: () => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seekTo: (time: number) => void;
  setBpm: (bpm: number) => void;
  
  // 트랙 관리 액션
  addTrack: (track: Omit<AudioTrack, 'volume' | 'pan' | 'muted' | 'soloed'>) => void;
  removeTrack: (trackId: string) => void;
  updateTrack: (trackId: string, updates: Partial<AudioTrack>) => void;
  selectTrack: (trackId: string | null) => void;
  
  // 볼륨 컨트롤
  setMasterVolume: (volume: number) => void;
  toggleMasterMute: () => void;
  setTrackVolume: (trackId: string, volume: number) => void;
  setTrackPan: (trackId: string, pan: number) => void;
  toggleTrackMute: (trackId: string) => void;
  toggleTrackSolo: (trackId: string) => void;
  
  // 재생 시간 업데이트
  updateCurrentTime: (time: number) => void;
}

const useAudioStore = create<AudioState>((set, get) => ({
  // 초기 상태
  audioContext: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  bpm: 120,
  
  tracks: [],
  selectedTrackId: null,
  
  masterVolume: 0.8,
  isMasterMuted: false,
  
  // 오디오 컨텍스트 초기화
  initializeAudioContext: () => {
    // 브라우저 환경에서만 실행
    if (typeof window !== 'undefined' && !get().audioContext) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();
        set({ audioContext });
      } catch (err) {
        console.error('오디오 컨텍스트 초기화 실패:', err);
      }
    }
  },
  
  // 재생 제어
  play: () => {
    const { audioContext, isPlaying } = get();
    
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    if (!isPlaying) {
      set({ isPlaying: true });
      publishEvent(EventKeys.AUDIO_PLAYBACK_STARTED);
    }
  },
  
  pause: () => {
    const { isPlaying } = get();
    
    if (isPlaying) {
      set({ isPlaying: false });
      publishEvent(EventKeys.AUDIO_PLAYBACK_PAUSED);
    }
  },
  
  stop: () => {
    set({ isPlaying: false, currentTime: 0 });
    publishEvent(EventKeys.AUDIO_PLAYBACK_STOPPED);
  },
  
  seekTo: (time) => {
    set({ currentTime: Math.max(0, Math.min(time, get().duration)) });
  },
  
  setBpm: (bpm) => {
    set({ bpm: Math.max(20, Math.min(bpm, 300)) });
  },
  
  // 트랙 관리
  addTrack: (track) => {
    const newTrack: AudioTrack = {
      ...track,
      volume: 0.8,
      pan: 0,
      muted: false,
      soloed: false,
    };
    
    set(state => ({ 
      tracks: [...state.tracks, newTrack],
      selectedTrackId: state.selectedTrackId || newTrack.id
    }));
    
    publishEvent(EventKeys.AUDIO_TRACK_ADDED, newTrack);
  },
  
  removeTrack: (trackId) => {
    const { tracks, selectedTrackId } = get();
    const newTracks = tracks.filter(track => track.id !== trackId);
    
    // 선택된 트랙이 삭제되는 경우 다른 트랙 선택
    let newSelectedTrackId = selectedTrackId;
    if (selectedTrackId === trackId) {
      newSelectedTrackId = newTracks.length > 0 ? newTracks[0].id : null;
    }
    
    set({ 
      tracks: newTracks,
      selectedTrackId: newSelectedTrackId
    });
    
    publishEvent(EventKeys.AUDIO_TRACK_REMOVED, trackId);
  },
  
  updateTrack: (trackId, updates) => {
    set(state => ({
      tracks: state.tracks.map(track => 
        track.id === trackId 
          ? { ...track, ...updates } 
          : track
      )
    }));
  },
  
  selectTrack: (trackId) => {
    set({ selectedTrackId: trackId });
  },
  
  // 볼륨 제어
  setMasterVolume: (volume) => {
    const newVolume = Math.max(0, Math.min(volume, 1));
    set({ masterVolume: newVolume });
    publishEvent(EventKeys.AUDIO_VOLUME_CHANGED, { type: 'master', volume: newVolume });
  },
  
  toggleMasterMute: () => {
    set(state => ({ isMasterMuted: !state.isMasterMuted }));
  },
  
  setTrackVolume: (trackId, volume) => {
    const newVolume = Math.max(0, Math.min(volume, 1));
    set(state => ({
      tracks: state.tracks.map(track => 
        track.id === trackId 
          ? { ...track, volume: newVolume } 
          : track
      )
    }));
  },
  
  setTrackPan: (trackId, pan) => {
    const newPan = Math.max(-1, Math.min(pan, 1));
    set(state => ({
      tracks: state.tracks.map(track => 
        track.id === trackId 
          ? { ...track, pan: newPan } 
          : track
      )
    }));
  },
  
  toggleTrackMute: (trackId) => {
    set(state => ({
      tracks: state.tracks.map(track => 
        track.id === trackId 
          ? { ...track, muted: !track.muted } 
          : track
      )
    }));
  },
  
  toggleTrackSolo: (trackId) => {
    set(state => ({
      tracks: state.tracks.map(track => 
        track.id === trackId 
          ? { ...track, soloed: !track.soloed } 
          : track
      )
    }));
  },
  
  // 재생 시간 업데이트
  updateCurrentTime: (time) => {
    set({ currentTime: time });
  },
}));

export default useAudioStore;
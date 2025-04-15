"use client";

import { useState, useEffect, useRef } from 'react';
import useAudioContext from '@/hooks/useAudioContext';
import { Button } from '@/components/common/Button';

interface AudioTrack {
  id: string;
  name: string;
  audioUrl: string;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  color?: string;
}

interface AudioMixerProps {
  initialTracks?: AudioTrack[];
  onSaveMix?: (tracks: AudioTrack[]) => void;
}

const DEFAULT_TRACKS: AudioTrack[] = [
  { id: 'drums', name: '드럼', audioUrl: '/assets/audio/tracks/drums.mp3', volume: 0.7, pan: 0, muted: false, solo: false, color: 'bg-red-500' },
  { id: 'bass', name: '베이스', audioUrl: '/assets/audio/tracks/bass.mp3', volume: 0.8, pan: 0, muted: false, solo: false, color: 'bg-blue-500' },
  { id: 'guitar', name: '기타', audioUrl: '/assets/audio/tracks/guitar.mp3', volume: 0.65, pan: 0.2, muted: false, solo: false, color: 'bg-green-500' },
  { id: 'keys', name: '키보드', audioUrl: '/assets/audio/tracks/keys.mp3', volume: 0.6, pan: -0.2, muted: false, solo: false, color: 'bg-yellow-500' },
  { id: 'vocals', name: '보컬', audioUrl: '/assets/audio/tracks/vocals.mp3', volume: 0.75, pan: 0, muted: false, solo: false, color: 'bg-purple-500' },
];

const AudioMixer = ({ initialTracks = DEFAULT_TRACKS, onSaveMix }: AudioMixerProps) => {
  const { audioContext } = useAudioContext();
  const [tracks, setTracks] = useState<AudioTrack[]>(initialTracks);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // 오디오 노드 및 버퍼 참조 저장
  const audioBuffers = useRef<Map<string, AudioBuffer>>(new Map());
  const audioSources = useRef<Map<string, AudioBufferSourceNode>>(new Map());
  const gainNodes = useRef<Map<string, GainNode>>(new Map());
  const panNodes = useRef<Map<string, StereoPannerNode>>(new Map());
  const startTime = useRef<number>(0);
  const animationRef = useRef<number>(0);
  
  // 트랙 로딩
  useEffect(() => {
    if (!audioContext) return;
    
    const loadTracks = async () => {
      let maxDuration = 0;
      
      for (const track of tracks) {
        try {
          // 이미 로드된 트랙은 건너뛰기
          if (audioBuffers.current.has(track.id)) continue;
          
          const response = await fetch(track.audioUrl);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          audioBuffers.current.set(track.id, audioBuffer);
          maxDuration = Math.max(maxDuration, audioBuffer.duration);
        } catch (error) {
          console.error(`Failed to load audio track: ${track.name}`, error);
        }
      }
      
      setDuration(maxDuration);
    };
    
    loadTracks();
  }, [audioContext, tracks]);
  
  // 트랙 설정 변경 핸들러
  const updateTrack = (id: string, updates: Partial<AudioTrack>) => {
    setTracks(prevTracks => {
      // 현재 상태 기반으로 업데이트된 트랙 배열 생성
      const updatedTracks = prevTracks.map(track => 
        track.id === id ? { ...track, ...updates } : track
      );
      
      // 실시간으로 오디오 파라미터 업데이트
      if (isPlaying && audioContext) {
        // 솔로 모드 상태 확인
        const hasSoloTrack = updatedTracks.some(track => track.solo);
        
        // 모든 트랙에 대해 게인 값 업데이트
        updatedTracks.forEach(track => {
          if (gainNodes.current.has(track.id)) {
            const gainNode = gainNodes.current.get(track.id)!;
            // 솔로 트랙이 있으면 솔로 트랙만 재생, 아니면 뮤트 상태에 따라 재생
            const shouldPlay = hasSoloTrack ? track.solo : !track.muted;
            gainNode.gain.value = shouldPlay ? track.volume : 0;
          }
          
          // 패닝 노드 업데이트 (해당 트랙이 업데이트되는 경우)
          if (track.id === id && updates.pan !== undefined && panNodes.current.has(id)) {
            panNodes.current.get(id)!.pan.value = updates.pan;
          }
        });
      }
      
      return updatedTracks;
    });
  };
  
  // 재생/정지 토글
  const togglePlayback = async () => {
    if (!audioContext) return;
    
    if (isPlaying) {
      // 재생 중이면 모든 소스 정지
      audioSources.current.forEach(source => {
        try {
          source.stop();
        } catch (e) {
          // 이미 정지된 소스는 무시
        }
      });
      audioSources.current.clear();
      gainNodes.current.clear();
      panNodes.current.clear();
      
      cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
    } else {
      // 모든 트랙 동시에 재생 시작
      const hasSoloTrack = tracks.some(track => track.solo);
      
      // 현재 시간 저장
      startTime.current = audioContext.currentTime - currentTime;
      
      for (const track of tracks) {
        if (!audioBuffers.current.has(track.id)) continue;
        
        const shouldPlay = hasSoloTrack ? track.solo : !track.muted;
        
        // 오디오 소스 생성
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffers.current.get(track.id)!;
        
        // 게인 노드 생성 및 연결
        const gainNode = audioContext.createGain();
        gainNode.gain.value = shouldPlay ? track.volume : 0;
        
        // 패닝 노드 생성 및 연결
        const panNode = audioContext.createStereoPanner();
        panNode.pan.value = track.pan;
        
        source.connect(panNode);
        panNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 저장
        audioSources.current.set(track.id, source);
        gainNodes.current.set(track.id, gainNode);
        panNodes.current.set(track.id, panNode);
        
        // 현재 위치에서 시작
        source.start(0, currentTime);
      }
      
      // 타임라인 업데이트 시작
      updatePlaybackTime();
      setIsPlaying(true);
    }
  };
  
  // 시간 위치 업데이트
  const updatePlaybackTime = () => {
    if (!audioContext) return;
    
    const newTime = audioContext.currentTime - startTime.current;
    setCurrentTime(newTime);
    
    if (newTime < duration) {
      animationRef.current = requestAnimationFrame(updatePlaybackTime);
    } else {
      // 끝까지 재생 완료
      setCurrentTime(0);
      setIsPlaying(false);
      
      // 모든 소스 정지 (안전 조치)
      audioSources.current.forEach(source => {
        try {
          source.stop();
        } catch (e) {
          // 이미 정지된 소스는 무시
        }
      });
      audioSources.current.clear();
      gainNodes.current.clear();
      panNodes.current.clear();
    }
  };
  
  // 특정 시간으로 이동
  const seekTo = (time: number) => {
    if (!audioContext || time < 0 || time > duration) return;
    
    const wasPlaying = isPlaying;
    
    // 현재 재생 중인 모든 소스 정지
    if (wasPlaying) {
      audioSources.current.forEach(source => {
        try {
          source.stop();
        } catch (e) {
          // 이미 정지된 소스는 무시
        }
      });
      cancelAnimationFrame(animationRef.current);
    }
    
    // 새 위치 설정
    setCurrentTime(time);
    audioSources.current.clear();
    gainNodes.current.clear();
    panNodes.current.clear();
    
    // 재생 중이었으면 새 위치에서 다시 시작
    if (wasPlaying) {
      // 현재 시간 저장
      startTime.current = audioContext.currentTime - time;
      
      const hasSoloTrack = tracks.some(track => track.solo);
      
      for (const track of tracks) {
        if (!audioBuffers.current.has(track.id)) continue;
        
        const shouldPlay = hasSoloTrack ? track.solo : !track.muted;
        
        // 오디오 소스 생성
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffers.current.get(track.id)!;
        
        // 게인 노드 생성 및 연결
        const gainNode = audioContext.createGain();
        gainNode.gain.value = shouldPlay ? track.volume : 0;
        
        // 패닝 노드 생성 및 연결
        const panNode = audioContext.createStereoPanner();
        panNode.pan.value = track.pan;
        
        source.connect(panNode);
        panNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 저장
        audioSources.current.set(track.id, source);
        gainNodes.current.set(track.id, gainNode);
        panNodes.current.set(track.id, panNode);
        
        // 새 위치에서 시작
        source.start(0, time);
      }
      
      // 타임라인 업데이트 시작
      updatePlaybackTime();
    }
  };
  
  // 믹스 저장
  const saveMix = () => {
    if (onSaveMix) {
      onSaveMix(tracks);
    }
  };
  
  // 시각적 타임라인 값 포맷
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">오디오 믹서</h2>
      
      {/* 재생 컨트롤 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Button 
            onClick={togglePlayback} 
            className="flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                정지
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                재생
              </>
            )}
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">{formatTime(currentTime)}</span>
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500" 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm">{formatTime(duration)}</span>
          </div>
          
          <Button variant="outline" onClick={saveMix}>
            믹스 저장
          </Button>
        </div>
        
        <input 
          type="range" 
          min={0} 
          max={duration} 
          step={0.01} 
          value={currentTime}
          onChange={(e) => seekTo(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      {/* 트랙 목록 */}
      <div className="space-y-4">
        {tracks.map((track) => (
          <div key={track.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50">
            <div className={`w-3 h-full ${track.color || 'bg-gray-300'} rounded-full`}></div>
            
            <div className="w-24 truncate">{track.name}</div>
            
            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={track.volume}
                onChange={(e) => updateTrack(track.id, { volume: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            
            <div className="text-xs">{Math.round(track.volume * 100)}%</div>
            
            <div className="flex gap-2">
              <button
                onClick={() => updateTrack(track.id, { muted: !track.muted })}
                className={`p-1 rounded ${track.muted ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200'}`}
                title={track.muted ? '음소거 해제' : '음소거'}
              >
                {track.muted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={() => updateTrack(track.id, { solo: !track.solo })}
                className={`p-1 rounded ${track.solo ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-gray-200'}`}
                title={track.solo ? '솔로 해제' : '솔로'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs">L</span>
              <input
                type="range"
                min={-1}
                max={1}
                step={0.1}
                value={track.pan}
                onChange={(e) => updateTrack(track.id, { pan: parseFloat(e.target.value) })}
                className="w-24"
              />
              <span className="text-xs">R</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioMixer;
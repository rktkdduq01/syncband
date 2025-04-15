"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import useAudioContext from '@/hooks/useAudioContext';
import { Button } from '@/components/common/Button';

interface DrumPadProps {
  onDrumHit?: (drumId: string, velocity: number) => void;
}

interface DrumPad {
  id: string;
  name: string;
  key: string;
  color: string;
  soundUrl: string;
}

const DEFAULT_DRUM_PADS: DrumPad[] = [
  { id: 'kick', name: '킥', key: 'z', color: 'bg-red-500', soundUrl: '/assets/audio/drums/kick.mp3' },
  { id: 'snare', name: '스네어', key: 'x', color: 'bg-blue-500', soundUrl: '/assets/audio/drums/snare.mp3' },
  { id: 'hihat', name: '하이햇', key: 'c', color: 'bg-yellow-500', soundUrl: '/assets/audio/drums/hihat.mp3' },
  { id: 'tom1', name: '톰1', key: 'a', color: 'bg-green-500', soundUrl: '/assets/audio/drums/tom1.mp3' },
  { id: 'tom2', name: '톰2', key: 's', color: 'bg-purple-500', soundUrl: '/assets/audio/drums/tom2.mp3' },
  { id: 'crash', name: '크래시', key: 'd', color: 'bg-orange-500', soundUrl: '/assets/audio/drums/crash.mp3' },
  { id: 'ride', name: '라이드', key: 'q', color: 'bg-indigo-500', soundUrl: '/assets/audio/drums/ride.mp3' },
  { id: 'clap', name: '클랩', key: 'w', color: 'bg-pink-500', soundUrl: '/assets/audio/drums/clap.mp3' },
];

const DrumPad = ({ onDrumHit }: DrumPadProps) => {
  const { audioContext } = useAudioContext();
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeMode, setActiveMode] = useState<'finger' | 'sequence'>('finger');
  
  // 오디오 버퍼 캐시
  const audioBuffers = useRef<Map<string, AudioBuffer>>(new Map());
  const loadingErrors = useRef<string[]>([]);

  // 드럼 소리 로드
  useEffect(() => {
    if (!audioContext) return;
    
    let isMounted = true;
    const loadSamples = async () => {
      setIsLoading(true);
      const totalSamples = DEFAULT_DRUM_PADS.length;
      let loadedCount = 0;
      
      for (const pad of DEFAULT_DRUM_PADS) {
        try {
          const response = await fetch(pad.soundUrl);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          audioBuffers.current.set(pad.id, audioBuffer);
          loadedCount++;
          
          if (isMounted) {
            setLoadingProgress(Math.floor((loadedCount / totalSamples) * 100));
          }
        } catch (error) {
          console.error(`Failed to load drum sample: ${pad.name}`, error);
          loadingErrors.current.push(pad.id);
        }
      }
      
      if (isMounted) {
        setIsLoading(false);
      }
    };
    
    loadSamples();
    
    return () => {
      isMounted = false;
    };
  }, [audioContext]);

  // 드럼 사운드 재생
  const playDrumSound = useCallback((drumId: string, velocity = 1.0) => {
    if (!audioContext || !audioBuffers.current.has(drumId)) return;
    
    try {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffers.current.get(drumId)!;
      
      // 게인 노드를 통한 볼륨 제어
      const gainNode = audioContext.createGain();
      gainNode.gain.value = Math.min(1.0, Math.max(0.1, velocity));
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      source.start(0);
      
      // 외부 이벤트 호출
      if (onDrumHit) {
        onDrumHit(drumId, velocity);
      }
    } catch (error) {
      console.error('Failed to play drum sound:', error);
    }
  }, [audioContext, onDrumHit]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const keyMap = DEFAULT_DRUM_PADS.reduce<Record<string, string>>((map, pad) => {
      map[pad.key] = pad.id;
      return map;
    }, {});
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const drumId = keyMap[key];
      
      if (drumId && !e.repeat) {
        setActiveKeys(prev => {
          const updated = new Set(prev);
          updated.add(key);
          return updated;
        });
        playDrumSound(drumId, 1.0);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keyMap[key]) {
        setActiveKeys(prev => {
          const updated = new Set(prev);
          updated.delete(key);
          return updated;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playDrumSound]);

  const handlePadClick = (drumId: string) => {
    playDrumSound(drumId, 1.0);
  };

  const handlePadTouchStart = (e: React.TouchEvent, drumId: string) => {
    e.preventDefault();
    playDrumSound(drumId, 1.0);
  };

  const isPadActive = (key: string) => {
    return activeKeys.has(key);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        <p className="text-gray-600">드럼 사운드 로딩 중... {loadingProgress}%</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center space-x-4">
        <Button 
          variant={activeMode === 'finger' ? 'default' : 'outline'}
          onClick={() => setActiveMode('finger')}
          className="text-sm"
        >
          핑거 드럼
        </Button>
        <Button 
          variant={activeMode === 'sequence' ? 'default' : 'outline'}
          onClick={() => setActiveMode('sequence')}
          className="text-sm"
        >
          시퀀서
        </Button>
      </div>

      <div className="text-sm mb-2 text-center text-gray-600">
        패드를 클릭하거나 매핑된 키보드 키를 눌러 드럼을 연주하세요.
      </div>
      
      {activeMode === 'finger' ? (
        <div className="grid grid-cols-4 gap-4">
          {DEFAULT_DRUM_PADS.map((pad) => (
            <div 
              key={pad.id}
              className={`
                ${pad.color} ${isPadActive(pad.key) ? 'opacity-80 scale-95' : 'opacity-100'}
                h-24 rounded-lg flex items-center justify-center flex-col
                cursor-pointer select-none transition-all duration-75
                shadow-lg
              `}
              onMouseDown={() => handlePadClick(pad.id)}
              onTouchStart={(e) => handlePadTouchStart(e, pad.id)}
            >
              <span className="font-bold text-white">{pad.name}</span>
              <span className="text-xs bg-white bg-opacity-30 px-2 py-0.5 rounded mt-1 text-white uppercase">
                {pad.key}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-center text-gray-500">
            시퀀서 모드는 아직 구현되지 않았습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default DrumPad;
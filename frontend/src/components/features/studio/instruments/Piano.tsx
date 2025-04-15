"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import useAudioContext from '@/hooks/useAudioContext';

interface PianoProps {
  octaves?: number;
  startOctave?: number;
  onNoteOn?: (note: number, velocity: number) => void;
  onNoteOff?: (note: number) => void;
}

interface KeyProps {
  note: number;
  isBlack: boolean;
  isPressed: boolean;
  onNoteOn: (note: number) => void;
  onNoteOff: (note: number) => void;
}

// 단일 건반 컴포넌트
const PianoKey = ({ note, isBlack, isPressed, onNoteOn, onNoteOff }: KeyProps) => {
  const handleMouseDown = () => onNoteOn(note);
  const handleMouseUp = () => onNoteOff(note);
  const handleMouseLeave = () => onNoteOff(note);

  // 건반의 클래스 이름 생성
  const className = `
    ${isBlack ? 'bg-black border border-gray-600 h-32 w-8 z-10 -mx-4 ' : 'bg-white border border-gray-300 h-48 w-12 z-0 '}
    ${isPressed ? (isBlack ? 'bg-gray-700' : 'bg-gray-200') : ''}
    rounded-b-md cursor-pointer transition-colors duration-75
  `;

  return (
    <div
      className={className}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={(e) => {
        e.preventDefault();
        onNoteOn(note);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        onNoteOff(note);
      }}
    />
  );
};

// MIDI 노트 번호에 해당하는 건반 색상 결정
const isBlackKey = (note: number): boolean => {
  const noteInOctave = note % 12;
  return [1, 3, 6, 8, 10].includes(noteInOctave);
};

// 피아노 컴포넌트
const Piano = ({ 
  octaves = 2, 
  startOctave = 4,
  onNoteOn, 
  onNoteOff 
}: PianoProps) => {
  const { audioContext } = useAudioContext();
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());
  const activeOscillators = useRef<Map<number, OscillatorNode>>(new Map());
  
  // MIDI 노트 번호를 주파수(Hz)로 변환하는 함수
  const noteToFrequency = useCallback((note: number): number => {
    return 440 * Math.pow(2, (note - 69) / 12);
  }, []);
  
  // oscillator 생성 함수
  const createOscillator = useCallback((note: number): OscillatorNode | null => {
    if (!audioContext) return null;
    
    const frequency = noteToFrequency(note);
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // 기본 설정
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // ADSR 엔벨로프 설정
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.01); // Attack
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.3); // Decay
    
    // 연결 및 출력
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    return oscillator;
  }, [audioContext, noteToFrequency]);

  // 건반 배열 생성
  const keys = Array.from({ length: octaves * 12 }, (_, i) => {
    const note = (startOctave * 12) + i;
    return { note, isBlack: isBlackKey(note) };
  });

  // 노트 온 핸들러
  const handleNoteOn = useCallback((note: number, velocity = 100) => {
    if (!audioContext || pressedKeys.has(note)) return;

    // 이미 눌린 키는 다시 처리하지 않음
    setPressedKeys(prev => {
      const updated = new Set(prev);
      updated.add(note);
      return updated;
    });

    // 외부 이벤트 핸들러 호출
    if (onNoteOn) {
      onNoteOn(note, velocity);
    }

    // 오실레이터 생성 및 재생
    try {
      const oscillator = createOscillator(note);
      if (oscillator) {
        activeOscillators.current.set(note, oscillator);
        oscillator.start();
      }
    } catch (error) {
      console.error('Failed to create or start oscillator:', error);
    }
  }, [audioContext, createOscillator, onNoteOn, pressedKeys]);

  // 노트 오프 핸들러
  const handleNoteOff = useCallback((note: number) => {
    if (!pressedKeys.has(note)) return;

    setPressedKeys(prev => {
      const updated = new Set(prev);
      updated.delete(note);
      return updated;
    });

    // 외부 이벤트 핸들러 호출
    if (onNoteOff) {
      onNoteOff(note);
    }

    // 오실레이터 중지 및 제거
    const oscillator = activeOscillators.current.get(note);
    if (oscillator) {
      try {
        oscillator.stop();
        oscillator.disconnect();
        activeOscillators.current.delete(note);
      } catch (error) {
        console.error('Failed to stop oscillator:', error);
      }
    }
  }, [onNoteOff, pressedKeys]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const keyMap: Record<string, number> = {
      'z': 60, 's': 61, 'x': 62, 'd': 63, 'c': 64, 
      'v': 65, 'g': 66, 'b': 67, 'h': 68, 'n': 69, 
      'j': 70, 'm': 71, ',': 72
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const note = keyMap[e.key.toLowerCase()];
      if (note !== undefined && !e.repeat) {
        handleNoteOn(note);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const note = keyMap[e.key.toLowerCase()];
      if (note !== undefined) {
        handleNoteOff(note);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleNoteOn, handleNoteOff]);

  // 컴포넌트 언마운트시 모든 오실레이터 정리
  useEffect(() => {
    return () => {
      activeOscillators.current.forEach((oscillator) => {
        try {
          oscillator.stop();
          oscillator.disconnect();
        } catch (error) {
          console.error('Failed to clean up oscillator:', error);
        }
      });
      activeOscillators.current.clear();
    };
  }, []);

  // 흰색 건반과 검은색 건반 분리
  const whiteKeys = keys.filter(key => !key.isBlack);
  const blackKeys = keys.filter(key => key.isBlack);

  return (
    <div className="relative flex flex-col items-center">
      <div className="text-sm mb-2 text-gray-600">
        피아노 건반을 클릭하거나 키보드 Z-M 키를 이용해 연주할 수 있습니다.
      </div>
      <div className="relative flex">
        {whiteKeys.map(({ note }) => (
          <PianoKey
            key={note}
            note={note}
            isBlack={false}
            isPressed={pressedKeys.has(note)}
            onNoteOn={handleNoteOn}
            onNoteOff={handleNoteOff}
          />
        ))}
        <div className="absolute top-0 flex">
          {blackKeys.map(({ note }) => (
            <PianoKey
              key={note}
              note={note}
              isBlack={true}
              isPressed={pressedKeys.has(note)}
              onNoteOn={handleNoteOn}
              onNoteOff={handleNoteOff}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Piano;
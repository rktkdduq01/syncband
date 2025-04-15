import React, { useState, useEffect, useRef } from 'react';
// 정적 임포트 대신 동적 임포트 및 타입 정의 사용
import type * as ToneType from 'tone';

interface GuitarProps {
  strings?: number;
  frets?: number;
  onNoteOn?: (note: string) => void;
  onNoteOff?: (note: string) => void;
  recordMode?: boolean;
}

// Tone 타입 정의
type ToneTypes = {
  start: () => Promise<void>;
  PolySynth: any;
  Synth: any;
  Player: any;
};

// 기타 설정
const DEFAULT_STRINGS = 6;
const DEFAULT_FRETS = 15;
const STANDARD_TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']; // 표준 6현 기타 튜닝

const Guitar: React.FC<GuitarProps> = ({
  strings = DEFAULT_STRINGS,
  frets = DEFAULT_FRETS,
  onNoteOn,
  onNoteOff,
  recordMode = false,
}) => {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [synth, setSynth] = useState<any | null>(null);
  const [Tone, setTone] = useState<ToneTypes | null>(null);
  const [isClient, setIsClient] = useState(false);
  const guitarRef = useRef<HTMLDivElement>(null);
  const mouseIsDownRef = useRef<boolean>(false);
  const lastStringRef = useRef<number | null>(null);

  // 클라이언트 사이드에서만 실행되도록 설정
  useEffect(() => {
    setIsClient(true);
    
    // Tone.js 동적 임포트
    const loadTone = async () => {
      try {
        const ToneModule = await import('tone');
        setTone(ToneModule as unknown as ToneTypes);
      } catch (error) {
        console.error('Tone.js 로드 실패:', error);
      }
    };
    
    loadTone();
  }, []);
  
  // 톤.js 신디사이저 초기화
  useEffect(() => {
    if (!isClient || !Tone) return;
    
    // 오디오 컨텍스트 초기화
    Tone.start();
    
    // 기타 사운드를 위한 폴리포닉 신디사이저 생성
    const newSynth = new Tone.PolySynth(Tone.Synth, {
      volume: -8,
      oscillator: {
        type: 'sawtooth',
      },
      envelope: {
        attack: 0.005,
        decay: 0.3,
        sustain: 0.2,
        release: 1.5,
      },
    }).toDestination();
    
    setSynth(newSynth);

    // 컴포넌트 언마운트 시 정리
    return () => {
      newSynth.dispose();
    };
  }, [Tone, isClient]);

  // 키보드 이벤트 리스너 설정
  useEffect(() => {
    if (!synth) return;
    
    // 키보드 매핑
    const keyboardMap: Record<string, {string: number, fret: number}> = {
      // 1번줄 (가장 낮은 E현)
      'z': {string: 0, fret: 0},
      'x': {string: 0, fret: 1},
      'c': {string: 0, fret: 2},
      'v': {string: 0, fret: 3},
      
      // 2번줄 (A현)
      'a': {string: 1, fret: 0},
      's': {string: 1, fret: 1},
      'd': {string: 1, fret: 2},
      'f': {string: 1, fret: 3},
      
      // 3번줄 (D현)
      'q': {string: 2, fret: 0},
      'w': {string: 2, fret: 1},
      'e': {string: 2, fret: 2},
      'r': {string: 2, fret: 3},
      
      // 4번줄 (G현)
      '1': {string: 3, fret: 0},
      '2': {string: 3, fret: 1},
      '3': {string: 3, fret: 2},
      '4': {string: 3, fret: 3},
      
      // 5번줄 (B현)
      '5': {string: 4, fret: 0},
      '6': {string: 4, fret: 1},
      '7': {string: 4, fret: 2},
      '8': {string: 4, fret: 3},
      
      // 6번줄 (가장 높은 E현)
      '9': {string: 5, fret: 0},
      '0': {string: 5, fret: 1},
      '-': {string: 5, fret: 2},
      '=': {string: 5, fret: 3},
    };

    // 키다운 핸들러
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // 키 반복 방지
      const key = e.key.toLowerCase();
      
      if (keyboardMap[key]) {
        const { string, fret } = keyboardMap[key];
        const note = calculateNote(string, fret);
        
        playNote(note);
      }
    };

    // 키업 핸들러
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (keyboardMap[key]) {
        const { string, fret } = keyboardMap[key];
        const note = calculateNote(string, fret);
        
        stopNote(note);
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 정리 함수
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onNoteOn, onNoteOff, synth]);

  // 마우스 이벤트 리스너
  useEffect(() => {
    const handleMouseUp = () => {
      mouseIsDownRef.current = false;
      lastStringRef.current = null;
    };

    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // 노트 계산 함수
  const calculateNote = (stringIndex: number, fretNumber: number): string => {
    // 기본 튜닝 배열 (역순으로 - 가장 낮은 현부터)
    const openStringNotes = [...STANDARD_TUNING].slice(0, strings);
    
    if (stringIndex >= openStringNotes.length) {
      return '';
    }
    
    // 현의 개방 음 (open string note)
    const openNote = openStringNotes[stringIndex];
    const noteBase = openNote.slice(0, -1); // 노트 이름 (예: 'E')
    const octave = parseInt(openNote.slice(-1)); // 옥타브 번호
    
    // 음계 순서 (반음 기준)
    const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // 개방 음의 인덱스 찾기
    const baseNoteIndex = noteOrder.findIndex(note => note === noteBase);
    if (baseNoteIndex === -1) return '';
    
    // 프렛 위치에 따른 새로운 노트 계산 (반음 간격)
    const newNoteIndex = (baseNoteIndex + fretNumber) % 12;
    let newOctave = octave + Math.floor((baseNoteIndex + fretNumber) / 12);
    
    return `${noteOrder[newNoteIndex]}${newOctave}`;
  };

  // 음 재생
  const playNote = (note: string) => {
    if (!synth || activeNotes.has(note)) return;
    
    // 액티브 노트 상태 업데이트
    setActiveNotes(prev => {
      const newSet = new Set(prev);
      newSet.add(note);
      return newSet;
    });
    
    // 소리 재생
    synth.triggerAttack(note);
    
    // 노트 이벤트 콜백
    if (onNoteOn) {
      onNoteOn(note);
    }
  };

  // 음 중단
  const stopNote = (note: string) => {
    if (!synth || !activeNotes.has(note)) return;
    
    // 액티브 노트 상태 업데이트
    setActiveNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
    
    // 소리 정지
    synth.triggerRelease(note);
    
    // 노트 이벤트 콜백
    if (onNoteOff) {
      onNoteOff(note);
    }
  };

  // 마우스/터치 이벤트 핸들러
  const handleFretMouseDown = (stringIndex: number, fretNumber: number) => {
    mouseIsDownRef.current = true;
    lastStringRef.current = stringIndex;
    const note = calculateNote(stringIndex, fretNumber);
    if (note) playNote(note);
  };

  const handleFretMouseOver = (stringIndex: number, fretNumber: number) => {
    if (mouseIsDownRef.current) {
      const note = calculateNote(stringIndex, fretNumber);
      if (note) playNote(note);
      
      // 다른 현으로 넘어갔을 때 이전 현의 모든 활성 노트 중지
      if (lastStringRef.current !== null && lastStringRef.current !== stringIndex) {
        lastStringRef.current = stringIndex;
      }
    }
  };

  // 현과 프렛 렌더링
  const renderFretboard = () => {
    const fretboard = [];
    
    // 현 반복
    for (let i = strings - 1; i >= 0; i--) { // 가장 높은 현부터 렌더링
      const string = [];
      const openNote = calculateNote(i, 0);
      
      // 프렛 마크 위치 (기타 일반적인 프렛 마크 위치)
      const fretMarkerPositions = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
      
      // 개방현
      string.push(
        <div 
          key={`open-${i}`} 
          className="open-string flex flex-col items-center justify-center h-8 w-12 border-r border-gray-300"
          onMouseDown={() => handleFretMouseDown(i, 0)}
          onMouseOver={() => handleFretMouseOver(i, 0)}
        >
          <span className="text-xs font-medium">{openNote.slice(0, -1)}</span>
        </div>
      );
      
      // 프렛
      for (let j = 1; j <= frets; j++) {
        const note = calculateNote(i, j);
        const isActive = activeNotes.has(note);
        const showMarker = i === Math.floor(strings / 2) - 1 && fretMarkerPositions.includes(j);
        
        string.push(
          <div 
            key={`fret-${i}-${j}`} 
            className={`fret flex items-center justify-center 
                      h-8 w-10 border-r border-gray-300 relative 
                      ${isActive ? 'bg-blue-500' : 'hover:bg-gray-200'}`}
            onMouseDown={() => handleFretMouseDown(i, j)}
            onMouseOver={() => handleFretMouseOver(i, j)}
          >
            {showMarker && (
              <div className="absolute top-full mt-1 w-2 h-2 rounded-full bg-gray-400"></div>
            )}
            {j === 12 && strings === 6 && i === 2 && (
              <div className="absolute top-full mt-1 flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              </div>
            )}
          </div>
        );
      }
      
      fretboard.push(
        <div key={`string-${i}`} className="flex">
          {string}
        </div>
      );
    }
    
    return fretboard;
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold">가상 기타</h3>
        <div className="controls flex items-center space-x-2">
          {recordMode && (
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 animate-pulse mr-1"></span>
              <span className="text-sm font-medium">녹음 중</span>
            </div>
          )}
        </div>
      </div>
      
      <div 
        ref={guitarRef} 
        className="w-full overflow-x-auto bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-md"
        style={{ touchAction: 'none' }}
      >
        <div className="fretboard min-w-max">
          {renderFretboard()}
        </div>
      </div>
      
      <div className="text-sm text-gray-500 mt-2">
        키보드로 연주: Z-V (1번줄), A-F (2번줄), Q-R (3번줄), 1-4 (4번줄), 5-8 (5번줄), 9-= (6번줄)
      </div>
    </div>
  );
};

export default Guitar;
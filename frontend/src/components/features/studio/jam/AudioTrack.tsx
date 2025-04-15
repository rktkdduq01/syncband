'use client';

import React, { useState } from 'react';

// 실제 구현 시 타입 파일에서 import 해야 함
type Participant = {
  id: string;
  name: string;
  instrument: string;
  isMuted: boolean;
  isConnected: boolean;
  isHost: boolean;
  avatar?: string;
};

interface AudioTrackProps {
  participant: Participant;
  isLocal: boolean;
}

export default function AudioTrack({ participant, isLocal }: AudioTrackProps) {
  // 오디오 트랙 상태
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(participant.isMuted);
  const [pan, setPan] = useState(0); // -100 (좌) ~ 0 (중앙) ~ 100 (우)
  const [isSolo, setIsSolo] = useState(false);
  
  // 악기 아이콘 및 색상 선택
  const getInstrumentStyle = (instrument: string) => {
    switch(instrument.toLowerCase()) {
      case 'guitar':
        return { icon: 'music_note', color: 'bg-blue-500' };
      case 'piano':
        return { icon: 'piano', color: 'bg-purple-500' };
      case 'drums':
        return { icon: 'music_note', color: 'bg-red-500' };
      case 'bass':
        return { icon: 'music_note', color: 'bg-green-500' };
      case 'vocal':
        return { icon: 'mic', color: 'bg-yellow-500' };
      case 'synth':
        return { icon: 'piano', color: 'bg-indigo-500' };
      default:
        return { icon: 'music_note', color: 'bg-gray-500' };
    }
  };
  
  // 악기 이름 한글화
  const getInstrumentName = (instrument: string) => {
    switch (instrument.toLowerCase()) {
      case 'guitar':
        return '기타';
      case 'piano':
        return '피아노';
      case 'drums':
        return '드럼';
      case 'bass':
        return '베이스';
      case 'vocal':
        return '보컬';
      case 'synth':
        return '신디사이저';
      default:
        return instrument;
    }
  };
  
  // 볼륨 변경 핸들러
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    
    // 실제 오디오 노드의 볼륨 변경이 필요함 (WebAudio API 사용)
    console.log(`${participant.name}의 볼륨을 ${newVolume}%로 설정`);
  };
  
  // 음소거 토글
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // 실제 오디오 노드의 음소거 설정이 필요함
    console.log(`${participant.name}의 음소거 상태를 ${newMutedState ? '활성화' : '비활성화'}`);
  };
  
  // 솔로 토글
  const toggleSolo = () => {
    const newSoloState = !isSolo;
    setIsSolo(newSoloState);
    
    // 다른 트랙의 음소거 상태에 영향을 줘야 함
    console.log(`${participant.name}의 솔로 상태를 ${newSoloState ? '활성화' : '비활성화'}`);
  };
  
  // 팬 조절 핸들러
  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPan = parseInt(e.target.value);
    setPan(newPan);
    
    // 실제 오디오 노드의 팬 설정이 필요함 (PannerNode)
    console.log(`${participant.name}의 팬을 ${newPan}로 설정`);
  };
  
  // 음향 효과 선택 (실제 구현 필요)
  const handleEffectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const effect = e.target.value;
    console.log(`${participant.name}에 '${effect}' 효과 적용`);
  };

  const instrumentStyle = getInstrumentStyle(participant.instrument);
  
  return (
    <div className={`border rounded-lg overflow-hidden ${isSolo ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b">
        {/* 악기 아이콘 */}
        <div className={`w-8 h-8 rounded-full ${instrumentStyle.color} text-white flex items-center justify-center`}>
          <span className="material-icons text-sm">{instrumentStyle.icon}</span>
        </div>
        
        {/* 참가자 이름 */}
        <div>
          <h3 className="font-medium text-gray-900">{participant.name} {isLocal && <span className="text-xs text-gray-500">(나)</span>}</h3>
          <p className="text-xs text-gray-500">{getInstrumentName(participant.instrument)}</p>
        </div>
        
        {/* 기본 컨트롤 */}
        <div className="ml-auto flex items-center gap-1">
          <button 
            onClick={toggleMute}
            className={`p-1 rounded ${isMuted ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-500'}`} 
            title={isMuted ? '음소거 해제' : '음소거'}
          >
            <span className="material-icons text-sm">{isMuted ? 'volume_off' : 'volume_up'}</span>
          </button>
          
          <button 
            onClick={toggleSolo}
            className={`p-1 rounded ${isSolo ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-500'}`} 
            title={isSolo ? '솔로 해제' : '솔로'}
          >
            <span className="material-icons text-sm">music_note</span>
          </button>
        </div>
      </div>
      
      {/* 오디오 컨트롤 */}
      <div className="px-4 py-3 space-y-4">
        {/* 볼륨 슬라이더 */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor={`volume-${participant.id}`} className="text-xs font-medium text-gray-700">볼륨</label>
            <span className="text-xs text-gray-500">{volume}%</span>
          </div>
          <input
            id={`volume-${participant.id}`}
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        
        {/* 팬 슬라이더 */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor={`pan-${participant.id}`} className="text-xs font-medium text-gray-700">좌/우 밸런스</label>
            <span className="text-xs text-gray-500">
              {pan < 0 ? `좌 ${Math.abs(pan)}%` : pan > 0 ? `우 ${pan}%` : '중앙'}
            </span>
          </div>
          <input
            id={`pan-${participant.id}`}
            type="range"
            min="-100"
            max="100"
            value={pan}
            onChange={handlePanChange}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        
        {/* 음향 효과 선택 (드롭다운) */}
        <div>
          <label htmlFor={`effect-${participant.id}`} className="block text-xs font-medium text-gray-700 mb-1">음향 효과</label>
          <select
            id={`effect-${participant.id}`}
            onChange={handleEffectChange}
            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="none">효과 없음</option>
            <option value="reverb">리버브</option>
            <option value="chorus">코러스</option>
            <option value="delay">딜레이</option>
            <option value="distortion">디스토션</option>
          </select>
        </div>
        
        {/* 오디오 레벨 미터 */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-700">오디오 레벨</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-lg overflow-hidden">
            <div 
              className={`h-full ${instrumentStyle.color}`}
              style={{ width: `${Math.random() * (isMuted ? 0 : volume)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
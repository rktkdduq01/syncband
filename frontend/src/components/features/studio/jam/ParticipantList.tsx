'use client';

import React from 'react';

// 참가자 타입 정의
type Participant = {
  id: string;
  name: string;
  instrument: string;
  isMuted: boolean;
  isConnected: boolean;
  isHost: boolean;
  avatar?: string;
};

interface ParticipantListProps {
  participants: Participant[];
  currentUserId: string;
}

export default function ParticipantList({ participants, currentUserId }: ParticipantListProps) {
  // 악기 아이콘 매핑
  const getInstrumentIcon = (instrument: string) => {
    switch (instrument.toLowerCase()) {
      case 'guitar':
        return 'music_note';
      case 'piano':
        return 'piano';
      case 'drums':
        return 'music_note';
      case 'bass':
        return 'music_note';
      case 'vocal':
        return 'mic';
      case 'synth':
        return 'piano';
      default:
        return 'music_note';
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

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">참가자 ({participants.length}명)</h2>
      <ul className="space-y-3">
        {participants.map((participant) => {
          const isCurrentUser = participant.id === currentUserId;
          
          return (
            <li 
              key={participant.id}
              className={`flex items-center p-2 rounded-lg ${
                isCurrentUser ? 'bg-primary/5' : 'hover:bg-gray-50'
              }`}
            >
              {/* 사용자 아바타 또는 이니셜 */}
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium shrink-0">
                {participant.avatar ? (
                  <img 
                    src={participant.avatar} 
                    alt={`${participant.name} 프로필 이미지`} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  participant.name.charAt(0).toUpperCase()
                )}
              </div>
              
              {/* 사용자 정보 */}
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {participant.name}
                    {isCurrentUser && <span className="ml-1 text-xs text-gray-500">(나)</span>}
                  </p>
                  {participant.isHost && (
                    <span className="ml-1 bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">
                      방장
                    </span>
                  )}
                </div>
                
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span className="material-icons text-xs mr-1">
                    {getInstrumentIcon(participant.instrument)}
                  </span>
                  <span>{getInstrumentName(participant.instrument)}</span>
                </div>
              </div>
              
              {/* 상태 표시 */}
              <div className="flex items-center gap-2">
                {participant.isMuted ? (
                  <span className="material-icons text-red-500" title="음소거됨">
                    mic_off
                  </span>
                ) : (
                  <span className="material-icons text-green-500" title="활성화됨">
                    mic
                  </span>
                )}
                <div className={`w-2 h-2 rounded-full ${
                  participant.isConnected ? 'bg-green-500' : 'bg-gray-400'
                }`} title={participant.isConnected ? '연결됨' : '연결 끊김'}></div>
              </div>
              
              {/* 추가 메뉴 버튼 (실제 구현 시 기능 추가) */}
              <button className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <span className="material-icons text-lg">more_vert</span>
              </button>
            </li>
          );
        })}
      </ul>
      
      {participants.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          참가자가 없습니다.
        </p>
      )}
    </div>
  );
}
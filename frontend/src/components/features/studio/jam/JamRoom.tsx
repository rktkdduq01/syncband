'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AudioTrack from './AudioTrack';
import ChatPanel from './ChatPanel';
import ParticipantList from './ParticipantList';
import WaveformVisualizer from './WaveformVisualizer';

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

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
};

interface JamRoomProps {
  roomId: string;
  userId: string;
  userName: string;
}

export default function JamRoom({ roomId, userId, userName }: JamRoomProps) {
  // 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [localAudioStream, setLocalAudioStream] = useState<MediaStream | null>(null);
  
  // WebRTC 연결 관리용 refs
  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const router = useRouter();

  // 잼 세션 초기화
  useEffect(() => {
    const initializeJamSession = async () => {
      try {
        setIsLoading(true);
        
        // 1. 오디오 컨텍스트 초기화
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        // 2. 사용자 미디어 장치 접근 요청
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        setLocalAudioStream(stream);
        
        // 3. 웹소켓 연결 설정
        const socket = new WebSocket(`wss://your-api.com/jam/${roomId}`);
        socketRef.current = socket;
        
        // WebSocket 이벤트 핸들러 설정
        socket.onopen = () => {
          // 방 참여 메시지 전송
          socket.send(JSON.stringify({
            type: 'join',
            data: {
              userId,
              userName,
              roomId
            }
          }));
        };
        
        socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          handleSocketMessage(message);
        };
        
        socket.onerror = (error) => {
          console.error('WebSocket 에러:', error);
          alert('서버 연결 중 오류가 발생했습니다.');
        };
        
        socket.onclose = () => {
          console.log('WebSocket 연결이 종료되었습니다.');
        };
        
        // 테스트용 더미 데이터 (실제 구현 시 제거)
        setTimeout(() => {
          setRoomName('즉흥 재즈 세션');
          setParticipants([
            { id: userId, name: userName, instrument: 'guitar', isMuted: false, isConnected: true, isHost: true },
            { id: 'user2', name: '김재즈', instrument: 'piano', isMuted: false, isConnected: true, isHost: false },
            { id: 'user3', name: '박드러머', instrument: 'drums', isMuted: false, isConnected: true, isHost: false },
          ]);
          setSelectedInstrument('guitar');
          setIsLoading(false);
        }, 1500);
        
        // 클린업 함수
        return () => {
          if (socketRef.current) {
            socketRef.current.close();
          }
          
          if (localAudioStream) {
            localAudioStream.getTracks().forEach(track => track.stop());
          }
          
          Object.values(peerConnectionsRef.current).forEach(pc => {
            pc.close();
          });
          
          if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
          }
        };
      } catch (error) {
        console.error('잼 세션 초기화 실패:', error);
        alert('오디오 장치에 접근할 수 없습니다.');
      }
    };
    
    initializeJamSession();
  }, [roomId, userId, userName]);
  
  // WebSocket 메시지 처리
  const handleSocketMessage = (message: any) => {
    switch (message.type) {
      case 'roomData':
        setRoomName(message.data.roomName);
        setParticipants(message.data.participants);
        break;
        
      case 'participantJoined':
        setParticipants(prev => [...prev, message.data.participant]);
        // 새 참가자와의 WebRTC 연결 설정
        setupPeerConnection(message.data.participant.id);
        break;
        
      case 'participantLeft':
        setParticipants(prev => prev.filter(p => p.id !== message.data.participantId));
        // WebRTC 연결 해제
        cleanupPeerConnection(message.data.participantId);
        break;
        
      case 'chat':
        setMessages(prev => [...prev, message.data]);
        break;
        
      case 'offer':
        handleOffer(message.data);
        break;
        
      case 'answer':
        handleAnswer(message.data);
        break;
        
      case 'iceCandidate':
        handleICECandidate(message.data);
        break;
        
      default:
        console.log('알 수 없는 메시지 타입:', message.type);
    }
  };
  
  // WebRTC 관련 함수들
  const setupPeerConnection = (peerId: string) => {
    // RTCPeerConnection 설정 및 ICE 후보자 처리
    console.log(`${peerId}와 연결 설정 중...`);
  };
  
  const cleanupPeerConnection = (peerId: string) => {
    if (peerConnectionsRef.current[peerId]) {
      peerConnectionsRef.current[peerId].close();
      delete peerConnectionsRef.current[peerId];
    }
  };
  
  const handleOffer = (data: any) => {
    // WebRTC offer 처리
    console.log('Offer 수신:', data);
  };
  
  const handleAnswer = (data: any) => {
    // WebRTC answer 처리
    console.log('Answer 수신:', data);
  };
  
  const handleICECandidate = (data: any) => {
    // ICE candidate 처리
    console.log('ICE Candidate 수신:', data);
  };
  
  // 채팅 메시지 전송
  const sendChatMessage = (text: string) => {
    if (!text.trim() || !socketRef.current) return;
    
    const messageData = {
      type: 'chat',
      data: {
        text,
        senderId: userId,
        senderName: userName
      }
    };
    
    socketRef.current.send(JSON.stringify(messageData));
    
    // 로컬 메시지 추가 (실제로는 서버에서 응답을 받아야 함)
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderId: userId,
      senderName: userName,
      text,
      timestamp: new Date()
    }]);
  };
  
  // 방 나가기
  const leaveRoom = () => {
    // 서버에 떠남 알림
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'leave',
        data: { userId, roomId }
      }));
    }
    
    // 메인 페이지로 이동
    router.push('/sync-room');
  };
  
  // 녹음 시작/중지
  const toggleRecording = () => {
    setIsRecording(prev => !prev);
    // 실제 구현 시 녹음 로직 추가
  };
  
  // 악기 변경
  const changeInstrument = (instrument: string) => {
    setSelectedInstrument(instrument);
    // 서버에 악기 변경 알림
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'changeInstrument',
        data: { userId, instrument }
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-700">잼 세션에 연결 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 상단 바 */}
      <div className="bg-white shadow px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">{roomName}</h1>
          <span className="ml-3 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            라이브
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleRecording}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium ${
              isRecording 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
          >
            <span className="material-icons text-sm">
              {isRecording ? 'stop' : 'fiber_manual_record'}
            </span>
            {isRecording ? '녹음 중지' : '녹음 시작'}
          </button>
          
          <button
            onClick={leaveRoom}
            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium transition-colors"
          >
            <span className="material-icons text-sm">logout</span>
            방 나가기
          </button>
        </div>
      </div>
      
      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 오디오 믹서 & 파형 영역 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 파형 시각화 */}
          <div className="h-1/3 bg-gray-800 p-4">
            <WaveformVisualizer />
          </div>
          
          {/* 오디오 트랙 */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">트랙 믹서</h2>
            <div className="space-y-4">
              {participants.map(participant => (
                <AudioTrack
                  key={participant.id}
                  participant={participant}
                  isLocal={participant.id === userId}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* 사이드바 */}
        <div className="w-80 border-l border-gray-200 flex flex-col bg-white overflow-hidden">
          {/* 탭 */}
          <div className="flex border-b border-gray-200">
            <button className="flex-1 py-2 px-4 text-center text-primary font-medium border-b-2 border-primary">
              참가자
            </button>
            <button className="flex-1 py-2 px-4 text-center text-gray-500 hover:text-gray-700">
              채팅
            </button>
          </div>
          
          {/* 악기 선택 */}
          <div className="p-4 border-b border-gray-200">
            <label htmlFor="instrument" className="block text-sm font-medium text-gray-700 mb-1">
              내 악기 선택
            </label>
            <select
              id="instrument"
              value={selectedInstrument}
              onChange={(e) => changeInstrument(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="guitar">기타</option>
              <option value="piano">피아노</option>
              <option value="drums">드럼</option>
              <option value="bass">베이스</option>
              <option value="vocal">보컬</option>
              <option value="synth">신디사이저</option>
            </select>
          </div>
          
          {/* 참가자 목록 */}
          <div className="flex-1 overflow-y-auto p-4">
            <ParticipantList participants={participants} currentUserId={userId} />
          </div>
          
          {/* 채팅 패널 */}
          <div className="border-t border-gray-200 h-1/3">
            <ChatPanel messages={messages} sendMessage={sendChatMessage} currentUserId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}
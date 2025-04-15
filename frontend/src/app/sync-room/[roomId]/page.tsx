'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PeerConnectionManager } from '@/webrtc/peer';
import { SignalingService, User, RoomInfo } from '@/webrtc/signaling';
import { Button } from '@/components/common/Button';
import { SheetViewer } from '@/components/features/sheet-music/SheetViewer';

// 참가자 컴포넌트
const Participant = ({ 
  user, 
  audioRef, 
  isLocal,
  isMuted,
  onMuteToggle,
}: { 
  user: User; 
  audioRef?: React.RefObject<HTMLAudioElement>;
  isLocal: boolean;
  isMuted: boolean;
  onMuteToggle?: () => void;
}) => {
  // 악기 아이콘 매핑
  const getInstrumentIcon = (instrument?: string) => {
    switch(instrument?.toLowerCase()) {
      case 'piano': return 'piano';
      case 'guitar': return 'music_note';
      case 'drums': return 'drums';
      case 'vocal': return 'mic';
      default: return 'music_note';
    }
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <div className={`relative w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 mb-2 ${
        isLocal ? 'ring-2 ring-primary' : ''
      }`}>
        <span className="material-icons text-3xl text-primary">
          {getInstrumentIcon(user.instrument)}
        </span>
        
        {/* 오디오 활성화 표시 (추후 구현) */}
        <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500"></div>
      </div>
      
      <p className="font-medium text-center">{user.name}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{user.instrument || '악기 미선택'}</p>
      
      {isLocal && (
        <button 
          onClick={onMuteToggle}
          className="mt-2 text-gray-600 hover:text-primary"
        >
          <span className="material-icons">
            {isMuted ? 'mic_off' : 'mic'}
          </span>
        </button>
      )}
      
      {!isLocal && audioRef && (
        <audio ref={audioRef} autoPlay playsInline />
      )}
    </div>
  );
};

export default function SyncRoom() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  
  // 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [peerConnections, setPeerConnections] = useState<{[key: string]: PeerConnectionManager}>({});
  const [userName, setUserName] = useState('사용자' + Math.floor(Math.random() * 1000));
  const [selectedInstrument, setSelectedInstrument] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{userId: string; userName: string; message: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  // Audio 엘리먼트 refs
  const audioRefs = useRef<{[key: string]: React.RefObject<HTMLAudioElement>}>({});
  
  // WebRTC 관련 refs
  const signalingRef = useRef<SignalingService | null>(null);
  const localPeerRef = useRef<PeerConnectionManager | null>(null);
  
  // 악기 옵션
  const instrumentOptions = [
    { value: 'piano', label: '피아노' },
    { value: 'guitar', label: '기타' },
    { value: 'drums', label: '드럼' },
    { value: 'vocal', label: '보컬' }
  ];
  
  // 초기화 및 클린업
  useEffect(() => {
    const initializeRoom = async () => {
      try {
        setIsLoading(true);
        
        // 시그널링 서비스 초기화
        const signalingService = new SignalingService('http://localhost:3001', {
          onConnected: () => {
            console.log('시그널링 서버에 연결됨');
          },
          onDisconnected: () => {
            console.log('시그널링 서버 연결 끊김');
            setError('서버 연결이 끊겼습니다. 다시 시도해주세요.');
          },
          onError: (err) => {
            console.error('시그널링 오류:', err);
            setError('연결 중 오류가 발생했습니다.');
          },
          onUserJoined: handleUserJoined,
          onUserLeft: handleUserLeft,
          onOffer: handleOffer,
          onAnswer: handleAnswer,
          onIceCandidate: handleIceCandidate,
          onRoomInfo: (info) => {
            console.log('방 정보 수신:', info);
            setRoomInfo(info);
          },
          onChatMessage: (userId, message) => {
            const userName = roomInfo?.users.find(u => u.id === userId)?.name || '알 수 없음';
            setChatMessages(prev => [...prev, { userId, userName, message }]);
          },
          onInstrumentChanged: (userId, instrument) => {
            setRoomInfo(prev => {
              if (!prev) return prev;
              return {
                ...prev,
                users: prev.users.map(user => 
                  user.id === userId ? { ...user, instrument } : user
                )
              };
            });
          }
        });
        
        signalingRef.current = signalingService;
        
        // 시그널링 서버 연결
        await signalingService.connect();
        
        // 방 참여
        await signalingService.joinRoom(roomId, { 
          name: userName,
          instrument: selectedInstrument 
        });
        
        // 로컬 피어 초기화
        const peerManager = new PeerConnectionManager({
          onConnectionStateChange: (state) => {
            console.log('연결 상태 변경:', state);
          }
        });
        
        // 로컬 스트림 초기화
        await peerManager.initializeLocalStream();
        localPeerRef.current = peerManager;
        
        setIsLoading(false);
      } catch (err) {
        console.error('초기화 오류:', err);
        setError('방에 입장하는 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };
    
    initializeRoom();
    
    // 클린업
    return () => {
      Object.values(peerConnections).forEach(peer => {
        peer.closePeerConnection();
      });
      
      if (localPeerRef.current) {
        localPeerRef.current.closePeerConnection();
      }
      
      if (signalingRef.current) {
        signalingRef.current.leaveRoom();
        signalingRef.current.disconnect();
      }
    };
  }, [roomId, userName]);
  
  // 악기 변경 핸들러
  useEffect(() => {
    if (selectedInstrument && signalingRef.current) {
      signalingRef.current.changeInstrument(selectedInstrument);
    }
  }, [selectedInstrument]);
  
  // 음소거 상태 변경
  useEffect(() => {
    if (localPeerRef.current) {
      localPeerRef.current.setTrackEnabled('audio', !isMuted);
    }
  }, [isMuted]);
  
  // WebRTC 핸들러 함수들
  const handleUserJoined = async (user: User) => {
    console.log('사용자 참가:', user);
    
    if (!localPeerRef.current) return;
    
    // 새 피어 연결 생성
    const peerManager = new PeerConnectionManager({
      onIceCandidate: (candidate) => {
        if (candidate && signalingRef.current) {
          signalingRef.current.sendIceCandidate(user.id, candidate);
        }
      },
      onTrack: (event) => {
        console.log('트랙 수신:', event);
        
        // audio 엘리먼트에 스트림 연결
        if (audioRefs.current[user.id] && audioRefs.current[user.id].current) {
          audioRefs.current[user.id].current!.srcObject = event.streams[0];
        }
      }
    });
    
    // 로컬 스트림 추가
    const localStream = localPeerRef.current.getLocalStream();
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerManager.createPeerConnection().addTrack(track, localStream);
      });
    }
    
    // 오퍼 생성 및 전송
    const offer = await peerManager.createOffer();
    if (signalingRef.current) {
      signalingRef.current.sendOffer(user.id, offer);
    }
    
    // 피어 연결 저장
    setPeerConnections(prev => ({
      ...prev,
      [user.id]: peerManager
    }));
    
    // audio ref 생성
    audioRefs.current[user.id] = React.createRef<HTMLAudioElement>();
  };
  
  const handleUserLeft = (userId: string) => {
    console.log('사용자 퇴장:', userId);
    
    // 피어 연결 종료
    if (peerConnections[userId]) {
      peerConnections[userId].closePeerConnection();
      
      setPeerConnections(prev => {
        const newConnections = { ...prev };
        delete newConnections[userId];
        return newConnections;
      });
    }
    
    // audio ref 제거
    if (audioRefs.current[userId]) {
      delete audioRefs.current[userId];
    }
  };
  
  const handleOffer = async (userId: string, offer: RTCSessionDescriptionInit) => {
    console.log('오퍼 수신:', userId);
    
    if (!localPeerRef.current) return;
    
    // 새 피어 연결 생성
    const peerManager = new PeerConnectionManager({
      onIceCandidate: (candidate) => {
        if (candidate && signalingRef.current) {
          signalingRef.current.sendIceCandidate(userId, candidate);
        }
      },
      onTrack: (event) => {
        console.log('트랙 수신:', event);
        
        // audio 엘리먼트에 스트림 연결
        if (audioRefs.current[userId] && audioRefs.current[userId].current) {
          audioRefs.current[userId].current!.srcObject = event.streams[0];
        }
      }
    });
    
    // 로컬 스트림 추가
    const localStream = localPeerRef.current.getLocalStream();
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerManager.createPeerConnection().addTrack(track, localStream);
      });
    }
    
    // 원격 설명 설정
    await peerManager.setRemoteDescription(offer);
    
    // 응답 생성 및 전송
    const answer = await peerManager.createAnswer();
    if (signalingRef.current) {
      signalingRef.current.sendAnswer(userId, answer);
    }
    
    // 피어 연결 저장
    setPeerConnections(prev => ({
      ...prev,
      [userId]: peerManager
    }));
    
    // audio ref 생성
    audioRefs.current[userId] = React.createRef<HTMLAudioElement>();
  };
  
  const handleAnswer = async (userId: string, answer: RTCSessionDescriptionInit) => {
    console.log('응답 수신:', userId);
    
    // 해당 피어 연결에 원격 설명 설정
    if (peerConnections[userId]) {
      await peerConnections[userId].setRemoteDescription(answer);
    }
  };
  
  const handleIceCandidate = async (userId: string, candidate: RTCIceCandidate) => {
    console.log('ICE 후보 수신:', userId);
    
    // 해당 피어 연결에 ICE 후보 추가
    if (peerConnections[userId]) {
      await peerConnections[userId].addIceCandidate(candidate);
    }
  };
  
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !signalingRef.current) return;
    
    signalingRef.current.sendChatMessage(chatInput);
    setChatMessages(prev => [...prev, { 
      userId: signalingRef.current?.getCurrentUserId() || '', 
      userName: '나', 
      message: chatInput 
    }]);
    setChatInput('');
  };
  
  const handleLeaveRoom = async () => {
    if (signalingRef.current) {
      await signalingRef.current.leaveRoom();
    }
    router.push('/sync-room');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 mb-4" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
          <p className="text-gray-600">싱크룸에 연결 중입니다...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <span className="material-icons text-red-500 text-5xl mb-4">error_outline</span>
          <h2 className="text-2xl font-bold mb-4">오류가 발생했습니다</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Button onClick={() => router.push('/sync-room')}>
            방 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }
  
  // 현재 사용자 ID
  const currentUserId = signalingRef.current?.getCurrentUserId() || '';

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{roomInfo?.name || '싱크룸'}</h1>
            {roomInfo?.songTitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                현재 곡: {roomInfo.songTitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary"
              onClick={() => setShowSettings(!showSettings)}
            >
              <span className="material-icons mr-1">settings</span>
              설정
            </Button>
            
            <Button 
              variant="danger"
              onClick={handleLeaveRoom}
            >
              <span className="material-icons mr-1">exit_to_app</span>
              나가기
            </Button>
          </div>
        </div>
      </header>
      
      {/* 메인 콘텐츠 */}
      <div className="flex-grow container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 악보 및 오디오 컨트롤 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* 악보 뷰어 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex-grow min-h-[400px]">
            <h2 className="text-lg font-semibold mb-4">악보</h2>
            
            {roomInfo?.songId ? (
              <SheetViewer 
                songId={roomInfo.songId}
                instrument={selectedInstrument}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  선택된 곡이 없습니다.
                </p>
              </div>
            )}
          </div>
          
          {/* 오디오 컨트롤 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">오디오 설정</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  악기 선택
                </label>
                <select
                  value={selectedInstrument}
                  onChange={(e) => setSelectedInstrument(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">악기 선택</option>
                  {instrumentOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  variant={isMuted ? 'danger' : 'primary'}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  <span className="material-icons mr-1">
                    {isMuted ? 'mic_off' : 'mic'}
                  </span>
                  {isMuted ? '음소거 해제' : '음소거'}
                </Button>
                
                <div className="text-sm text-gray-600">
                  {isMuted ? '다른 참가자들이 당신의 소리를 들을 수 없습니다.' : '다른 참가자들이 당신의 소리를 들을 수 있습니다.'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 오른쪽: 참가자 목록 및 채팅 */}
        <div className="flex flex-col gap-6">
          {/* 참가자 목록 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">참가자 ({roomInfo?.users.length || 0}명)</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {roomInfo?.users.map(user => (
                <Participant
                  key={user.id}
                  user={user}
                  audioRef={user.id !== currentUserId ? audioRefs.current[user.id] : undefined}
                  isLocal={user.id === currentUserId}
                  isMuted={user.id === currentUserId ? isMuted : false}
                  onMuteToggle={user.id === currentUserId ? () => setIsMuted(!isMuted) : undefined}
                />
              ))}
            </div>
          </div>
          
          {/* 채팅 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex-grow flex flex-col">
            <h2 className="text-lg font-semibold mb-4">채팅</h2>
            
            <div className="flex-grow overflow-y-auto mb-4 space-y-2 min-h-[200px]">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`p-2 rounded-lg max-w-[85%] ${
                    msg.userId === currentUserId 
                      ? 'bg-primary/10 ml-auto' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <p className="text-xs font-medium mb-1">
                    {msg.userId === currentUserId ? '나' : msg.userName}
                  </p>
                  <p>{msg.message}</p>
                </div>
              ))}
              
              {chatMessages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">채팅 메시지가 없습니다.</p>
                </div>
              )}
            </div>
            
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="메시지 입력..."
              />
              <Button type="submit" disabled={!chatInput.trim()}>
                <span className="material-icons">send</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      {/* 설정 모달 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">설정</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                이름 변경
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="표시할 이름 입력"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary"
                onClick={() => setShowSettings(false)}
              >
                취소
              </Button>
              <Button onClick={() => setShowSettings(false)}>
                적용
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
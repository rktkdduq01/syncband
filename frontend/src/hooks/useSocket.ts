import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// 환경 변수에서 API URL을 가져오거나 기본 URL을 사용
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * 소켓 연결을 관리하는 훅
 * @param roomId 연결할 방 ID
 * @returns 소켓 객체와 연결 상태
 */
const useSocket = (roomId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 방 ID가 없으면 연결하지 않음
    if (!roomId) return;

    // 소켓 연결 생성
    const socketInstance = io(`${API_URL}/jam-sessions`, {
      query: { roomId },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // 소켓 이벤트 리스너 설정
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
      
      // 방에 입장
      socketInstance.emit('join-room', { roomId });
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    // 상태 업데이트
    setSocket(socketInstance);

    // 컴포넌트 언마운트 시 소켓 연결 정리
    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [roomId]);

  return { socket, isConnected };
};

export default useSocket;
import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Participant } from '@/types/studio';

/**
 * 잼 세션 방의 상태를 관리하는 훅
 */
const useRoomState = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localParticipant, setLocalParticipant] = useState<Participant | null>(null);
  const { data: session } = useSession();

  // 로컬 참가자 초기화
  useEffect(() => {
    if (session?.user) {
      const local: Participant = {
        id: session.user.email as string, // id 대신 email을 식별자로 사용
        name: session.user.name as string || '익명',
        instrument: '',
        isMuted: false,
        isRecording: false,
        isLocal: true
      };
      setLocalParticipant(local);
    }
  }, [session]);

  // 참가자 추가
  const addParticipant = useCallback((participant: Participant) => {
    setParticipants((prev: Participant[]) => {
      // 이미 존재하면 업데이트
      if (prev.some(p => p.id === participant.id)) {
        return prev.map(p => p.id === participant.id ? { ...p, ...participant } : p);
      }
      // 없으면 추가
      return [...prev, participant];
    });
  }, []);

  // 참가자 제거
  const removeParticipant = useCallback((participantId: string) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));
  }, []);

  // 참가자 업데이트
  const updateParticipant = useCallback((participantId: string, updates: Partial<Participant>) => {
    setParticipants((prev: Participant[]) => 
      prev.map(p => p.id === participantId ? { ...p, ...updates } : p)
    );
    
    // 로컬 참가자면 로컬 상태도 업데이트
    if (localParticipant && participantId === localParticipant.id) {
      setLocalParticipant(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [localParticipant]);

  // 로컬 참가자 업데이트
  const updateLocalParticipant = useCallback((updates: Partial<Participant>) => {
    if (!localParticipant) return;
    
    setLocalParticipant(prev => prev ? { ...prev, ...updates } : null);
    
    // 참가자 목록에서도 로컬 참가자 업데이트
    setParticipants((prev: Participant[]) => 
      prev.map(p => p.id === localParticipant.id ? { ...p, ...updates } : p)
    );
  }, [localParticipant]);

  return {
    participants,
    localParticipant,
    addParticipant,
    removeParticipant,
    updateParticipant,
    updateLocalParticipant
  };
};

export default useRoomState;
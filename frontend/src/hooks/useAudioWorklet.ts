import { useState, useEffect, useRef, useCallback } from 'react';

interface AudioWorkletHookOptions {
  processorName: string;
  processorUrl: string;
  onVolumeChange?: (volume: number) => void;
  audioContextOptions?: AudioContextOptions;
  latencyHint?: AudioContextLatencyCategory | number;
}

interface UseAudioWorkletReturn {
  audioContext: AudioContext | null;
  workletNode: AudioWorkletNode | null;
  isLoaded: boolean;
  error: Error | null;
  setVolume: (volume: number) => void;
  setSmoothing: (smoothing: number) => void;
  connect: (sourceNode: AudioNode) => void;
  disconnect: () => void;
  resume: () => Promise<void>;
  suspend: () => Promise<void>;
}

/**
 * 오디오 워크렛을 쉽게 사용할 수 있는 React 훅 (성능 최적화 버전)
 * 
 * @param options 워크렛 프로세서 설정 옵션
 * @returns 오디오 워크렛 상태와 제어 함수들
 */
export function useAudioWorklet(
  options: AudioWorkletHookOptions
): UseAudioWorkletReturn {
  const { 
    processorName, 
    processorUrl, 
    onVolumeChange,
    audioContextOptions = {},
    latencyHint = 'interactive' 
  } = options;
  
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [workletNode, setWorkletNode] = useState<AudioWorkletNode | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const connectedNodeRef = useRef<AudioNode | null>(null);
  const volumeCallbackRef = useRef(onVolumeChange);
  
  // 콜백 참조 업데이트 (불필요한 재렌더링 방지)
  useEffect(() => {
    volumeCallbackRef.current = onVolumeChange;
  }, [onVolumeChange]);

  // AudioContext 및 워크렛 초기화
  useEffect(() => {
    // 이미 생성된 컨텍스트가 있는지 확인
    if (audioContext && workletNode) return;
    
    let ctx: AudioContext | null = null;
    let node: AudioWorkletNode | null = null;
    let isMounted = true; // 언마운트 추적

    const initAudioWorklet = async () => {
      try {
        // 저지연 오디오 처리를 위한 설정
        ctx = new AudioContext({
          ...audioContextOptions,
          latencyHint,
          sampleRate: 48000, // 전문 오디오 처리를 위한 높은 샘플레이트
        });
        
        // 워크렛 모듈 로드 (한 번만)
        await ctx.audioWorklet.addModule(processorUrl);
        
        // 언마운트되었는지 확인
        if (!isMounted) return;
        
        // 워크렛 노드 생성 (고성능 옵션 적용)
        node = new AudioWorkletNode(ctx, processorName, {
          numberOfInputs: 1,
          numberOfOutputs: 1,
          outputChannelCount: [2], // 스테레오 출력
          processorOptions: {
            initialVolume: 1.0,
            initialSmoothing: 0.8
          }
        });
        
        // 볼륨 변경 이벤트 리스너 설정 (최적화 버전)
        node.port.onmessage = (event) => {
          if (event.data && typeof event.data.volume === 'number' && volumeCallbackRef.current) {
            // 현재 콜백 참조 사용
            volumeCallbackRef.current(event.data.volume);
          }
        };
        
        // 노드를 출력으로 연결
        node.connect(ctx.destination);
        
        if (isMounted) {
          setAudioContext(ctx);
          setWorkletNode(node);
          setIsLoaded(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('워크렛 초기화 실패'));
          console.error('오디오 워크렛 초기화 오류:', err);
        }
      }
    };

    initAudioWorklet();

    // 정리 함수
    return () => {
      isMounted = false;
      
      if (node) {
        node.disconnect();
      }
      
      if (ctx) {
        ctx.close().catch(console.error);
      }
    };
  }, [processorName, processorUrl, latencyHint, audioContextOptions]);

  // 볼륨 설정 함수 (메모이제이션)
  const setVolume = useCallback((volume: number) => {
    if (workletNode) {
      workletNode.port.postMessage({ volume });
    }
  }, [workletNode]);

  // 스무딩 설정 함수 (메모이제이션)
  const setSmoothing = useCallback((smoothing: number) => {
    if (workletNode) {
      workletNode.port.postMessage({ smoothing });
    }
  }, [workletNode]);

  // 오디오 소스 노드와 연결 (메모이제이션)
  const connect = useCallback((sourceNode: AudioNode) => {
    if (!workletNode || !audioContext) return;
    
    // 기존 연결 해제
    if (connectedNodeRef.current) {
      connectedNodeRef.current.disconnect(workletNode);
    }
    
    // 새 노드 연결
    sourceNode.connect(workletNode);
    connectedNodeRef.current = sourceNode;
  }, [workletNode, audioContext]);

  // 연결 해제 (메모이제이션)
  const disconnect = useCallback(() => {
    if (!workletNode || !connectedNodeRef.current) return;
    
    connectedNodeRef.current.disconnect(workletNode);
    connectedNodeRef.current = null;
  }, [workletNode]);

  // AudioContext 재개 (메모이제이션)
  const resume = useCallback(async () => {
    if (audioContext && audioContext.state !== 'running') {
      await audioContext.resume();
    }
  }, [audioContext]);

  // AudioContext 일시 중지 (메모이제이션)
  const suspend = useCallback(async () => {
    if (audioContext && audioContext.state === 'running') {
      await audioContext.suspend();
    }
  }, [audioContext]);

  return {
    audioContext,
    workletNode,
    isLoaded,
    error,
    setVolume,
    setSmoothing,
    connect,
    disconnect,
    resume,
    suspend
  };
}
import { useState, useEffect, useRef } from 'react';

interface AudioDevice {
  deviceId: string;
  label: string;
}

/**
 * 오디오 컨텍스트와 오디오 장치를 관리하는 훅
 * @returns 오디오 컨텍스트와 장치 목록
 */
const useAudioContext = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioInputDevices, setAudioInputDevices] = useState<AudioDevice[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<AudioDevice[]>([]);
  const isInitialized = useRef(false);

  // 오디오 컨텍스트 초기화
  useEffect(() => {
    if (isInitialized.current) return;

    try {
      // AudioContext 생성
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
      isInitialized.current = true;

      // AudioContext 상태 관리
      const handleStateChange = () => {
        console.log('AudioContext state:', ctx.state);
      };

      ctx.addEventListener('statechange', handleStateChange);

      // 사용 가능한 오디오 장치 목록 가져오기
      const getDevices = async () => {
        try {
          // 미디어 권한 요청
          await navigator.mediaDevices.getUserMedia({ audio: true });
          
          // 장치 목록 조회
          const devices = await navigator.mediaDevices.enumerateDevices();
          
          // 입력 장치(마이크) 필터링
          const inputDevices = devices
            .filter(device => device.kind === 'audioinput')
            .map(device => ({
              deviceId: device.deviceId,
              label: device.label || `마이크 ${device.deviceId.substring(0, 5)}`
            }));
          
          // 출력 장치(스피커) 필터링
          const outputDevices = devices
            .filter(device => device.kind === 'audiooutput')
            .map(device => ({
              deviceId: device.deviceId,
              label: device.label || `스피커 ${device.deviceId.substring(0, 5)}`
            }));
          
          setAudioInputDevices(inputDevices);
          setAudioOutputDevices(outputDevices);
        } catch (error) {
          console.error('Error accessing media devices:', error);
        }
      };

      getDevices();

      // 새 장치 연결 시 목록 업데이트
      navigator.mediaDevices.addEventListener('devicechange', getDevices);

      // 정리 함수
      return () => {
        ctx.removeEventListener('statechange', handleStateChange);
        navigator.mediaDevices.removeEventListener('devicechange', getDevices);
        ctx.close().catch(console.error);
      };
    } catch (error) {
      console.error('AudioContext not supported or permission denied:', error);
      return undefined;
    }
  }, []);

  return {
    audioContext,
    audioInputDevices,
    audioOutputDevices,
  };
};

export default useAudioContext;
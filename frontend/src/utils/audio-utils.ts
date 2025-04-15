/**
 * 오디오 관련 유틸리티 함수
 */

/**
 * 오디오 컨텍스트를 생성합니다.
 */
export const createAudioContext = (): AudioContext => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

/**
 * 오디오 버퍼를 디코딩합니다.
 */
export const decodeAudioData = async (
  audioContext: AudioContext,
  arrayBuffer: ArrayBuffer
): Promise<AudioBuffer> => {
  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(arrayBuffer, resolve, reject);
  });
};

/**
 * 오디오 파일을 로드하고 오디오 버퍼를 반환합니다.
 */
export const loadAudioFile = async (
  audioContext: AudioContext,
  url: string
): Promise<AudioBuffer> => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await decodeAudioData(audioContext, arrayBuffer);
};

/**
 * 오디오 노드를 생성하고 소스에 연결합니다.
 */
export const createAudioNode = (
  audioContext: AudioContext,
  buffer: AudioBuffer
): AudioBufferSourceNode => {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  return source;
};

/**
 * 게인 노드를 생성합니다.
 */
export const createGainNode = (
  audioContext: AudioContext,
  gainValue: number = 1
): GainNode => {
  const gainNode = audioContext.createGain();
  gainNode.gain.value = gainValue;
  return gainNode;
};

/**
 * 볼륨 레벨(0-100)을 게인 값(0-1)으로 변환합니다.
 */
export const volumeToGain = (volume: number): number => {
  return Math.max(0, Math.min(1, volume / 100));
};

/**
 * 게인 값(0-1)을 볼륨 레벨(0-100)로 변환합니다.
 */
export const gainToVolume = (gain: number): number => {
  return Math.round(Math.max(0, Math.min(1, gain)) * 100);
};

/**
 * 볼륨을 조절합니다.
 */
export const setVolume = (gainNode: GainNode, volume: number): void => {
  gainNode.gain.value = volumeToGain(volume);
};

/**
 * 오디오 파일의 지속 시간을 계산합니다.
 */
export const calculateAudioDuration = (audioBuffer: AudioBuffer): string => {
  const totalSeconds = Math.floor(audioBuffer.duration);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * 초 단위의 시간을 분:초 형식으로 변환합니다.
 */
export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * 주파수 데이터 분석기를 생성합니다.
 */
export const createAnalyser = (
  audioContext: AudioContext,
  fftSize: number = 2048
): AnalyserNode => {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = fftSize;
  return analyser;
};

/**
 * 오디오 데이터를 시각화할 수 있는 파형 데이터를 가져옵니다.
 */
export const getWaveformData = (analyser: AnalyserNode): Uint8Array => {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteTimeDomainData(dataArray);
  return dataArray;
};

/**
 * 오디오 데이터를 시각화할 수 있는 주파수 데이터를 가져옵니다.
 */
export const getFrequencyData = (analyser: AnalyserNode): Uint8Array => {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  return dataArray;
};

/**
 * 오디오 워크렛을 등록합니다.
 */
export const registerAudioWorklet = async (
  audioContext: AudioContext,
  processorUrl: string
): Promise<void> => {
  try {
    await audioContext.audioWorklet.addModule(processorUrl);
  } catch (error) {
    console.error('Error registering audio worklet:', error);
    throw error;
  }
};

/**
 * 간단한 오실레이터를 생성합니다.
 */
export const createOscillator = (
  audioContext: AudioContext,
  type: OscillatorType = 'sine',
  frequency: number = 440
): OscillatorNode => {
  const oscillator = audioContext.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  return oscillator;
};

/**
 * 녹음기를 생성합니다.
 */
export const createRecorder = async (): Promise<MediaStream> => {
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error) {
    console.error('마이크 접근 권한을 얻지 못했습니다:', error);
    throw error;
  }
};

/**
 * 마이크 입력을 오디오 컨텍스트에 연결합니다.
 */
export const connectMicrophoneToAudioContext = (
  audioContext: AudioContext,
  stream: MediaStream
): MediaStreamAudioSourceNode => {
  const source = audioContext.createMediaStreamSource(stream);
  return source;
};

/**
 * 피치 감지 (기본 알고리즘)
 */
export const detectPitch = (
  audioBuffer: AudioBuffer,
  sampleRate: number = 44100
): number => {
  // 간단한 자기 상관(autocorrelation) 기반 피치 감지
  const buffer = audioBuffer.getChannelData(0);
  const bufferLength = buffer.length;
  
  // 임계값과 결과 변수
  let threshold = 0.2;
  let r1 = 0, r2 = bufferLength - 1;
  
  // 신호의 에너지 레벨 계산
  for (let i = 0; i < bufferLength; i++) {
    if (Math.abs(buffer[i]) > threshold) {
      r1 = i;
      break;
    }
  }
  
  for (let i = bufferLength - 1; i >= 0; i--) {
    if (Math.abs(buffer[i]) > threshold) {
      r2 = i;
      break;
    }
  }
  
  // 자기 상관 함수 계산
  const correlationLength = r2 - r1;
  let bestOffset = -1;
  let bestCorrelation = 0;
  
  for (let offset = 0; offset < correlationLength; offset++) {
    let correlation = 0;
    
    for (let i = 0; i < correlationLength; i++) {
      correlation += Math.abs(buffer[i + r1] - buffer[i + r1 + offset]);
    }
    
    correlation = 1 - (correlation / correlationLength);
    
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }
  
  if (bestCorrelation > 0.9 && bestOffset > 0) {
    return sampleRate / bestOffset;
  }
  
  return -1; // 피치를 감지할 수 없음
};

/**
 * 오디오 데이터의 RMS(Root Mean Square) 값을 계산합니다.
 */
export const calculateRMS = (buffer: Float32Array): number => {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
};

/**
 * 주파수를 MIDI 노트 번호로 변환합니다.
 */
export const frequencyToMIDI = (frequency: number): number => {
  return Math.round(12 * Math.log2(frequency / 440) + 69);
};

/**
 * MIDI 노트 번호를 주파수로 변환합니다.
 */
export const MIDIToFrequency = (midiNote: number): number => {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
};

/**
 * MIDI 노트 번호를 노트 이름으로 변환합니다.
 */
export const MIDIToNoteName = (midiNote: number): string => {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midiNote / 12) - 1;
  const noteIndex = midiNote % 12;
  return `${noteNames[noteIndex]}${octave}`;
};

/**
 * 오디오 버퍼를 정규화합니다. (최대 진폭을 1로 조정)
 */
export const normalizeAudioBuffer = (audioBuffer: AudioBuffer): AudioBuffer => {
  const channelCount = audioBuffer.numberOfChannels;
  const bufferLength = audioBuffer.length;
  const newBuffer = new AudioContext().createBuffer(
    channelCount,
    bufferLength,
    audioBuffer.sampleRate
  );
  
  let max = 0;
  
  // 최대 진폭 찾기
  for (let channel = 0; channel < channelCount; channel++) {
    const data = audioBuffer.getChannelData(channel);
    for (let i = 0; i < bufferLength; i++) {
      const absValue = Math.abs(data[i]);
      if (absValue > max) {
        max = absValue;
      }
    }
  }
  
  // 정규화
  const scale = max > 0 ? 1 / max : 1;
  for (let channel = 0; channel < channelCount; channel++) {
    const data = audioBuffer.getChannelData(channel);
    const newData = newBuffer.getChannelData(channel);
    for (let i = 0; i < bufferLength; i++) {
      newData[i] = data[i] * scale;
    }
  }
  
  return newBuffer;
};

/**
 * WebRTC로 오디오 스트림을 보냅니다.
 */
export const addAudioTrackToConnection = (
  peerConnection: RTCPeerConnection, 
  stream: MediaStream
): void => {
  const tracks = stream.getAudioTracks();
  tracks.forEach(track => {
    peerConnection.addTrack(track, stream);
  });
};

/**
 * 오디오 스트림의 상태를 토글합니다. (음소거/음소거 해제)
 */
export const toggleAudioMute = (stream: MediaStream): boolean => {
  const audioTracks = stream.getAudioTracks();
  const enabled = !audioTracks[0]?.enabled;
  
  audioTracks.forEach(track => {
    track.enabled = enabled;
  });
  
  return enabled;
};
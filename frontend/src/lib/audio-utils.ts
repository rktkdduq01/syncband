/**
 * 오디오 처리 관련 유틸리티 함수들
 */

/**
 * 초 단위를 시:분:초 형식으로 변환
 */
export function formatAudioTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  
  if (hours > 0) {
    parts.push(String(hours).padStart(2, '0'));
  }
  
  parts.push(String(minutes).padStart(hours > 0 ? 2 : 1, '0'));
  parts.push(String(secs).padStart(2, '0'));
  
  return parts.join(':');
}

/**
 * 음악 노트의 MIDI 번호를 주파수로 변환
 */
export function midiNoteToFrequency(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

/**
 * 주파수를 가장 가까운 음악 노트 이름으로 변환
 */
export function frequencyToNoteName(frequency: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const midiNote = Math.round(12 * Math.log2(frequency / 440) + 69);
  const octave = Math.floor(midiNote / 12 - 1);
  const noteIndex = midiNote % 12;
  return `${noteNames[noteIndex]}${octave}`;
}

/**
 * 데시벨(dB)을 선형 값으로 변환
 */
export function dbToLinear(db: number): number {
  return Math.pow(10, db / 20);
}

/**
 * 선형 값을 데시벨(dB)로 변환
 */
export function linearToDb(linear: number): number {
  return 20 * Math.log10(linear);
}

/**
 * 오디오 파일에서 파형 데이터 추출하기
 */
export async function extractWaveform(
  audioContext: AudioContext,
  audioUrl: string,
  numPoints = 100
): Promise<number[]> {
  try {
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const channelData = audioBuffer.getChannelData(0); // 모노 또는 첫번째 채널 사용
    const blockSize = Math.floor(channelData.length / numPoints);
    const waveform: number[] = [];
    
    for (let i = 0; i < numPoints; i++) {
      const blockStart = blockSize * i;
      let sum = 0;
      
      // 블록 내의 샘플 평균 계산
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[blockStart + j]);
      }
      
      waveform.push(sum / blockSize);
    }
    
    return waveform;
  } catch (error) {
    console.error('파형 추출 오류:', error);
    return Array(numPoints).fill(0);
  }
}

/**
 * 오디오 파일 길이 가져오기
 */
export async function getAudioDuration(audioContext: AudioContext, audioUrl: string): Promise<number> {
  try {
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer.duration;
  } catch (error) {
    console.error('오디오 길이 가져오기 오류:', error);
    return 0;
  }
}

/**
 * 오디오 버퍼를 WAV 형식으로 변환
 */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChannels = buffer.numberOfChannels;
  const length = buffer.length * numOfChannels * 2 + 44;
  const arrayBuffer = new ArrayBuffer(length);
  const view = new DataView(arrayBuffer);
  
  // WAV 헤더 작성
  writeString(view, 0, 'RIFF');
  view.setUint32(4, length - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numOfChannels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * 2 * numOfChannels, true);
  view.setUint16(32, numOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, length - 44, true);
  
  // 샘플 데이터 작성
  const channelData = [];
  let offset = 44;
  
  for (let i = 0; i < numOfChannels; i++) {
    channelData.push(buffer.getChannelData(i));
  }
  
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' });
  
  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

/**
 * 오디오 전기적 노이즈 생성 (화이트 노이즈)
 */
export function createWhiteNoise(audioContext: AudioContext, duration = 1): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  return buffer;
}

/**
 * 메트로놈 클릭 사운드 생성
 */
export function createMetronomeClick(audioContext: AudioContext, frequency = 1000, duration = 0.05): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-10 * t);
  }
  
  return buffer;
}
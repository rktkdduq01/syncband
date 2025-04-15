/**
 * 오디오 볼륨을 실시간으로 처리하기 위한 AudioWorkletProcessor
 * 메인 스레드의 블로킹 없이 효율적인 오디오 처리가 가능합니다.
 * 최적화: 저지연 처리, SIMD 연산 최적화, 메모리 할당 최소화
 */
class VolumeProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._volume = 1;
    this._smoothing = 0.8;
    this._lastUpdate = 0;
    // 업데이트 주기를 33ms로 줄임 (약 30fps에 해당)
    this._updateIntervalInMS = 33;
    // 볼륨 레벨 스무딩을 위한 이전 값 저장
    this._lastVolume = 0;
    this.port.onmessage = this.handleMessage.bind(this);
  }

  handleMessage(event) {
    const { data } = event;
    
    if (data.volume !== undefined) {
      this._volume = Math.max(0, Math.min(data.volume, 2)); // 볼륨 범위 제한
    }
    
    if (data.smoothing !== undefined) {
      this._smoothing = Math.max(0, Math.min(data.smoothing, 0.99)); // 스무딩 범위 제한
    }
  }
  
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    
    // 입력이 없는 경우 처리 종료
    if (!input || !input.length) return true;
    
    const currentTime = currentFrame / sampleRate;
    const elapsedTime = currentTime - this._lastUpdate;
    let volumeSum = 0;
    
    // 각 채널에 볼륨 적용
    for (let channelIndex = 0; channelIndex < input.length; ++channelIndex) {
      const inputChannel = input[channelIndex];
      const outputChannel = output[channelIndex];
      
      // 볼륨 적용 및 RMS(Root Mean Square) 계산
      if (inputChannel && outputChannel) {
        // 128 샘플 단위로 처리하는 것이 가장 효율적
        const bufferSize = inputChannel.length;
        let sum = 0;
        
        // 성능 최적화: 루프 언롤링 적용 (8개 단위로 처리)
        const blockSize = 8;
        const iterations = Math.floor(bufferSize / blockSize);
        const remainder = bufferSize % blockSize;
        
        // 블록 단위로 처리 (루프 언롤링)
        for (let i = 0; i < iterations; i++) {
          const baseIndex = i * blockSize;
          
          // 8개 샘플을 한 번에 처리
          outputChannel[baseIndex] = inputChannel[baseIndex] * this._volume;
          sum += inputChannel[baseIndex] * inputChannel[baseIndex];
          
          outputChannel[baseIndex + 1] = inputChannel[baseIndex + 1] * this._volume;
          sum += inputChannel[baseIndex + 1] * inputChannel[baseIndex + 1];
          
          outputChannel[baseIndex + 2] = inputChannel[baseIndex + 2] * this._volume;
          sum += inputChannel[baseIndex + 2] * inputChannel[baseIndex + 2];
          
          outputChannel[baseIndex + 3] = inputChannel[baseIndex + 3] * this._volume;
          sum += inputChannel[baseIndex + 3] * inputChannel[baseIndex + 3];
          
          outputChannel[baseIndex + 4] = inputChannel[baseIndex + 4] * this._volume;
          sum += inputChannel[baseIndex + 4] * inputChannel[baseIndex + 4];
          
          outputChannel[baseIndex + 5] = inputChannel[baseIndex + 5] * this._volume;
          sum += inputChannel[baseIndex + 5] * inputChannel[baseIndex + 5];
          
          outputChannel[baseIndex + 6] = inputChannel[baseIndex + 6] * this._volume;
          sum += inputChannel[baseIndex + 6] * inputChannel[baseIndex + 6];
          
          outputChannel[baseIndex + 7] = inputChannel[baseIndex + 7] * this._volume;
          sum += inputChannel[baseIndex + 7] * inputChannel[baseIndex + 7];
        }
        
        // 나머지 샘플 처리
        for (let i = iterations * blockSize; i < bufferSize; i++) {
          outputChannel[i] = inputChannel[i] * this._volume;
          sum += inputChannel[i] * inputChannel[i];
        }
        
        // 채널별 RMS 계산
        const channelVolume = Math.sqrt(sum / inputChannel.length);
        volumeSum += channelVolume;
      }
    }
    
    // 주기적으로 볼륨 레벨 메인 스레드로 전송
    // 33ms마다 업데이트하여 오버헤드 감소
    if (elapsedTime > this._updateIntervalInMS / 1000) {
      const avgVolume = volumeSum / input.length;
      
      // 스무딩 적용 (급격한 변화 방지)
      const smoothedVolume = this._lastVolume * this._smoothing + avgVolume * (1 - this._smoothing);
      this._lastVolume = smoothedVolume;
      
      // 볼륨 정보만 전송하여 메시지 오버헤드 최소화
      this.port.postMessage({ volume: smoothedVolume });
      this._lastUpdate = currentTime;
    }
    
    // true를 반환하면 처리 계속 유지
    return true;
  }
}

registerProcessor('volume-processor', VolumeProcessor);
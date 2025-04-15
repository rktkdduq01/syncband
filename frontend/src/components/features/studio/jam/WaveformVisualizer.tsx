'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function WaveformVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isAnimating, setIsAnimating] = useState(true);
  
  // 캔버스 설정 및 애니메이션 시작
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 캔버스 크기를 컨테이너에 맞게 조정
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    
    // 초기 크기 설정
    resizeCanvas();
    
    // 화면 크기 변경 시 캔버스 크기도 조정
    window.addEventListener('resize', resizeCanvas);
    
    // 파형 그리기 (실제로는 오디오 데이터를 분석해야 함)
    const drawWaveform = () => {
      if (!ctx || !canvas) return;
      
      // 캔버스 초기화
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 그라데이션 설정
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(64, 76, 237, 0.5)');
      gradient.addColorStop(1, 'rgba(172, 92, 207, 0.2)');
      
      // 파형 설정
      const centerY = canvas.height / 2;
      const amplitude = canvas.height / 4; // 파형 높이의 최대치
      const frequency = 0.01; // 파형의 주파수
      const segments = canvas.width; // 파형을 그릴 세그먼트 수
      const timeOffset = Date.now() * 0.001; // 시간에 따른 이동 효과
      
      // 파형 경로 생성
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      
      for (let i = 0; i < segments; i++) {
        const x = i;
        // 여러 사인파를 합성하여 복잡한 파형 생성
        const y = centerY + 
          Math.sin((x * frequency) + timeOffset) * amplitude * 0.5 + 
          Math.sin((x * frequency * 0.5) + timeOffset * 1.1) * amplitude * 0.3 +
          Math.sin((x * frequency * 0.3) + timeOffset * 0.7) * amplitude * 0.2;
          
        ctx.lineTo(x, y);
      }
      
      // 하단을 닫아서 영역으로 만듦
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      
      // 파형 채우기
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // 파형 테두리
      ctx.strokeStyle = 'rgba(102, 126, 234, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // 애니메이션 프레임 요청
      if (isAnimating) {
        animationRef.current = requestAnimationFrame(drawWaveform);
      }
    };
    
    // 애니메이션 시작
    if (isAnimating) {
      animationRef.current = requestAnimationFrame(drawWaveform);
    }
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isAnimating]);
  
  // 애니메이션 토글
  const toggleAnimation = () => {
    setIsAnimating(prev => !prev);
  };
  
  return (
    <div className="h-full w-full relative">
      {/* 파형 캔버스 */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      
      {/* 제어 버튼 */}
      <div className="absolute top-2 right-2">
        <button
          onClick={toggleAnimation}
          className="p-1 bg-gray-700 hover:bg-gray-600 text-white rounded-full"
          title={isAnimating ? '시각화 일시 중지' : '시각화 계속하기'}
        >
          <span className="material-icons text-sm">
            {isAnimating ? 'pause' : 'play_arrow'}
          </span>
        </button>
      </div>
      
      {/* 라벨 */}
      <div className="absolute top-2 left-2">
        <span className="text-xs text-white bg-gray-800/70 px-2 py-1 rounded">
          실시간 오디오 시각화
        </span>
      </div>
      
      {/* 시간 마커 */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between">
        <span className="text-xs text-white bg-gray-800/70 px-1 rounded">0:00</span>
        <span className="text-xs text-white bg-gray-800/70 px-1 rounded">현재</span>
      </div>
    </div>
  );
}
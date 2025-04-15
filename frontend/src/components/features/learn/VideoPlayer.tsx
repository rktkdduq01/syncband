'use client';

import { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  isPremium?: boolean; // 유료 콘텐츠 여부
  posterImage?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export default function VideoPlayer({
  videoUrl,
  title,
  isPremium = false,
  posterImage,
  onPlay,
  onPause,
  onEnded
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // 비디오 이벤트 리스너
    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(videoElement.duration);
    };

    const handleLoadedData = () => {
      setIsLoaded(true);
      setDuration(videoElement.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (onPlay) onPlay();
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (onPause) onPause();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    // 이벤트 리스너 등록
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('durationchange', handleDurationChange);
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('playing', handlePlaying);

    // 클린업 함수
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('durationchange', handleDurationChange);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('playing', handlePlaying);
    };
  }, [onPlay, onPause, onEnded]);

  // 전체 화면 변경 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 컨트롤 자동 숨김 효과
  useEffect(() => {
    if (isPlaying) {
      startHideControlsTimer();
    } else {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
      setShowControls(true);
    }

    return () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, [isPlaying]);

  const startHideControlsTimer = () => {
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }

    hideControlsTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleContainerMouseMove = () => {
    setShowControls(true);
    if (isPlaying) {
      startHideControlsTimer();
    }
  };

  // 재생/일시 정지 토글
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  // 전체 화면 토글
  const toggleFullscreen = () => {
    const container = videoContainerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error(`전체화면 전환 에러: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // 볼륨 조절
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // 음소거 토글
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.volume > 0) {
      video.volume = 0;
      setVolume(0);
    } else {
      video.volume = 1;
      setVolume(1);
    }
  };

  // 시간 포맷 변환 (초 -> MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 프로그레스바 클릭 시 시간 변경
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    
    if (videoRef.current && !isNaN(duration)) {
      const newTime = clickPosition * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // 프리미엄 콘텐츠 락 오버레이
  if (isPremium) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-gray-900" style={{ aspectRatio: '16/9' }}>
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white z-10">
          <div className="material-icons text-5xl mb-4">lock</div>
          <h3 className="text-xl font-semibold mb-2">프리미엄 콘텐츠</h3>
          <p className="text-gray-300 mb-4">이 콘텐츠를 시청하려면 강의를 구매하세요</p>
          <button className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-md">
            강의 구매하기
          </button>
        </div>
        <div className="w-full h-full bg-gradient-to-t from-black/80 to-transparent">
          {posterImage ? (
            <img src={posterImage} alt={title || 'Video thumbnail'} className="w-full h-full object-cover opacity-20" />
          ) : (
            <div className="w-full h-full bg-gray-800" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={videoContainerRef}
      className="relative rounded-lg overflow-hidden bg-black group"
      style={{ aspectRatio: '16/9' }}
      onMouseMove={handleContainerMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={videoUrl}
        poster={posterImage}
        onClick={togglePlay}
        playsInline
      />

      {/* 버퍼링 인디케이터 */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* 플레이 버튼 오버레이 (비디오 일시정지 상태에만 표시) */}
      {!isPlaying && isLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center">
            <span className="material-icons text-white text-4xl">play_arrow</span>
          </div>
        </div>
      )}

      {/* 컨트롤바 */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* 프로그레스 바 */}
        <div 
          className="w-full h-1.5 bg-gray-600/60 rounded-full mb-3 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-primary rounded-full relative"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* 재생/일시정지 버튼 */}
            <button 
              onClick={togglePlay}
              className="text-white focus:outline-none hover:text-primary"
            >
              <span className="material-icons">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            {/* 시간 표시 */}
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* 볼륨 컨트롤 */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMute}
                className="text-white focus:outline-none hover:text-primary"
              >
                <span className="material-icons">
                  {volume <= 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                </span>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-24 h-1 accent-primary bg-gray-600/60 rounded-full"
              />
            </div>

            {/* 전체화면 버튼 */}
            <button 
              onClick={toggleFullscreen}
              className="text-white focus:outline-none hover:text-primary"
            >
              <span className="material-icons">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
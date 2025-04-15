/**
 * 디바이스 및 브라우저 감지 관련 유틸리티 함수
 */

/**
 * 사용자 에이전트 문자열을 반환합니다.
 */
export const getUserAgent = (): string => {
  return navigator.userAgent;
};

/**
 * 모바일 디바이스인지 확인합니다.
 */
export const isMobileDevice = (): boolean => {
  const userAgent = getUserAgent().toLowerCase();
  return (
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
    (userAgent.includes('mobi') && !userAgent.includes('tablet'))
  );
};

/**
 * 태블릿 디바이스인지 확인합니다.
 */
export const isTabletDevice = (): boolean => {
  const userAgent = getUserAgent().toLowerCase();
  return (
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(
      userAgent
    ) ||
    (userAgent.includes('tablet') && !userAgent.includes('mobi'))
  );
};

/**
 * 데스크톱 디바이스인지 확인합니다.
 */
export const isDesktopDevice = (): boolean => {
  return !isMobileDevice() && !isTabletDevice();
};

/**
 * iOS 디바이스인지 확인합니다.
 */
export const isIOSDevice = (): boolean => {
  const userAgent = getUserAgent().toLowerCase();
  return /iphone|ipad|ipod/i.test(userAgent) && !(window as any).MSStream;
};

/**
 * Android 디바이스인지 확인합니다.
 */
export const isAndroidDevice = (): boolean => {
  return /android/i.test(getUserAgent());
};

/**
 * 사용 중인 브라우저 종류를 반환합니다.
 */
export const getBrowserType = (): string => {
  const userAgent = getUserAgent();
  
  if (userAgent.indexOf('Firefox') > -1) {
    return 'Firefox';
  } else if (userAgent.indexOf('SamsungBrowser') > -1) {
    return 'Samsung';
  } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    return 'Opera';
  } else if (userAgent.indexOf('Trident') > -1) {
    return 'IE';
  } else if (userAgent.indexOf('Edge') > -1) {
    return 'Edge';
  } else if (userAgent.indexOf('Chrome') > -1) {
    return 'Chrome';
  } else if (userAgent.indexOf('Safari') > -1) {
    return 'Safari';
  } else {
    return 'Unknown';
  }
};

/**
 * 특정 브라우저를 사용 중인지 확인합니다.
 */
export const isBrowser = (browserName: string): boolean => {
  return getBrowserType().toLowerCase() === browserName.toLowerCase();
};

/**
 * 화면 방향이 세로(portrait)인지 확인합니다.
 */
export const isPortraitOrientation = (): boolean => {
  return window.matchMedia('(orientation: portrait)').matches;
};

/**
 * 화면 방향이 가로(landscape)인지 확인합니다.
 */
export const isLandscapeOrientation = (): boolean => {
  return window.matchMedia('(orientation: landscape)').matches;
};

/**
 * 다크 모드인지 확인합니다.
 */
export const isDarkMode = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * 라이트 모드인지 확인합니다.
 */
export const isLightMode = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: light)').matches;
};

/**
 * 사용자가 색상 구성표 선호도를 설정했는지 확인합니다.
 */
export const hasColorSchemePreference = (): boolean => {
  return window.matchMedia('(prefers-color-scheme)').matches;
};

/**
 * 사용자가 화면의 움직임 감소를 선호하는지 확인합니다.
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * 사용자 화면의 픽셀 비율을 반환합니다.
 */
export const getDevicePixelRatio = (): number => {
  return window.devicePixelRatio || 1;
};

/**
 * 디바이스 메모리 용량을 반환합니다. (지원되는 브라우저에서만)
 */
export const getDeviceMemory = (): number | undefined => {
  return (navigator as any).deviceMemory;
};

/**
 * 오프라인 상태인지 확인합니다.
 */
export const isOffline = (): boolean => {
  return !navigator.onLine;
};

/**
 * 온라인 상태인지 확인합니다.
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * 모든 터치 이벤트를 지원하는지 확인합니다.
 */
export const supportsTouchEvents = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * 미디어 디바이스(카메라, 마이크)에 접근 가능한지 확인합니다.
 */
export const hasMediaDevices = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

/**
 * 화면 공유가 가능한지 확인합니다.
 */
export const canShareScreen = (): boolean => {
  return !!(navigator.mediaDevices && (navigator.mediaDevices as any).getDisplayMedia);
};

/**
 * WebRTC가 지원되는지 확인합니다.
 */
export const supportsWebRTC = (): boolean => {
  return !!(window.RTCPeerConnection && navigator.mediaDevices);
};

/**
 * WebAudio API가 지원되는지 확인합니다.
 */
export const supportsWebAudio = (): boolean => {
  return !!((window as any).AudioContext || (window as any).webkitAudioContext);
};

/**
 * WebGL이 지원되는지 확인합니다.
 */
export const supportsWebGL = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};

/**
 * 화면 크기에 따른 디바이스 타입을 반환합니다.
 */
export const getDeviceTypeByScreenSize = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * 오디오 출력 장치 목록을 가져옵니다.
 */
export const getAudioOutputDevices = async (): Promise<MediaDeviceInfo[]> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return [];
  }
  
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(device => device.kind === 'audiooutput');
};

/**
 * 오디오 입력 장치(마이크) 목록을 가져옵니다.
 */
export const getAudioInputDevices = async (): Promise<MediaDeviceInfo[]> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return [];
  }
  
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(device => device.kind === 'audioinput');
};

/**
 * 비디오 입력 장치(카메라) 목록을 가져옵니다.
 */
export const getVideoInputDevices = async (): Promise<MediaDeviceInfo[]> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return [];
  }
  
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(device => device.kind === 'videoinput');
};

/**
 * 현재 디바이스가 저전력 모드인지 확인합니다. (Battery API 지원 필요)
 */
export const isLowPowerMode = async (): Promise<boolean | null> => {
  if (!(navigator as any).getBattery) {
    return null;
  }
  
  try {
    const battery = await (navigator as any).getBattery();
    // iOS에서는 lowPower 상태를 제공하지 않지만, 향후 구현을 위해 준비
    return battery.charging === false && battery.level < 0.2;
  } catch (e) {
    return null;
  }
};

/**
 * PWA로 설치되었는지 확인합니다.
 */
export const isInstalledPWA = (): boolean => {
  // displayMode가 standalone 또는 fullscreen이면 PWA로 설치된 것으로 간주
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.matchMedia('(display-mode: fullscreen)').matches ||
         (window.navigator as any).standalone === true; // iOS Safari
};

/**
 * 특정 모바일 운영체제인지 확인합니다.
 * @param os 확인할 운영체제 ('ios', 'android', 'windows')
 */
export const isMobileOS = (os: 'ios' | 'android' | 'windows'): boolean => {
  const userAgent = getUserAgent().toLowerCase();
  
  switch(os) {
    case 'ios': 
      return isIOSDevice();
    case 'android': 
      return isAndroidDevice();
    case 'windows': 
      return /windows phone/i.test(userAgent);
    default:
      return false;
  }
};

/**
 * 화면 크기를 기준으로 모바일인지 확인합니다.
 */
export const isMobileByScreenSize = (): boolean => {
  return window.innerWidth <= 768;
};

/**
 * 모바일 브라우저에서 실행 중인지 확인합니다.
 */
export const isMobileBrowser = (): boolean => {
  return isMobileDevice() || isTabletDevice();
};

/**
 * 현재 디바이스의 화면 해상도를 반환합니다.
 */
export const getScreenResolution = (): { width: number; height: number } => {
  return {
    width: window.screen.width,
    height: window.screen.height
  };
};

/**
 * 현재 디바이스의 최대 터치 포인트 수를 반환합니다.
 */
export const getMaxTouchPoints = (): number => {
  return navigator.maxTouchPoints || 0;
};

/**
 * 디바이스 방향이 변경될 때 콜백을 실행하는 이벤트 리스너를 설정합니다.
 * @param callback 방향 변경 시 실행될 콜백 함수
 * @returns 이벤트 리스너 제거 함수
 */
export const onOrientationChange = (callback: () => void): (() => void) => {
  const handler = () => {
    callback();
  };
  
  window.addEventListener('orientationchange', handler);
  
  // 이벤트 리스너 제거 함수 반환
  return () => {
    window.removeEventListener('orientationchange', handler);
  };
};

/**
 * 네트워크 연결 상태가 변경될 때 콜백을 실행하는 이벤트 리스너를 설정합니다.
 * @param onOnline 온라인 상태가 될 때 실행될 콜백 함수
 * @param onOffline 오프라인 상태가 될 때 실행될 콜백 함수
 * @returns 이벤트 리스너 제거 함수
 */
export const onNetworkStatusChange = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  // 이벤트 리스너 제거 함수 반환
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

/**
 * 현재 네트워크 연결 유형을 반환합니다. (Connection API 지원 필요)
 */
export const getNetworkConnectionType = (): string | null => {
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
                     
  if (!connection) return null;
  
  return connection.effectiveType || connection.type || null;
};

/**
 * 브라우저가 특정 API를 지원하는지 확인합니다.
 * @param apiName 확인할 API 이름
 */
export const supportsAPI = (apiName: string): boolean => {
  switch(apiName.toLowerCase()) {
    case 'geolocation': 
      return 'geolocation' in navigator;
    case 'webstorage': 
      return 'localStorage' in window && 'sessionStorage' in window;
    case 'webworkers': 
      return 'Worker' in window;
    case 'serviceworkers': 
      return 'serviceWorker' in navigator;
    case 'webassembly': 
      return typeof WebAssembly === 'object';
    case 'webshare': 
      return 'share' in navigator;
    case 'bluetooth': 
      return 'bluetooth' in navigator;
    case 'payment': 
      return 'PaymentRequest' in window;
    case 'push': 
      return 'PushManager' in window;
    case 'notifications': 
      return 'Notification' in window;
    default:
      return false;
  }
};
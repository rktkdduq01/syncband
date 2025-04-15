/**
 * 로컬 스토리지 및 세션 스토리지 관련 유틸리티 함수들
 */

/**
 * 로컬 스토리지에 아이템 설정하기
 */
export function setLocalItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.error('로컬 스토리지 저장 오류:', error);
  }
}

/**
 * 로컬 스토리지에서 아이템 가져오기
 */
export function getLocalItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error('로컬 스토리지 가져오기 오류:', error);
    return null;
  }
}

/**
 * 로컬 스토리지에서 아이템 제거하기
 */
export function removeLocalItem(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('로컬 스토리지 제거 오류:', error);
  }
}

/**
 * 세션 스토리지에 아이템 설정하기
 */
export function setSessionItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.sessionStorage.setItem(key, value);
  } catch (error) {
    console.error('세션 스토리지 저장 오류:', error);
  }
}

/**
 * 세션 스토리지에서 아이템 가져오기
 */
export function getSessionItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return window.sessionStorage.getItem(key);
  } catch (error) {
    console.error('세션 스토리지 가져오기 오류:', error);
    return null;
  }
}

/**
 * 세션 스토리지에서 아이템 제거하기
 */
export function removeSessionItem(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.sessionStorage.removeItem(key);
  } catch (error) {
    console.error('세션 스토리지 제거 오류:', error);
  }
}

/**
 * 객체를 로컬 스토리지에 JSON으로 저장하기
 */
export function setLocalObject<T>(key: string, value: T): void {
  try {
    const jsonValue = JSON.stringify(value);
    setLocalItem(key, jsonValue);
  } catch (error) {
    console.error('JSON 저장 오류:', error);
  }
}

/**
 * 로컬 스토리지에서 JSON 객체 가져오기
 */
export function getLocalObject<T>(key: string): T | null {
  try {
    const jsonValue = getLocalItem(key);
    if (!jsonValue) return null;
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    console.error('JSON 파싱 오류:', error);
    return null;
  }
}

/**
 * 로컬 스토리지 내의 모든 키 가져오기
 */
export function getAllStorageKeys(): string[] {
  if (typeof window === 'undefined') return [];
  
  const keys: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
  } catch (error) {
    console.error('스토리지 키 가져오기 오류:', error);
  }
  
  return keys;
}

/**
 * 특정 접두사로 시작하는 모든 스토리지 아이템 제거
 */
export function removeItemsByPrefix(prefix: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('아이템 일괄 제거 오류:', error);
  }
}
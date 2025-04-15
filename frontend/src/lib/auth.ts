/**
 * 인증 관련 유틸리티 함수들
 */

import { get, post } from './api';
import { setLocalItem, getLocalItem, removeLocalItem } from './storage';

// 토큰 관련 상수
const ACCESS_TOKEN_KEY = 'syncband_access_token';
const REFRESH_TOKEN_KEY = 'syncband_refresh_token';
const USER_INFO_KEY = 'syncband_user_info';

// 사용자 정보 타입
export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

/**
 * 액세스 토큰 가져오기
 */
export function getAccessToken(): string | null {
  return getLocalItem(ACCESS_TOKEN_KEY);
}

/**
 * 리프레시 토큰 가져오기
 */
export function getRefreshToken(): string | null {
  return getLocalItem(REFRESH_TOKEN_KEY);
}

/**
 * 사용자 정보 가져오기
 */
export function getUserInfo(): User | null {
  const userInfo = getLocalItem(USER_INFO_KEY);
  if (!userInfo) return null;
  
  try {
    return JSON.parse(userInfo);
  } catch (err) {
    console.error('사용자 정보 파싱 오류:', err);
    return null;
  }
}

/**
 * 로그인 함수
 */
export async function login(email: string, password: string) {
  const response = await post('/auth/login', { email, password });
  
  if (response.error) {
    return response;
  }
  
  if (response.data) {
    const { accessToken, refreshToken, user } = response.data;
    
    setLocalItem(ACCESS_TOKEN_KEY, accessToken);
    setLocalItem(REFRESH_TOKEN_KEY, refreshToken);
    setLocalItem(USER_INFO_KEY, JSON.stringify(user));
  }
  
  return response;
}

/**
 * 회원가입 함수
 */
export async function register(username: string, email: string, password: string, name?: string) {
  return await post('/auth/register', { username, email, password, name });
}

/**
 * 로그아웃 함수
 */
export function logout() {
  removeLocalItem(ACCESS_TOKEN_KEY);
  removeLocalItem(REFRESH_TOKEN_KEY);
  removeLocalItem(USER_INFO_KEY);
  
  // 서버에 로그아웃 요청 (선택적)
  post('/auth/logout').catch(err => console.error('로그아웃 오류:', err));
}

/**
 * 토큰 갱신 함수
 */
export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    logout();
    return { error: '리프레시 토큰이 없습니다.' };
  }
  
  const response = await post('/auth/refresh', { refreshToken });
  
  if (response.error) {
    logout();
    return response;
  }
  
  if (response.data) {
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    setLocalItem(ACCESS_TOKEN_KEY, accessToken);
    if (newRefreshToken) {
      setLocalItem(REFRESH_TOKEN_KEY, newRefreshToken);
    }
  }
  
  return response;
}

/**
 * 인증 상태 확인
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * 사용자 권한 확인
 */
export function hasRole(requiredRole: string): boolean {
  const user = getUserInfo();
  if (!user) return false;
  
  if (user.role === 'admin') return true;
  return user.role === requiredRole;
}

/**
 * 비밀번호 재설정 요청
 */
export async function requestPasswordReset(email: string) {
  return await post('/auth/forgot-password', { email });
}

/**
 * 비밀번호 재설정
 */
export async function resetPassword(token: string, newPassword: string) {
  return await post('/auth/reset-password', { token, newPassword });
}

/**
 * 사용자 프로필 업데이트
 */
export async function updateUserProfile(updates: Partial<User>) {
  const response = await post('/users/profile', updates);
  
  if (!response.error && response.data) {
    const currentUser = getUserInfo();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...response.data };
      setLocalItem(USER_INFO_KEY, JSON.stringify(updatedUser));
    }
  }
  
  return response;
}
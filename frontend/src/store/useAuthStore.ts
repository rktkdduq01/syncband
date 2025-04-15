/**
 * 인증 관련 상태 관리 스토어
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { User } from '../types/auth';
import { login as apiLogin, register as apiRegister, logout as apiLogout, updateUserProfile, User as LibUser } from '../lib/auth';

interface AuthState {
  // 상태
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // 액션
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

// 타입 변환 유틸리티 함수: User -> LibUser
const convertToLibUser = (user: Partial<User>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  // 모든 속성을 복사하되 Date 타입은 string으로 변환
  Object.keys(user).forEach(key => {
    const value = user[key as keyof Partial<User>];
    if (value instanceof Date) {
      result[key] = value.toISOString();
    } else {
      result[key] = value;
    }
  });
  
  return result;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // 로그인 액션
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await apiLogin(email, password);
          
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return;
          }
          
          if (response.data) {
            const { user, accessToken } = response.data;
            set({
              user,
              token: accessToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.',
            isLoading: false,
          });
        }
      },
      
      // 회원가입 액션
      register: async (username, email, password, name) => {
        try {
          set({ isLoading: true, error: null });
          const response = await apiRegister(username, email, password, name);
          
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return;
          }
          
          // 회원가입 후 자동 로그인
          await get().login(email, password);
          
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.',
            isLoading: false,
          });
        }
      },
      
      // 로그아웃 액션
      logout: () => {
        apiLogout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
      
      // 프로필 업데이트 액션
      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          
          // User 타입을 LibUser 타입으로 변환
          const libUserData = convertToLibUser(data);
          
          const response = await updateUserProfile(libUserData as Partial<LibUser>);
          
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return;
          }
          
          const currentUser = get().user;
          if (currentUser && response.data) {
            set({
              user: { ...currentUser, ...response.data },
              isLoading: false,
            });
          }
          
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : '프로필 업데이트 중 오류가 발생했습니다.',
            isLoading: false,
          });
        }
      },
      
      // 에러 초기화
      clearError: () => set({ error: null }),
      
      // 사용자 정보 설정
      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
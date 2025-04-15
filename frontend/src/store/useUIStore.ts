/**
 * UI 상태 관리 스토어
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 모달/다이얼로그 종류
export enum ModalType {
  LOGIN = 'login',
  REGISTER = 'register',
  PROFILE = 'profile',
  SHARE = 'share',
  CREATE_ROOM = 'create_room',
  INVITE = 'invite',
  INSTRUMENT_SELECT = 'instrument_select',
  SETTINGS = 'settings',
  CONFIRM = 'confirm',
  ALERT = 'alert',
}

// 테마 종류
export type ThemeType = 'light' | 'dark' | 'system';

// 사이드바 상태 타입
export interface SidebarState {
  open: boolean;
  activeTab: string | null;
}

// 확인 다이얼로그 데이터 타입
interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

// 경고 다이얼로그 데이터 타입
interface AlertDialogData {
  title: string;
  message: string;
  buttonText?: string;
  onClose?: () => void;
}

interface UIState {
  // 테마 설정
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  
  // 사이드바 상태
  sidebar: SidebarState;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  setSidebarTab: (tab: string | null) => void;
  
  // 모달 상태
  activeModal: ModalType | null;
  modalData: any;
  openModal: <T = any>(type: ModalType, data?: T | null) => void;
  closeModal: () => void;
  
  // 토스트 메시지
  toast: {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration: number;
  };
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
  hideToast: () => void;
  
  // 확인/경고 다이얼로그 헬퍼
  showConfirmDialog: (data: ConfirmDialogData) => void;
  showAlertDialog: (data: AlertDialogData) => void;
}

const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // 테마 설정 (기본값: 시스템)
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      // 사이드바 상태
      sidebar: {
        open: false,
        activeTab: null,
      },
      openSidebar: () => set(state => ({ sidebar: { ...state.sidebar, open: true } })),
      closeSidebar: () => set(state => ({ sidebar: { ...state.sidebar, open: false } })),
      toggleSidebar: () => set(state => ({ sidebar: { ...state.sidebar, open: !state.sidebar.open } })),
      setSidebarTab: (tab) => set(state => ({ sidebar: { ...state.sidebar, activeTab: tab } })),
      
      // 모달 상태
      activeModal: null,
      modalData: null,
      openModal: (type, data = null) => set({ activeModal: type, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),
      
      // 토스트 메시지
      toast: {
        visible: false,
        message: '',
        type: 'info',
        duration: 3000,
      },
      
      showToast: (message, type = 'info', duration = 3000) => {
        set({
          toast: {
            visible: true,
            message,
            type,
            duration,
          }
        });
        
        // duration 후에 자동으로 숨기기
        setTimeout(() => {
          set(state => {
            // 같은 토스트인 경우만 자동으로 제거
            if (state.toast.message === message && state.toast.visible) {
              return {
                toast: { ...state.toast, visible: false }
              };
            }
            return state;
          });
        }, duration);
      },
      
      hideToast: () => set(state => ({ toast: { ...state.toast, visible: false } })),
      
      // 확인 다이얼로그 헬퍼
      showConfirmDialog: (data) => {
        set({
          activeModal: ModalType.CONFIRM,
          modalData: data,
        });
      },
      
      // 경고 다이얼로그 헬퍼
      showAlertDialog: (data) => {
        set({
          activeModal: ModalType.ALERT,
          modalData: data,
        });
      },
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);

export default useUIStore;
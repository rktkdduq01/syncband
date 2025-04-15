// 사용자 타입
export type User = {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  settings?: UserSettings;
  isEmailVerified: boolean;
  socialProfiles?: SocialProfile[];
  skills?: UserSkill[];
  preferredInstruments?: string[];
  preferredGenres?: string[];
  isPremium: boolean;
  premiumUntil?: Date;
  location?: string;
};

// 사용자 역할 타입
export type UserRole = 'user' | 'creator' | 'moderator' | 'admin';

// 사용자 설정 타입
export type UserSettings = {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: EmailNotificationSettings;
  pushNotifications: PushNotificationSettings;
  privacy: PrivacySettings;
  audioSettings: UserAudioSettings;
  accessibility?: AccessibilitySettings;
  language: string;
};

// 이메일 알림 설정 타입
export type EmailNotificationSettings = {
  newMessages: boolean;
  jamInvitations: boolean;
  newFollowers: boolean;
  commentReplies: boolean;
  projectUpdates: boolean;
  newsletter: boolean;
  promotions: boolean;
};

// 푸시 알림 설정 타입
export type PushNotificationSettings = {
  newMessages: boolean;
  jamInvitations: boolean;
  newFollowers: boolean;
  commentReplies: boolean;
  projectUpdates: boolean;
};

// 개인정보 설정 타입
export type PrivacySettings = {
  profileVisibility: 'public' | 'followers' | 'private';
  showOnlineStatus: boolean;
  allowMessagesFrom: 'everyone' | 'followers' | 'none';
  showActivity: boolean;
  showProjects: boolean;
};

// 사용자 오디오 설정 타입
export type UserAudioSettings = {
  inputDevice?: string;
  outputDevice?: string;
  sampleRate: number;
  bitDepth: number;
  bufferSize: number;
  autoGainControl: boolean;
  noiseSuppression: boolean;
  echoCancellation: boolean;
};

// 접근성 설정 타입
export type AccessibilitySettings = {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
};

// 소셜 프로필 타입
export type SocialProfile = {
  provider: 'google' | 'facebook' | 'apple' | 'twitter' | 'github';
  id: string;
  profileUrl?: string;
  connectedAt: Date;
  lastUsed?: Date;
};

// 사용자 기술 타입
export type UserSkill = {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
};

// 로그인 요청 타입
export type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

// 로그인 응답 타입
export type LoginResponse = {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
};

// 회원가입 요청 타입
export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  preferredInstruments?: string[];
  preferredGenres?: string[];
  agreeTerms: boolean;
  agreeMarketing?: boolean;
};

// 인증 상태 타입
export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  error: string | null;
};

// 비밀번호 변경 요청 타입
export type PasswordChangeRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// 비밀번호 리셋 요청 타입
export type PasswordResetRequest = {
  email: string;
};

// 소셜 로그인 응답 타입
export type SocialLoginResponse = {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
  isNewUser: boolean;
};
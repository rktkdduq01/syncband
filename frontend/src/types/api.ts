// API 응답의 기본 구조
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
  meta?: {
    pagination?: PaginationMeta;
    [key: string]: any;
  };
};

// API 오류 타입
export type ApiError = {
  code: string;
  message: string;
  status: number;
  details?: any;
};

// 페이지네이션 메타데이터
export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// API 요청 옵션
export type ApiRequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  withCredentials?: boolean;
  signal?: AbortSignal;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
};

// API 페이지네이션 요청 파라미터
export type PaginationParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

// API 필터 파라미터
export type FilterParams = {
  [key: string]: string | number | boolean | string[] | number[] | null;
};

// API 검색 파라미터
export type SearchParams = {
  query?: string;
  fields?: string[];
};

// API 요청 상태
export type ApiRequestStatus = 'idle' | 'loading' | 'success' | 'error';

// API 요청 상태 타입
export type ApiState<T = any> = {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  isSuccess: boolean;
};

// API 캐시 타입
export type ApiCache<T = any> = {
  data: T;
  timestamp: number;
  expiry: number;
};

// 파일 업로드 응답 타입
export type FileUploadResponse = {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  path?: string;
  thumbnail?: string;
  createdAt: string;
  metadata?: Record<string, any>;
};

// 상태 업데이트 응답 타입
export type StatusUpdateResponse = {
  id: string;
  status: string;
  message?: string;
  timestamp: string;
};

// 배치 작업 응답 타입
export type BatchOperationResponse = {
  totalItems: number;
  successCount: number;
  failureCount: number;
  failures?: {
    id: string;
    error: string;
  }[];
};

// API 엔드포인트 그룹 타입
export enum ApiEndpoint {
  AUTH = '/auth',
  USERS = '/users',
  ROOMS = '/rooms',
  COURSES = '/courses',
  LESSONS = '/lessons',
  INSTRUMENTS = '/instruments',
  FORUM = '/forum',
  COLLABORATIONS = '/collaborations',
  SHOWCASE = '/showcase',
  GEAR = '/gear',
  MIX = '/mix',
  NOTIFICATIONS = '/notifications',
  SEARCH = '/search',
  FILES = '/files',
  ANALYTICS = '/analytics'
};

// 웹소켓 메시지 타입
export type WebSocketMessage<T = any> = {
  type: string;
  payload: T;
  timestamp: number;
};

// 웹소켓 연결 상태
export type WebSocketConnectionState = 
  | 'connecting'
  | 'open'
  | 'closing'
  | 'closed'
  | 'reconnecting';

// OAuth 제공자 타입
export enum OAuthProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
  TWITTER = 'twitter',
  GITHUB = 'github',
}
/**
 * API 요청을 처리하는 유틸리티 함수들
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
  cache?: RequestCache;
}

interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * API 요청을 보내는 기본 함수
 */
export async function fetchApi<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', headers = {}, body, ...restOptions } = options;
  
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...restOptions,
    };
    
    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, fetchOptions);
    const responseData = response.headers.get('content-type')?.includes('application/json')
      ? await response.json()
      : await response.text();
      
    if (!response.ok) {
      const error = responseData?.message || responseData?.error || '알 수 없는 오류가 발생했습니다.';
      return {
        data: null,
        error,
        status: response.status,
      };
    }
    
    return {
      data: responseData,
      error: null,
      status: response.status,
    };
    
  } catch (err) {
    console.error('API 요청 오류:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : '네트워크 오류가 발생했습니다.',
      status: 0,
    };
  }
}

/**
 * GET 요청 함수
 */
export function get<T = any>(endpoint: string, options: Omit<FetchOptions, 'method'> = {}) {
  return fetchApi<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * POST 요청 함수
 */
export function post<T = any>(endpoint: string, body?: any, options: Omit<FetchOptions, 'method' | 'body'> = {}) {
  return fetchApi<T>(endpoint, { ...options, method: 'POST', body });
}

/**
 * PUT 요청 함수
 */
export function put<T = any>(endpoint: string, body?: any, options: Omit<FetchOptions, 'method' | 'body'> = {}) {
  return fetchApi<T>(endpoint, { ...options, method: 'PUT', body });
}

/**
 * DELETE 요청 함수
 */
export function del<T = any>(endpoint: string, options: Omit<FetchOptions, 'method'> = {}) {
  return fetchApi<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * PATCH 요청 함수
 */
export function patch<T = any>(endpoint: string, body?: any, options: Omit<FetchOptions, 'method' | 'body'> = {}) {
  return fetchApi<T>(endpoint, { ...options, method: 'PATCH', body });
}
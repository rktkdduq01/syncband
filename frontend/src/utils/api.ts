/**
 * API 통신 관련 유틸리티 함수
 */

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.syncband.com';

// HTTP 요청 타입 정의
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 요청 옵션 타입 정의
interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  withCredentials?: boolean;
  signal?: AbortSignal;
}

// 응답 타입 정의
interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
}

// 에러 응답 타입 정의
interface ApiError {
  message: string;
  status: number;
  data?: any;
}

/**
 * API 요청에 사용할 기본 헤더를 설정합니다.
 */
const getDefaultHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // 로컬 스토리지에서 인증 토큰을 가져와 헤더에 추가
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * URL에 쿼리 파라미터를 추가합니다.
 */
const appendQueryParams = (url: string, params?: Record<string, any>): string => {
  if (!params) return url;

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(item => `${encodeURIComponent(key)}[]=${encodeURIComponent(item)}`).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');

  return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
};

/**
 * API 요청 시 발생한 에러를 처리합니다.
 */
const handleApiError = async (response: Response): Promise<ApiError> => {
  let errorData: any = {};
  
  try {
    errorData = await response.json();
  } catch (error) {
    errorData = { message: '응답을 처리하는 중 오류가 발생했습니다.' };
  }
  
  return {
    status: response.status,
    message: errorData.message || response.statusText || '알 수 없는 오류가 발생했습니다.',
    data: errorData
  };
};

/**
 * HTTP 요청을 보내는 기본 함수입니다.
 */
const request = async <T = any>(
  method: HttpMethod,
  endpoint: string,
  data?: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { headers = {}, params, withCredentials = true, signal } = options;
  
  // URL 생성
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const fullUrl = appendQueryParams(url, params);
  
  // 요청 옵션 설정
  const requestOptions: RequestInit = {
    method,
    headers: { ...getDefaultHeaders(), ...headers },
    credentials: withCredentials ? 'include' : 'omit',
    signal
  };

  // GET 요청이 아닌 경우 body 추가
  if (method !== 'GET' && data) {
    requestOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(fullUrl, requestOptions);
    
    // 응답이 성공적이지 않은 경우 에러 처리
    if (!response.ok) {
      throw await handleApiError(response);
    }
    
    // 응답 데이터 처리
    const responseData = response.status !== 204 ? await response.json() : null;
    
    return {
      data: responseData,
      status: response.status,
      headers: response.headers
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw { message: '요청이 취소되었습니다.', status: 0 };
    }
    
    if ('status' in error) {
      throw error;
    }
    
    throw { message: error.message || '네트워크 오류가 발생했습니다.', status: 0 };
  }
};

/**
 * GET 요청을 보냅니다.
 */
export const get = <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  return request<T>('GET', endpoint, undefined, options);
};

/**
 * POST 요청을 보냅니다.
 */
export const post = <T = any>(
  endpoint: string,
  data?: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  return request<T>('POST', endpoint, data, options);
};

/**
 * PUT 요청을 보냅니다.
 */
export const put = <T = any>(
  endpoint: string,
  data?: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  return request<T>('PUT', endpoint, data, options);
};

/**
 * PATCH 요청을 보냅니다.
 */
export const patch = <T = any>(
  endpoint: string,
  data?: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  return request<T>('PATCH', endpoint, data, options);
};

/**
 * DELETE 요청을 보냅니다.
 */
export const del = <T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  return request<T>('DELETE', endpoint, undefined, options);
};

/**
 * 파일 업로드를 위한 함수입니다.
 */
export const uploadFile = async <T = any>(
    endpoint: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, any>,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    const { headers = {}, withCredentials = true, signal } = options;
    
    // FormData 생성 및 파일 추가
    const formData = new FormData();
    formData.append(fieldName, file);
    
    // 추가 데이터가 있으면 FormData에 추가
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }
    
    // URL 생성
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // 기본 헤더와 사용자 헤더 병합 후 Content-Type 제거
    const mergedHeaders = { ...getDefaultHeaders(), ...headers };
    delete mergedHeaders['Content-Type']; // Content-Type 헤더 제거
    
    // 요청 옵션 설정 (Content-Type은 브라우저가 자동으로 설정)
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: mergedHeaders,
      credentials: withCredentials ? 'include' : 'omit',
      body: formData,
      signal
    };
  
  try {
    const response = await fetch(url, requestOptions);
    
    // 응답이 성공적이지 않은 경우 에러 처리
    if (!response.ok) {
      throw await handleApiError(response);
    }
    
    // 응답 데이터 처리
    const responseData = await response.json();
    
    return {
      data: responseData,
      status: response.status,
      headers: response.headers
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw { message: '업로드가 취소되었습니다.', status: 0 };
    }
    
    if ('status' in error) {
      throw error;
    }
    
    throw { message: error.message || '네트워크 오류가 발생했습니다.', status: 0 };
  }
};

/**
 * 여러 파일을 업로드하는 함수입니다.
 */
export const uploadMultipleFiles = async <T = any>(
    endpoint: string,
    files: File[],
    fieldName: string = 'files',
    additionalData?: Record<string, any>,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    const { headers = {}, withCredentials = true, signal } = options;
    
    // FormData 생성 및 파일 추가
    const formData = new FormData();
    files.forEach(file => {
      formData.append(fieldName, file);
    });
    
    // 추가 데이터가 있으면 FormData에 추가
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }
    
    // URL 생성
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // 기본 헤더와 사용자 헤더 병합 후 Content-Type 제거
    const mergedHeaders = { ...getDefaultHeaders(), ...headers };
    delete mergedHeaders['Content-Type']; // Content-Type 헤더 제거
    
    // 요청 옵션 설정
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: mergedHeaders,
      credentials: withCredentials ? 'include' : 'omit',
      body: formData,
      signal
    };
    
    try {
      const response = await fetch(url, requestOptions);
      
      // 응답이 성공적이지 않은 경우 에러 처리
      if (!response.ok) {
        throw await handleApiError(response);
      }
      
      // 응답 데이터 처리
      const responseData = await response.json();
      
      return {
        data: responseData,
        status: response.status,
        headers: response.headers
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw { message: '업로드가 취소되었습니다.', status: 0 };
      }
      
      if ('status' in error) {
        throw error;
      }
      
      throw { message: error.message || '네트워크 오류가 발생했습니다.', status: 0 };
    }
  };

/**
 * 요청을 중단할 수 있는 AbortController를 생성합니다.
 */
export const createAbortController = (): AbortController => {
  return new AbortController();
};

/**
 * API 호출을 재시도하는 함수입니다.
 */
export const retryRequest = async <T = any>(
  requestFn: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<ApiResponse<T>> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // 재시도 전 지연
      await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
    }
  }
  
  throw lastError;
};

/**
 * API 응답을 캐싱하는 함수입니다.
 */
export const createCachedRequest = <T = any>(
  requestFn: () => Promise<ApiResponse<T>>,
  cacheKey: string,
  expirationMs: number = 60 * 1000 // 기본 1분
): () => Promise<ApiResponse<T>> => {
  return async () => {
    const cachedData = localStorage.getItem(`api_cache_${cacheKey}`);
    
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        
        // 캐시가 아직 유효한지 확인
        if (Date.now() - timestamp < expirationMs) {
          return {
            data,
            status: 200,
            headers: new Headers()
          };
        }
      } catch (error) {
        console.error('캐시 데이터 파싱 오류:', error);
      }
    }
    
    // 캐시가 없거나 만료된 경우 새 요청 수행
    const response = await requestFn();
    
    // 응답 캐싱
    localStorage.setItem(
      `api_cache_${cacheKey}`,
      JSON.stringify({
        data: response.data,
        timestamp: Date.now()
      })
    );
    
    return response;
  };
};

/**
 * API 호출 상태를 관리하기 위한 상태 객체를 생성합니다.
 */
export const createRequestState = <T = any>() => {
    const state = {
      data: null as T | null,
      loading: false,
      error: null as ApiError | null,
      
      setLoading: function(isLoading: boolean) {
        return { ...state, loading: isLoading };
      },
      
      setData: function(data: T) {
        return { ...state, data, loading: false, error: null };
      },
      
      setError: function(error: ApiError) {
        return { ...state, error, loading: false };
      }
    };
    
    return state;
  };

export default {
  get,
  post,
  put,
  patch,
  delete: del,
  uploadFile,
  uploadMultipleFiles,
  createAbortController,
  retryRequest,
  createCachedRequest,
  createRequestState
};
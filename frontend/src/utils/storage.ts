/**
 * 스토리지 관련 유틸리티 함수
 * 로컬 스토리지, 세션 스토리지 및 쿠키 관리 기능을 제공합니다.
 */

/**
 * 로컬 스토리지 관리
 */
export const localStorage = {
  /**
   * 로컬 스토리지에 값을 저장합니다.
   */
  set: (key: string, value: any): void => {
    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('로컬 스토리지 저장 중 오류 발생:', error);
    }
  },

  /**
   * 로컬 스토리지에서 값을 가져옵니다.
   */
  get: <T = any>(key: string, defaultValue?: T): T | undefined => {
    try {
      const serializedValue = window.localStorage.getItem(key);
      if (serializedValue === null) {
        return defaultValue;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('로컬 스토리지에서 데이터 읽기 중 오류 발생:', error);
      return defaultValue;
    }
  },

  /**
   * 로컬 스토리지에서 특정 키의 값을 삭제합니다.
   */
  remove: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('로컬 스토리지에서 항목 삭제 중 오류 발생:', error);
    }
  },

  /**
   * 로컬 스토리지의 모든 값을 삭제합니다.
   */
  clear: (): void => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('로컬 스토리지 초기화 중 오류 발생:', error);
    }
  },

  /**
   * 로컬 스토리지의 모든 키를 가져옵니다.
   */
  keys: (): string[] => {
    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      console.error('로컬 스토리지 키 목록 가져오기 중 오류 발생:', error);
      return [];
    }
  },

  /**
   * 로컬 스토리지가 사용 가능한지 확인합니다.
   */
  isAvailable: (): boolean => {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * 로컬 스토리지에 저장된 데이터 크기를 바이트 단위로 계산합니다.
   */
  getSize: (): number => {
    try {
      let totalSize = 0;
      for (const key of Object.keys(window.localStorage)) {
        totalSize += (window.localStorage[key].length + key.length) * 2; // UTF-16 문자는 2바이트
      }
      return totalSize;
    } catch (error) {
      console.error('로컬 스토리지 크기 계산 중 오류 발생:', error);
      return 0;
    }
  },
};

/**
 * 세션 스토리지 관리
 */
export const sessionStorage = {
  /**
   * 세션 스토리지에 값을 저장합니다.
   */
  set: (key: string, value: any): void => {
    try {
      const serializedValue = JSON.stringify(value);
      window.sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('세션 스토리지 저장 중 오류 발생:', error);
    }
  },

  /**
   * 세션 스토리지에서 값을 가져옵니다.
   */
  get: <T = any>(key: string, defaultValue?: T): T | undefined => {
    try {
      const serializedValue = window.sessionStorage.getItem(key);
      if (serializedValue === null) {
        return defaultValue;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('세션 스토리지에서 데이터 읽기 중 오류 발생:', error);
      return defaultValue;
    }
  },

  /**
   * 세션 스토리지에서 특정 키의 값을 삭제합니다.
   */
  remove: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error('세션 스토리지에서 항목 삭제 중 오류 발생:', error);
    }
  },

  /**
   * 세션 스토리지의 모든 값을 삭제합니다.
   */
  clear: (): void => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('세션 스토리지 초기화 중 오류 발생:', error);
    }
  },

  /**
   * 세션 스토리지의 모든 키를 가져옵니다.
   */
  keys: (): string[] => {
    try {
      return Object.keys(window.sessionStorage);
    } catch (error) {
      console.error('세션 스토리지 키 목록 가져오기 중 오류 발생:', error);
      return [];
    }
  },

  /**
   * 세션 스토리지가 사용 가능한지 확인합니다.
   */
  isAvailable: (): boolean => {
    try {
      const testKey = '__storage_test__';
      window.sessionStorage.setItem(testKey, testKey);
      window.sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * 세션 스토리지에 저장된 데이터 크기를 바이트 단위로 계산합니다.
   */
  getSize: (): number => {
    try {
      let totalSize = 0;
      for (const key of Object.keys(window.sessionStorage)) {
        totalSize += (window.sessionStorage[key].length + key.length) * 2; // UTF-16 문자는 2바이트
      }
      return totalSize;
    } catch (error) {
      console.error('세션 스토리지 크기 계산 중 오류 발생:', error);
      return 0;
    }
  },
};

/**
 * 쿠키 관리
 */
export const cookies = {
  /**
   * 쿠키를 설정합니다.
   */
  set: (
    name: string,
    value: string,
    options: {
      days?: number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
    } = {}
  ): void => {
    try {
      const { days = 7, path = '/', domain, secure, sameSite = 'lax' } = options;
      
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);
      
      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
      cookieString += `; expires=${expiryDate.toUTCString()}`;
      cookieString += `; path=${path}`;
      
      if (domain) {
        cookieString += `; domain=${domain}`;
      }
      
      if (secure) {
        cookieString += `; secure`;
      }
      
      cookieString += `; samesite=${sameSite}`;
      
      document.cookie = cookieString;
    } catch (error) {
      console.error('쿠키 설정 중 오류 발생:', error);
    }
  },

  /**
   * 쿠키 값을 가져옵니다.
   */
  get: (name: string): string | undefined => {
    try {
      const nameEQ = `${encodeURIComponent(name)}=`;
      const cookies = document.cookie.split(';');
      
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
          return decodeURIComponent(cookie.substring(nameEQ.length));
        }
      }
      
      return undefined;
    } catch (error) {
      console.error('쿠키 읽기 중 오류 발생:', error);
      return undefined;
    }
  },

  /**
   * 쿠키를 삭제합니다.
   */
  remove: (name: string, path: string = '/', domain?: string): void => {
    try {
      let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
      
      if (domain) {
        cookieString += `; domain=${domain}`;
      }
      
      document.cookie = cookieString;
    } catch (error) {
      console.error('쿠키 삭제 중 오류 발생:', error);
    }
  },

  /**
   * 모든 쿠키 이름을 가져옵니다.
   */
  getAll: (): Record<string, string> => {
    try {
      const result: Record<string, string> = {};
      const cookies = document.cookie.split(';');
      
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie) {
          const [name, value] = cookie.split('=').map(part => decodeURIComponent(part.trim()));
          if (name) {
            result[name] = value || '';
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('쿠키 목록 가져오기 중 오류 발생:', error);
      return {};
    }
  },

  /**
   * 쿠키가 존재하는지 확인합니다.
   */
  exists: (name: string): boolean => {
    return cookies.get(name) !== undefined;
  },

  /**
   * 쿠키가 활성화되어 있는지 확인합니다.
   */
  isEnabled: (): boolean => {
    try {
      const testKey = '__cookie_test__';
      const testValue = 'test';
      
      cookies.set(testKey, testValue, { days: 1 });
      const enabled = cookies.get(testKey) === testValue;
      cookies.remove(testKey);
      
      return enabled;
    } catch (e) {
      return false;
    }
  },
};

/**
 * 인 메모리 캐싱 유틸리티
 */
export class MemoryStorage<T = any> {
  private storage: Map<string, { value: T; expires?: number }>;

  constructor() {
    this.storage = new Map();
  }

  /**
   * 캐시에 데이터를 저장합니다.
   * @param key 캐시 키
   * @param value 저장할 값
   * @param ttl 유효 기간(밀리초), 설정하지 않으면 만료되지 않음
   */
  set(key: string, value: T, ttl?: number): void {
    const item = {
      value,
      expires: ttl ? Date.now() + ttl : undefined,
    };
    this.storage.set(key, item);
  }

  /**
   * 캐시에서 데이터를 가져옵니다.
   * @param key 캐시 키
   * @returns 저장된 값 또는 만료되었거나 없는 경우 undefined
   */
  get(key: string): T | undefined {
    const item = this.storage.get(key);
    
    if (!item) {
      return undefined;
    }
    
    // 만료 시간이 설정되었고, 현재 시간이 만료 시간을 지났는지 확인
    if (item.expires && Date.now() > item.expires) {
      this.storage.delete(key);
      return undefined;
    }
    
    return item.value;
  }

  /**
   * 캐시에서 항목을 삭제합니다.
   */
  remove(key: string): boolean {
    return this.storage.delete(key);
  }

  /**
   * 캐시를 완전히 비웁니다.
   */
  clear(): void {
    this.storage.clear();
  }

  /**
   * 캐시에 있는 모든 키를 반환합니다.
   */
  keys(): string[] {
    return Array.from(this.storage.keys());
  }

  /**
   * 캐시에 저장된 항목 수를 반환합니다.
   */
  size(): number {
    return this.storage.size;
  }

  /**
   * 만료된 모든 항목을 제거합니다.
   * @returns 제거된 항목의 개수
   */
  cleanup(): number {
    const now = Date.now();
    let count = 0;
    
    this.storage.forEach((item, key) => {
      if (item.expires && now > item.expires) {
        this.storage.delete(key);
        count++;
      }
    });
    
    return count;
  }
}


/**
 * IndexedDB를 간단하게 사용할 수 있는 유틸리티
 */
export class IndexedDBStorage {
  private dbName: string;
  private dbVersion: number;
  private storeName: string;
  private db: IDBDatabase | null = null;

  constructor(dbName: string, storeName: string, dbVersion: number = 1) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.dbVersion = dbVersion;
  }

  /**
   * IndexedDB 데이터베이스를 엽니다.
   */
  async open(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(this.dbName, this.dbVersion);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // 스토어가 없을 경우 생성
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: 'id' });
          }
        };
        
        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          resolve(true);
        };
        
        request.onerror = (event) => {
          console.error('IndexedDB 열기 중 오류 발생:', (event.target as IDBOpenDBRequest).error);
          reject(new Error('IndexedDB를 열 수 없습니다'));
        };
      } catch (error) {
        console.error('IndexedDB 초기화 중 오류 발생:', error);
        reject(error);
      }
    });
  }

  /**
   * 데이터를 저장합니다.
   */
  async set(key: string, value: any): Promise<void> {
    if (!this.db) {
      await this.open();
    }
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        
        const request = store.put({ id: key, value });
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 데이터를 가져옵니다.
   */
  async get<T = any>(key: string): Promise<T | undefined> {
    if (!this.db) {
      await this.open();
    }
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        
        const request = store.get(key);
        
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? result.value : undefined);
        };
        
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 데이터를 삭제합니다.
   */
  async remove(key: string): Promise<void> {
    if (!this.db) {
      await this.open();
    }
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        
        const request = store.delete(key);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 모든 데이터를 삭제합니다.
   */
  async clear(): Promise<void> {
    if (!this.db) {
      await this.open();
    }
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        
        const request = store.clear();
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 모든 키를 가져옵니다.
   */
  async keys(): Promise<string[]> {
    if (!this.db) {
      await this.open();
    }
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAllKeys();
        
        request.onsuccess = () => {
          resolve(request.result.map(key => key.toString()));
        };
        
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 데이터베이스를 닫습니다.
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * IndexedDB가 지원되는지 확인합니다.
   */
  static isSupported(): boolean {
    return !!window.indexedDB;
  }
}

/**
 * 안전한 스토리지 접근을 위한 유틸리티
 * 서버 사이드 렌더링(SSR) 환경에서도 오류 없이 동작합니다.
 */
export const safeStorage = {
  /**
   * 브라우저 환경인지 확인합니다.
   */
  isBrowser: (): boolean => {
    return typeof window !== 'undefined';
  },

  /**
   * 안전하게 로컬 스토리지에 접근합니다.
   */
  localStorage: {
    get: <T = any>(key: string, defaultValue?: T): T | undefined => {
      if (!safeStorage.isBrowser()) {
        return defaultValue;
      }
      return localStorage.get<T>(key, defaultValue);
    },
    
    set: (key: string, value: any): void => {
      if (!safeStorage.isBrowser()) {
        return;
      }
      localStorage.set(key, value);
    },
    
    remove: (key: string): void => {
      if (!safeStorage.isBrowser()) {
        return;
      }
      localStorage.remove(key);
    },
    
    clear: (): void => {
      if (!safeStorage.isBrowser()) {
        return;
      }
      localStorage.clear();
    }
  },

  /**
   * 안전하게 세션 스토리지에 접근합니다.
   */
  sessionStorage: {
    get: <T = any>(key: string, defaultValue?: T): T | undefined => {
      if (!safeStorage.isBrowser()) {
        return defaultValue;
      }
      return sessionStorage.get<T>(key, defaultValue);
    },
    
    set: (key: string, value: any): void => {
      if (!safeStorage.isBrowser()) {
        return;
      }
      sessionStorage.set(key, value);
    },
    
    remove: (key: string): void => {
      if (!safeStorage.isBrowser()) {
        return;
      }
      sessionStorage.remove(key);
    },
    
    clear: (): void => {
      if (!safeStorage.isBrowser()) {
        return;
      }
      sessionStorage.clear();
    }
  },

  /**
   * 안전하게 쿠키에 접근합니다.
   */
  cookies: {
    get: (name: string): string | undefined => {
      if (!safeStorage.isBrowser()) {
        return undefined;
      }
      return cookies.get(name);
    },
    
    set: (name: string, value: string, options?: { days?: number; path?: string; domain?: string; secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' }): void => {
      if (!safeStorage.isBrowser()) {
        return;
      }
      cookies.set(name, value, options);
    },
    
    remove: (name: string, path?: string, domain?: string): void => {
      if (!safeStorage.isBrowser()) {
        return;
      }
      cookies.remove(name, path, domain);
    }
  }
};
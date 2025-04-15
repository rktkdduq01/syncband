/**
 * 다양한 형식 변환 및 포맷팅 유틸리티 함수
 */

/**
 * 숫자에 3자리마다 콤마를 추가합니다.
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * 금액을 원화 형식으로 포맷팅합니다.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount);
};

/**
 * 금액을 달러 형식으로 포맷팅합니다.
 */
export const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷팅합니다.
 */
export const formatDateDot = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅합니다.
 */
export const formatDateHyphen = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 날짜를 YYYY년 MM월 DD일 형식으로 포맷팅합니다.
 */
export const formatDateKorean = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * 날짜와 시간을 YYYY-MM-DD HH:MM:SS 형식으로 포맷팅합니다.
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 시간을 HH:MM:SS 형식으로 포맷팅합니다.
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * 시간을 HH:MM 형식으로 포맷팅합니다.
 */
export const formatTimeShort = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * 시간을 AM/PM 형식으로 포맷팅합니다.
 */
export const formatTimeAMPM = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? '오후' : '오전';
  hours = hours % 12;
  hours = hours || 12; // 0시는 12시로 표시
  return `${ampm} ${hours}:${minutes}`;
};

/**
 * 초 단위 시간을 MM:SS 형식으로 포맷팅합니다.
 */
export const formatDuration = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

/**
 * 밀리초 단위 시간을 MM:SS.mmm 형식으로 포맷팅합니다.
 */
export const formatDurationMilliseconds = (ms: number): string => {
  const seconds = ms / 1000;
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  const millisec = Math.floor((seconds - Math.floor(seconds)) * 1000);
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(millisec).padStart(3, '0')}`;
};

/**
 * 밀리초 단위 시간을 HH:MM:SS 형식으로 포맷팅합니다.
 */
export const formatMillisecondsToTime = (ms: number): string => {
  const seconds = ms / 1000;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return [
    hours > 0 ? String(hours).padStart(2, '0') : '',
    String(minutes).padStart(2, '0'),
    String(secs).padStart(2, '0')
  ].filter(Boolean).join(':');
};

/**
 * 파일 크기를 읽기 쉬운 형식으로 변환합니다.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * 전화번호를 포맷팅합니다. (예: 010-1234-5678)
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  
  return phoneNumber;
};

/**
 * 주민등록번호 형식으로 포맷팅합니다. (예: 123456-1******)
 */
export const formatResidentNumber = (number: string, maskEnd: boolean = true): string => {
  const cleaned = number.replace(/\D/g, '');
  
  if (cleaned.length < 7) {
    return cleaned;
  }
  
  if (maskEnd) {
    return `${cleaned.slice(0, 6)}-${cleaned.slice(6, 7)}******`;
  } else {
    return `${cleaned.slice(0, 6)}-${cleaned.slice(6, 13)}`;
  }
};

/**
 * 신용카드 번호 형식으로 포맷팅합니다. (예: 1234-5678-9012-3456)
 */
export const formatCreditCardNumber = (cardNumber: string, maskMiddle: boolean = true): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 16) {
    return cleaned;
  }
  
  if (maskMiddle) {
    return `${cleaned.slice(0, 4)}-****-****-${cleaned.slice(12, 16)}`;
  } else {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}`;
  }
};

/**
 * 이메일 주소에서 일부를 마스킹합니다. (예: j***@example.com)
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) {
    return email;
  }
  
  const [username, domain] = email.split('@');
  let maskedUsername = '';
  
  if (username.length <= 2) {
    maskedUsername = username.charAt(0) + '*'.repeat(username.length - 1);
  } else {
    maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  }
  
  return `${maskedUsername}@${domain}`;
};

/**
 * 이름의 가운데를 마스킹합니다. (예: 홍*동)
 */
export const maskName = (name: string): string => {
  if (!name || name.length <= 2) {
    return name;
  }
  
  const firstChar = name.charAt(0);
  const lastChar = name.charAt(name.length - 1);
  const maskedMiddle = '*'.repeat(name.length - 2);
  
  return `${firstChar}${maskedMiddle}${lastChar}`;
};

/**
 * 숫자를 한글 서수로 변환합니다. (예: 1 -> 첫 번째)
 */
export const formatOrdinalKorean = (number: number): string => {
  const ordinals = ['첫', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
  
  if (number >= 1 && number <= 10) {
    return `${ordinals[number - 1]} 번째`;
  }
  
  return `${number}번째`;
};

/**
 * 숫자를 영어 서수로 변환합니다. (예: 1 -> 1st)
 */
export const formatOrdinalEnglish = (number: number): string => {
  const j = number % 10;
  const k = number % 100;
  
  if (j === 1 && k !== 11) {
    return `${number}st`;
  }
  if (j === 2 && k !== 12) {
    return `${number}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${number}rd`;
  }
  
  return `${number}th`;
};

/**
 * URL에서 쿼리 파라미터를 객체로 변환합니다.
 */
export const parseQueryParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const queryString = url.split('?')[1];
  
  if (!queryString) {
    return params;
  }
  
  const pairs = queryString.split('&');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  }
  
  return params;
};

/**
 * 객체를 쿼리 문자열로 변환합니다.
 */
export const objectToQueryString = (obj: Record<string, any>): string => {
  return Object.entries(obj)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
};

/**
 * 문자열의 첫 글자를 대문자로 변환합니다.
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 카멜 케이스를 스페이스로 구분된 단어로 변환합니다.
 * 예: 'camelCase' -> 'Camel Case'
 */
export const camelCaseToWords = (str: string): string => {
  const result = str.replace(/([A-Z])/g, ' $1');
  return capitalizeFirstLetter(result);
};

/**
 * 숫자를 한국어 조사와 함께 사용하기 위한 포맷팅 함수입니다.
 * 예: formatWithPostposition(1, '개', '이', '가') -> '1개가'
 */
export const formatWithPostposition = (
  number: number,
  noun: string,
  postposition1: string,
  postposition2: string
): string => {
  // 한국어 조사 선택 (받침에 따라 다름)
  const lastChar = noun.charCodeAt(noun.length - 1);
  const hasJongseong = (lastChar - 0xAC00) % 28 > 0;
  const postposition = hasJongseong ? postposition1 : postposition2;
  
  return `${number}${noun}${postposition}`;
};

/**
 * 바이트 단위 숫자를 적절한 단위로 변환합니다. (bit, byte, KB, MB, GB 등)
 */
export const formatByteUnit = (bytes: number, useBits: boolean = false): string => {
  if (bytes === 0) return useBits ? '0 bit' : '0 byte';
  
  const multiplier = useBits ? 8 : 1;
  const value = bytes * multiplier;
  const units = useBits 
    ? ['bit', 'Kbit', 'Mbit', 'Gbit', 'Tbit', 'Pbit'] 
    : ['byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(value) / Math.log(1024));
  const unit = units[Math.min(i, units.length - 1)];
  
  if (i === 0) {
    return `${value} ${unit}`;
  }
  
  return `${(value / Math.pow(1024, i)).toFixed(2)} ${unit}`;
};

/**
 * RGB 색상을 HEX 색상 코드로 변환합니다.
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b]
    .map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0'))
    .join('');
};

/**
 * HEX 색상 코드를 RGB 값으로 변환합니다.
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
};

/**
 * 숫자를 지정된 자릿수의 소수점으로 포맷팅합니다.
 */
export const formatDecimal = (value: number, decimalPlaces: number = 2): string => {
  return value.toFixed(decimalPlaces);
};

/**
 * 숫자를 백분율로 포맷팅합니다.
 */
export const formatPercent = (value: number, decimalPlaces: number = 0): string => {
  return `${(value * 100).toFixed(decimalPlaces)}%`;
};

/**
 * JSON 문자열을 포맷팅하여 가독성 있게 만듭니다.
 */
export const formatJson = (json: string): string => {
  try {
    const object = JSON.parse(json);
    return JSON.stringify(object, null, 2);
  } catch (error) {
    return json;
  }
};

/**
 * HTML 태그를 이스케이프 처리합니다.
 */
export const escapeHtml = (html: string): string => {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * 이스케이프된 HTML 태그를 원래대로 되돌립니다.
 */
export const unescapeHtml = (html: string): string => {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
};

/**
 * 문자열을 지정된 길이로 자르고 말줄임표를 추가합니다.
 */
export const truncateString = (str: string, maxLength: number, ellipsis: string = '...'): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + ellipsis;
};

/**
 * URL에 프로토콜이 없는 경우 프로토콜을 추가합니다.
 */
export const ensureProtocol = (url: string, protocol: string = 'https'): string => {
  if (!url) return url;
  return url.startsWith('http') ? url : `${protocol}://${url}`;
};

/**
 * 전화번호를 국제 표준 형식으로 포맷팅합니다. (예: +82 10-1234-5678)
 */
export const formatInternationalPhoneNumber = (phoneNumber: string, countryCode: string = '82'): string => {
  // 국내 전화번호 형식에서 앞의 0 제거
  const cleaned = phoneNumber.replace(/\D/g, '').replace(/^0+/, '');
  
  if (cleaned.length >= 8) {
    // 모바일 번호 (10자리 또는 11자리)
    if (cleaned.length >= 9) {
      return `+${countryCode} ${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    // 지역 번호 (8자리)
    return `+${countryCode} ${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  
  return phoneNumber;
};

/**
 * 문자열을 URL 친화적인 슬러그로 변환합니다.
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 특수문자 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로 변환
    .replace(/--+/g, '-'); // 중복 하이픈 제거
};

/**
 * 단어의 복수형을 생성합니다. (영어 전용)
 */
export const pluralize = (word: string, count: number, plural?: string): string => {
  if (count === 1) {
    return word;
  }
  
  if (plural) {
    return plural;
  }
  
  // 간단한 복수형 규칙
  if (word.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(word.charAt(word.length - 2))) {
    return word.slice(0, -1) + 'ies';
  } else if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') || word.endsWith('ch') || word.endsWith('sh')) {
    return word + 'es';
  } else {
    return word + 's';
  }
};

/**
 * 시간 간격을 읽기 쉬운 형식으로 포맷팅합니다.
 */
export const formatTimeInterval = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}초`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}분 ${remainingSeconds}초` : `${minutes}분`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}일 ${remainingHours}시간` : `${days}일`;
};

/**
 * 객체의 특정 필드만 포함하는 새 객체를 생성합니다.
 */
export const pickObjectFields = <T extends object, K extends keyof T>(
  obj: T,
  fields: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  
  fields.forEach(field => {
    if (Object.prototype.hasOwnProperty.call(obj, field)) {
      result[field] = obj[field];
    }
  });
  
  return result;
};

/**
 * 객체의 특정 필드를 제외한 새 객체를 생성합니다.
 */
export const omitObjectFields = <T extends object, K extends keyof T>(
    obj: T,
    fields: K[]
  ): Omit<T, K> => {
    const result = { ...obj } as any;
    
    fields.forEach(field => {
      delete result[field];
    });
    
    return result as Omit<T, K>;
  };

/**
 * base64 문자열을 Blob으로 변환합니다.
 */
export const base64ToBlob = (base64: string, contentType: string = '', sliceSize: number = 512): Blob => {
  const byteCharacters = atob(base64.split(',')[1] || base64);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: contentType });
};

/**
 * base64 문자열을 File 객체로 변환합니다.
 */
export const base64ToFile = (base64: string, filename: string, contentType: string = ''): File => {
  const blob = base64ToBlob(base64, contentType);
  return new File([blob], filename, { type: contentType || blob.type });
};

/**
 * Blob 또는 File 객체를 base64 문자열로 변환합니다.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * 객체를 정렬된 키의 순서대로 직렬화합니다.
 */
export const stringifySortedObject = (obj: Record<string, any>): string => {
  const allKeys = Object.keys(obj).sort();
  const sortedObj: Record<string, any> = {};
  
  allKeys.forEach(key => {
    sortedObj[key] = obj[key];
  });
  
  return JSON.stringify(sortedObj);
};
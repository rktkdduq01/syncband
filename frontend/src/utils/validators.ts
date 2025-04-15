/**
 * 다양한 유효성 검사를 위한 유틸리티 함수들
 */

/**
 * 값이 비어있는지 확인합니다.
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
};

/**
 * 이메일 주소가 유효한지 확인합니다.
 */
export const isValidEmail = (email: string): boolean => {
  if (isEmpty(email)) {
    return false;
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * 비밀번호가 유효한지 확인합니다.
 * 최소 8자, 알파벳 대소문자, 숫자, 특수문자 포함
 */
export const isValidPassword = (password: string): boolean => {
  if (isEmpty(password)) {
    return false;
  }
  
  // 최소 8자, 최대 100자
  if (password.length < 8 || password.length > 100) {
    return false;
  }
  
  // 알파벳 대소문자, 숫자, 특수문자 각각 1개 이상 포함
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonAlphas = /\W/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumbers && hasNonAlphas;
};

/**
 * 비밀번호 강도를 평가합니다. (0-4: 매우 약함-매우 강함)
 */
export const getPasswordStrength = (password: string): number => {
  let strength = 0;
  
  if (isEmpty(password)) {
    return strength;
  }
  
  // 길이 점수
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // 복잡성 점수
  if (/[A-Z]/.test(password)) strength += 0.5;
  if (/[a-z]/.test(password)) strength += 0.5;
  if (/\d/.test(password)) strength += 0.5;
  if (/\W/.test(password)) strength += 0.5;
  
  // 다양성 점수
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.7) strength += 1;
  
  return Math.min(4, Math.floor(strength));
};

/**
 * 휴대폰 번호가 유효한지 확인합니다.
 * 한국 휴대폰 번호 형식에 맞는지 확인 (010, 011 등)
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  if (isEmpty(phoneNumber)) {
    return false;
  }
  
  // 숫자와 하이픈만 허용하고, 다른 문자는 모두 제거
  const cleaned = phoneNumber.replace(/[^0-9-]/g, '');
  
  // 하이픈 있는 형태 (01X-XXXX-XXXX)와 없는 형태(01XXXXXXXXX) 모두 허용
  const regex1 = /^01[016789]-?\d{3,4}-?\d{4}$/;
  return regex1.test(cleaned);
};

/**
 * 한국 주민등록번호가 유효한지 확인합니다.
 */
export const isValidResidentRegistrationNumber = (rrn: string): boolean => {
  if (isEmpty(rrn)) {
    return false;
  }
  
  // 숫자와 하이픈만 허용하고, 다른 문자는 모두 제거
  const cleaned = rrn.replace(/[^0-9-]/g, '');
  
  // 주민등록번호 형식 검사 (XXXXXX-XXXXXXX)
  if (!/^\d{6}-?\d{7}$/.test(cleaned)) {
    return false;
  }
  
  const numbers = cleaned.replace('-', '').split('').map(Number);
  
  // 주민등록번호 검증 알고리즘
  const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  let sum = 0;
  
  for (let i = 0; i < 12; i++) {
    sum += numbers[i] * multipliers[i];
  }
  
  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === numbers[12];
};

/**
 * URL이 유효한지 확인합니다.
 */
export const isValidUrl = (url: string): boolean => {
  if (isEmpty(url)) {
    return false;
  }
  
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (e) {
    return false;
  }
};

/**
 * IP 주소(v4)가 유효한지 확인합니다.
 */
export const isValidIPv4 = (ip: string): boolean => {
  if (isEmpty(ip)) {
    return false;
  }
  
  const parts = ip.split('.');
  if (parts.length !== 4) {
    return false;
  }
  
  return parts.every(part => {
    const num = parseInt(part, 10);
    return String(num) === part && num >= 0 && num <= 255;
  });
};

/**
 * 날짜가 유효한지 확인합니다.
 * format: 'YYYY-MM-DD', 'YYYY/MM/DD', 'YYYY.MM.DD'
 */
export const isValidDate = (dateStr: string): boolean => {
  if (isEmpty(dateStr)) {
    return false;
  }
  
  // 날짜 형식을 통일 (YYYY-MM-DD)
  const normalizedDate = dateStr.replace(/[./]/g, '-');
  
  // 기본 형식 검사
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    return false;
  }
  
  // 날짜 객체로 변환하여 유효성 검사
  const date = new Date(normalizedDate);
  if (isNaN(date.getTime())) {
    return false;
  }
  
  // 입력된 년/월/일이 실제로 일치하는지 확인 (예: 2월 30일 같은 잘못된 날짜 검출)
  const [year, month, day] = normalizedDate.split('-').map(Number);
  
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};

/**
 * 신용카드 번호가 유효한지 확인합니다. (Luhn 알고리즘 사용)
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  if (isEmpty(cardNumber)) {
    return false;
  }
  
  // 숫자만 추출
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // 카드 번호 길이 검사 (보통 13-19자리)
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }
  
  // Luhn 알고리즘을 사용하여 검증
  let sum = 0;
  let double = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    
    if (double) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    double = !double;
  }
  
  return sum % 10 === 0;
};

/**
 * 년도가 유효한지 확인합니다. (1900년 이후부터 현재까지)
 */
export const isValidYear = (year: number | string): boolean => {
  const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
  const currentYear = new Date().getFullYear();
  
  return !isNaN(yearNum) && yearNum >= 1900 && yearNum <= currentYear;
};

/**
 * 나이가 유효한지 확인합니다.
 */
export const isValidAge = (age: number | string, minAge = 0, maxAge = 150): boolean => {
  const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;
  
  return !isNaN(ageNum) && ageNum >= minAge && ageNum <= maxAge;
};

/**
 * 값이 숫자인지 확인합니다.
 */
export const isNumber = (value: any): boolean => {
  if (isEmpty(value)) {
    return false;
  }
  
  return !isNaN(Number(value));
};

/**
 * 값이 정수인지 확인합니다.
 */
export const isInteger = (value: any): boolean => {
  if (!isNumber(value)) {
    return false;
  }
  
  const num = Number(value);
  return Math.floor(num) === num;
};

/**
 * 값이 특정 범위 내에 있는지 확인합니다.
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  if (!isNumber(value)) {
    return false;
  }
  
  return value >= min && value <= max;
};

/**
 * 문자열의 길이가 유효한지 확인합니다.
 */
export const isValidLength = (value: string, minLength: number, maxLength: number): boolean => {
  if (isEmpty(value)) {
    return false;
  }
  
  return value.length >= minLength && value.length <= maxLength;
};

/**
 * 문자열에 특정 문자셋만 포함되어 있는지 확인합니다.
 */
export const containsOnly = (value: string, allowedChars: string): boolean => {
  if (isEmpty(value)) {
    return false;
  }
  
  const regex = new RegExp(`^[${allowedChars}]+$`);
  return regex.test(value);
};

/**
 * 한글로만 구성되어 있는지 확인합니다.
 */
export const isKoreanOnly = (value: string): boolean => {
  if (isEmpty(value)) {
    return false;
  }
  
  const regex = /^[가-힣\s]+$/;
  return regex.test(value);
};

/**
 * 영문으로만 구성되어 있는지 확인합니다.
 */
export const isEnglishOnly = (value: string): boolean => {
  if (isEmpty(value)) {
    return false;
  }
  
  const regex = /^[a-zA-Z\s]+$/;
  return regex.test(value);
};

/**
 * 영문과 숫자로만 구성되어 있는지 확인합니다.
 */
export const isAlphanumeric = (value: string): boolean => {
  if (isEmpty(value)) {
    return false;
  }
  
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(value);
};

/**
 * 사용자 이름이 유효한지 확인합니다.
 * 알파벳, 숫자, 밑줄(_), 하이픈(-) 허용
 */
export const isValidUsername = (username: string, minLength = 3, maxLength = 20): boolean => {
  if (isEmpty(username)) {
    return false;
  }
  
  // 알파벳, 숫자, 밑줄(_), 하이픈(-)만 허용
  const regex = /^[a-zA-Z0-9_-]+$/;
  
  return (
    username.length >= minLength &&
    username.length <= maxLength &&
    regex.test(username)
  );
};

/**
 * 문자열에 공백이 없는지 확인합니다.
 */
export const hasNoWhitespace = (value: string): boolean => {
  if (isEmpty(value)) {
    return false;
  }
  
  return !/\s/.test(value);
};

/**
 * 파일 확장자가 허용된 목록에 있는지 확인합니다.
 */
export const isValidFileExtension = (filename: string, allowedExtensions: string[]): boolean => {
  if (isEmpty(filename)) {
    return false;
  }
  
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (!extension) {
    return false;
  }
  
  return allowedExtensions.includes(extension);
};

/**
 * 파일 크기가 제한 내에 있는지 확인합니다.
 */
export const isValidFileSize = (fileSize: number, maxSizeInMB: number): boolean => {
  if (!isNumber(fileSize)) {
    return false;
  }
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return fileSize <= maxSizeInBytes && fileSize > 0;
};

/**
 * 이미지 파일인지 확인합니다.
 */
export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
  return isValidFileExtension(filename, imageExtensions);
};

/**
 * 오디오 파일인지 확인합니다.
 */
export const isAudioFile = (filename: string): boolean => {
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];
  return isValidFileExtension(filename, audioExtensions);
};

/**
 * 비디오 파일인지 확인합니다.
 */
export const isVideoFile = (filename: string): boolean => {
  const videoExtensions = ['mp4', 'webm', 'avi', 'mov', 'wmv', 'flv', 'mkv'];
  return isValidFileExtension(filename, videoExtensions);
};

/**
 * HEX 색상 코드가 유효한지 확인합니다.
 */
export const isValidHexColor = (color: string): boolean => {
  if (isEmpty(color)) {
    return false;
  }
  
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

/**
 * RGB 색상이 유효한지 확인합니다.
 */
export const isValidRgbColor = (r: number, g: number, b: number): boolean => {
  return (
    isInteger(r) && isInRange(r, 0, 255) &&
    isInteger(g) && isInRange(g, 0, 255) &&
    isInteger(b) && isInRange(b, 0, 255)
  );
};

/**
 * RGB 색상 문자열이 유효한지 확인합니다. (예: "rgb(255, 255, 255)")
 */
export const isValidRgbString = (color: string): boolean => {
  if (isEmpty(color)) {
    return false;
  }
  
  const regex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  const match = color.match(regex);
  
  if (!match) {
    return false;
  }
  
  const [, r, g, b] = match;
  return isValidRgbColor(Number(r), Number(g), Number(b));
};

/**
 * 유효한 쿠키 이름인지 확인합니다.
 */
export const isValidCookieName = (name: string): boolean => {
  if (isEmpty(name)) {
    return false;
  }
  
  // 쿠키 이름에 허용되지 않는 특수문자 확인
  return !/[=,; \t\r\n\v\f]/.test(name);
};

/**
 * Base64 문자열인지 확인합니다.
 */
export const isBase64 = (str: string): boolean => {
  if (isEmpty(str)) {
    return false;
  }
  
  // 기본 base64 패턴 확인
  const regex = /^[A-Za-z0-9+/]*={0,2}$/;
  
  // 길이가 4의 배수인지 확인
  return regex.test(str) && str.length % 4 === 0;
};

/**
 * JSON 문자열이 유효한지 확인합니다.
 */
export const isValidJson = (str: string): boolean => {
  if (isEmpty(str)) {
    return false;
  }
  
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * 비어 있지 않은 배열인지 확인합니다.
 */
export const isNonEmptyArray = (arr: any): boolean => {
  return Array.isArray(arr) && arr.length > 0;
};

/**
 * 특정 필드가 객체에 존재하는지 확인합니다.
 */
export const hasProperty = (obj: any, propertyName: string): boolean => {
  return obj !== null && typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, propertyName);
};

/**
 * 객체의 모든 필드가 주어진 타입인지 확인합니다.
 */
export const allPropertiesOfType = (obj: any, type: string): boolean => {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  
  return Object.values(obj).every(value => typeof value === type);
};

/**
 * 배열의 모든 요소가 고유한지 확인합니다.
 */
export const allElementsUnique = <T>(arr: T[]): boolean => {
  if (!Array.isArray(arr)) {
    return false;
  }
  
  return new Set(arr).size === arr.length;
};

/**
 * 문자열이 특정 문자로 시작하는지 확인합니다.
 */
export const startsWith = (str: string, prefix: string): boolean => {
  if (isEmpty(str) || isEmpty(prefix)) {
    return false;
  }
  
  return str.startsWith(prefix);
};

/**
 * 문자열이 특정 문자로 끝나는지 확인합니다.
 */
export const endsWith = (str: string, suffix: string): boolean => {
  if (isEmpty(str) || isEmpty(suffix)) {
    return false;
  }
  
  return str.endsWith(suffix);
};

/**
 * 문자열에 특정 단어가 포함되어 있는지 확인합니다.
 */
export const containsText = (str: string, searchText: string): boolean => {
  if (isEmpty(str) || isEmpty(searchText)) {
    return false;
  }
  
  return str.includes(searchText);
};

/**
 * 두 값이 동일한지 확인합니다.
 */
export const isEqual = (value1: any, value2: any): boolean => {
  // 기본 비교
  if (value1 === value2) {
    return true;
  }
  
  // null과 undefined 처리
  if (value1 === null || value2 === null || value1 === undefined || value2 === undefined) {
    return false;
  }
  
  // 타입이 다르면 다른 값으로 간주
  if (typeof value1 !== typeof value2) {
    return false;
  }
  
  // 배열 비교
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) {
      return false;
    }
    
    for (let i = 0; i < value1.length; i++) {
      if (!isEqual(value1[i], value2[i])) {
        return false;
      }
    }
    
    return true;
  }
  
  // 객체 비교
  if (typeof value1 === 'object') {
    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);
    
    if (keys1.length !== keys2.length) {
      return false;
    }
    
    for (const key of keys1) {
      if (!isEqual(value1[key], value2[key])) {
        return false;
      }
    }
    
    return true;
  }
  
  return false;
};

/**
 * 유효한 북미 전화번호인지 확인합니다.
 */
export const isValidNAPhoneNumber = (phoneNumber: string): boolean => {
  if (isEmpty(phoneNumber)) {
    return false;
  }
  
  // 숫자와 하이픈만 허용하고, 다른 문자는 모두 제거
  const cleaned = phoneNumber.replace(/[^0-9-]/g, '');
  
  // 북미 전화번호 형식 (XXX-XXX-XXXX)
  return /^\d{3}-?\d{3}-?\d{4}$/.test(cleaned);
};

/**
 * 유효한 우편번호인지 확인합니다. (한국 5자리)
 */
export const isValidPostalCode = (postalCode: string): boolean => {
  if (isEmpty(postalCode)) {
    return false;
  }
  
  // 숫자만 추출
  const cleaned = postalCode.replace(/\D/g, '');
  
  // 한국 우편번호는 5자리
  return cleaned.length === 5 && isInteger(cleaned);
};

/**
 * 유효한 ISBN 번호인지 확인합니다.
 */
export const isValidISBN = (isbn: string): boolean => {
  if (isEmpty(isbn)) {
    return false;
  }
  
  // 하이픈 제거
  const cleaned = isbn.replace(/-/g, '');
  
  // ISBN-10
  if (cleaned.length === 10) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      const digit = parseInt(cleaned[i], 10);
      if (isNaN(digit)) return false;
      sum += digit * (10 - i);
    }
    
    // 마지막 문자는 숫자 또는 'X'
    const last = cleaned[9].toUpperCase();
    sum += (last === 'X') ? 10 : parseInt(last, 10);
    
    return sum % 11 === 0;
  }
  
  // ISBN-13
  if (cleaned.length === 13) {
    let sum = 0;
    for (let i = 0; i < 13; i++) {
      const digit = parseInt(cleaned[i], 10);
      if (isNaN(digit)) return false;
      sum += digit * (i % 2 === 0 ? 1 : 3);
    }
    
    return sum % 10 === 0;
  }
  
  return false;
};

/**
 * 객체가 특정 필드들을 모두 가지고 있는지 확인합니다.
 */
export const hasRequiredFields = (obj: any, requiredFields: string[]): boolean => {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  
  return requiredFields.every(field => {
    const hasField = field in obj;
    const isNotEmpty = obj[field] !== null && obj[field] !== undefined && obj[field] !== '';
    return hasField && isNotEmpty;
  });
};

/**
 * 객체가 동일한 구조를 가지고 있는지 확인합니다. (값은 확인하지 않음)
 */
export const hasSameStructure = (obj1: any, obj2: any): boolean => {
  if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }
  
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  for (let i = 0; i < keys1.length; i++) {
    const key = keys1[i];
    
    // 키가 다른 경우
    if (key !== keys2[i]) {
      return false;
    }
    
    // 중첩된 객체가 있는 경우 재귀적으로 확인
    if (typeof obj1[key] === 'object' && obj1[key] !== null && 
        typeof obj2[key] === 'object' && obj2[key] !== null) {
      if (!hasSameStructure(obj1[key], obj2[key])) {
        return false;
      }
    }
  }
  
  return true;
};

/**
 * 여러 검증을 결합하여 동시에 확인합니다.
 */
export const validateAll = (value: any, validators: ((value: any) => boolean)[]): boolean => {
  return validators.every(validator => validator(value));
};

/**
 * 여러 검증 중 하나라도 통과하는지 확인합니다.
 */
export const validateAny = (value: any, validators: ((value: any) => boolean)[]): boolean => {
  return validators.some(validator => validator(value));
};

/**
 * 유효한 한국 사업자등록번호인지 확인합니다.
 */
export const isValidBusinessNumber = (bizNum: string): boolean => {
  if (isEmpty(bizNum)) {
    return false;
  }
  
  // 숫자만 추출
  const cleaned = bizNum.replace(/[^0-9]/g, '');
  
  // 사업자등록번호는 10자리
  if (cleaned.length !== 10) {
    return false;
  }
  
  // 사업자등록번호 검증 알고리즘
  const multipliers = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    sum += (parseInt(cleaned[i], 10) * multipliers[i]);
  }
  
  sum += parseInt(cleaned[8], 10) * 5 / 10;
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(cleaned[9], 10);
};

/**
 * 유효한 한국 법인등록번호인지 확인합니다.
 */
export const isValidCorporateNumber = (corpNum: string): boolean => {
  if (isEmpty(corpNum)) {
    return false;
  }
  
  // 숫자와 하이픈만 추출
  const cleaned = corpNum.replace(/[^0-9-]/g, '');
  
  // 하이픈 제거
  const digits = cleaned.replace(/-/g, '');
  
  // 법인등록번호는 13자리
  if (digits.length !== 13) {
    return false;
  }
  
  // 법인등록번호 검증 알고리즘
  const multipliers = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  
  for (let i = 0; i < 12; i++) {
    let temp = parseInt(digits[i], 10) * multipliers[i];
    if (temp >= 10) {
      temp = Math.floor(temp / 10) + (temp % 10);
    }
    sum += temp;
  }
  
  const remainder = sum % 10;
  const checkDigit = remainder === 0 ? 0 : 10 - remainder;
  return checkDigit === parseInt(digits[12], 10);
};

/**
 * 모든 검증 결과와 에러 메시지를 반환합니다.
 */
export const validateWithMessages = <T>(
  value: T, 
  validations: Array<{
    validator: (value: T) => boolean;
    message: string;
  }>
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  for (const { validator, message } of validations) {
    if (!validator(value)) {
      errors.push(message);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 유효한 이메일인지 확인하고, 이메일이 허용된 도메인에 속하는지 확인합니다.
 */
export const isEmailFromDomains = (email: string, allowedDomains: string[]): boolean => {
  if (!isValidEmail(email)) {
    return false;
  }
  
  const domain = email.split('@')[1].toLowerCase();
  return allowedDomains.some(allowedDomain => 
    domain === allowedDomain.toLowerCase() || 
    domain.endsWith('.' + allowedDomain.toLowerCase())
  );
};
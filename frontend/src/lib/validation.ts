/**
 * 폼 검증 관련 유틸리티 함수들
 */

/**
 * 이메일 형식 검증
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 강도 검증
 * - 최소 8자 이상
 * - 최소 1개 이상의 숫자
 * - 최소 1개 이상의 특수문자
 */
export function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false;
  
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  return hasNumber && hasSpecialChar;
}

/**
 * 비밀번호 강도 수준 반환 (1-5)
 */
export function getPasswordStrength(password: string): number {
  if (!password) return 0;
  
  let strength = 0;
  
  // 길이에 따른 점수
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // 문자 다양성에 따른 점수
  if (/[0-9]/.test(password)) strength += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 1;
  
  return strength;
}

/**
 * 전화번호 형식 검증
 */
export function isValidPhoneNumber(phone: string): boolean {
  // 한국 전화번호 형식 검증 (숫자만 있는 경우 포함)
  const phoneRegex = /^(01[016789]|02|0[3-9][0-9])[0-9]{7,8}$/;
  const cleanPhone = phone.replace(/[- ]/g, '');
  return phoneRegex.test(cleanPhone);
}

/**
 * URL 형식 검증
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 텍스트 길이 검증
 */
export function isValidLength(text: string, minLength: number, maxLength: number): boolean {
  const length = text.trim().length;
  return length >= minLength && length <= maxLength;
}

/**
 * 필수 입력값 검증
 */
export function isNotEmpty(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * 사용자 이름 검증 (영문, 숫자, 밑줄만 포함)
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * 특정 파일 형식인지 검증
 */
export function isValidFileType(file: File, acceptedTypes: string[]): boolean {
  return acceptedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type.match(new RegExp(type.replace('*', '.*')));
  });
}

/**
 * 파일 크기 검증 (바이트 단위)
 */
export function isValidFileSize(file: File, maxSizeInBytes: number): boolean {
  return file.size <= maxSizeInBytes;
}

/**
 * 한글 이름 검증 (2-5자)
 */
export function isValidKoreanName(name: string): boolean {
  const nameRegex = /^[가-힣]{2,5}$/;
  return nameRegex.test(name);
}
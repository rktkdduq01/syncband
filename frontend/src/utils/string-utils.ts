/**
 * 문자열 관련 유틸리티 함수
 */

/**
 * 주어진 문자열을 주어진 길이로 자르고 말줄임표를 추가합니다.
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

/**
 * 문자열의 첫 글자를 대문자로 변환합니다.
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 주어진 문자열에서 HTML 태그를 제거합니다.
 */
export const stripHtmlTags = (html: string): string => {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

/**
 * 주어진 문자열에서 이모지를 제거합니다.
 */
export const removeEmojis = (str: string): string => {
  // 'u' 플래그 제거 (ES5 호환성을 위해)
  return str.replace(
    /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u26FF\u2700-\u27BF]/g,
    ''
  );
};

/**
 * 슬러그화 - URL에 사용하기 적합한 문자열로 변환합니다.
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

/**
 * 임의의 문자열 ID를 생성합니다.
 */
export const generateId = (length: number = 8): string => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

/**
 * 문자열이 유효한 JSON인지 확인합니다.
 */
export const isValidJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * 문자열에 포함된 특수문자를 이스케이프합니다.
 */
export const escapeSpecialChars = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * 두 문자열 사이의 유사도를 계산합니다. (Levenshtein 거리 기반)
 */
export const calculateStringSimilarity = (str1: string, str2: string): number => {
  const track = Array(str2.length + 1).fill(null).map(() => 
    Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator, // substitution
      );
    }
  }
  
  const distance = track[str2.length][str1.length];
  const maxLength = Math.max(str1.length, str2.length);
  
  if (maxLength === 0) return 1; // 두 문자열이 모두 빈 경우
  
  return 1 - distance / maxLength; // 0과 1 사이의 유사도로 정규화
};

/**
 * 문자열 내의 URL을 감지하여 HTML a 태그로 변환합니다.
 */
export const linkifyUrls = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
};

/**
 * 문자열 내의 이메일 주소를 감지하여 HTML a 태그로 변환합니다.
 */
export const linkifyEmails = (text: string): string => {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g;
  return text.replace(emailRegex, (email) => `<a href="mailto:${email}">${email}</a>`);
};

/**
 * 문자열이 비었는지 확인합니다.
 */
export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * 문자열을 대문자로 변환합니다.
 */
export const toUpperCase = (str: string): string => {
  return str.toUpperCase();
};

/**
 * 문자열을 소문자로 변환합니다.
 */
export const toLowerCase = (str: string): string => {
  return str.toLowerCase();
};

/**
 * 문자열의 첫 글자만 대문자로 변환합니다.
 */
export const capitalize = (str: string): string => {
  if (isEmpty(str)) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 문자열의 각 단어의 첫 글자를 대문자로 변환합니다.
 */
export const capitalizeEachWord = (str: string): string => {
  if (isEmpty(str)) return str;
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

/**
 * 문자열을 카멜 케이스로 변환합니다.
 * ex) hello-world -> helloWorld
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+|[-_]/g, '');
};

/**
 * 문자열을 스네이크 케이스로 변환합니다.
 * ex) helloWorld -> hello_world
 */
export const toSnakeCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/\s+|[-]/g, '_')
    .toLowerCase();
};

/**
 * 문자열을 케밥 케이스로 변환합니다.
 * ex) helloWorld -> hello-world
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+|[_]/g, '-')
    .toLowerCase();
};

/**
 * 문자열을 파스칼 케이스로 변환합니다.
 * ex) hello-world -> HelloWorld
 */
export const toPascalCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+|[-_]/g, '');
};

/**
 * 문자열을 자릅니다.
 */
export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + suffix;
};

/**
 * 문자열에서 HTML 태그를 제거합니다.
 */
export const stripHtml = (html: string): string => {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

/**
 * 문자열에서 이메일 주소를 추출합니다.
 */
export const extractEmails = (text: string): string[] => {
  const regex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
  return text.match(regex) || [];
};

/**
 * 문자열에서 URL을 추출합니다.
 */
export const extractUrls = (text: string): string[] => {
  const regex = /(https?:\/\/[^\s]+)/g;
  return text.match(regex) || [];
};

/**
 * 문자열이 유효한 이메일인지 확인합니다.
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

/**
 * 문자열이 유효한 URL인지 확인합니다.
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 문자열의 모든 공백을 제거합니다.
 */
export const removeWhitespace = (str: string): string => {
  return str.replace(/\s/g, '');
};

/**
 * 문자열에서 숫자만 추출합니다.
 */
export const extractNumbers = (str: string): string => {
  return str.replace(/[^0-9]/g, '');
};

/**
 * 문자열에서 알파벳만 추출합니다.
 */
export const extractLetters = (str: string): string => {
  return str.replace(/[^a-zA-Z]/g, '');
};

/**
 * 문자열에서 특정 문자를 모두 치환합니다.
 */
export const replaceAll = (str: string, search: string, replacement: string): string => {
  return str.split(search).join(replacement);
};

/**
 * 문자열을 특정 길이만큼 반복합니다.
 */
export const repeat = (str: string, count: number): string => {
  return str.repeat(count);
};

/**
 * 문자열을 역순으로 변환합니다.
 */
export const reverse = (str: string): string => {
  return str.split('').reverse().join('');
};

/**
 * 문자열에 특정 문자열이 포함되어 있는지 확인합니다.
 */
export const contains = (str: string, searchStr: string): boolean => {
  return str.includes(searchStr);
};

/**
 * 문자열이 특정 문자열로 시작하는지 확인합니다.
 */
export const startsWith = (str: string, prefix: string): boolean => {
  return str.startsWith(prefix);
};

/**
 * 문자열이 특정 문자열로 끝나는지 확인합니다.
 */
export const endsWith = (str: string, suffix: string): boolean => {
  return str.endsWith(suffix);
};

/**
 * 문자열 배열에서 가장 긴 문자열을 찾습니다.
 */
export const findLongest = (strings: string[]): string => {
  return strings.reduce((longest, current) => 
    current.length > longest.length ? current : longest
  , '');
};

/**
 * 문자열 배열에서 가장 짧은 문자열을 찾습니다.
 */
export const findShortest = (strings: string[]): string => {
  if (!strings.length) return '';
  return strings.reduce((shortest, current) => 
    current.length < shortest.length ? current : shortest
  , strings[0]);
};

/**
 * 문자열을 랜덤으로 생성합니다.
 */
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * 문자열을 개행 문자 기준으로 배열로 분리합니다.
 */
export const splitLines = (str: string): string[] => {
  return str.split(/\r?\n/);
};

/**
 * 문자열에서 특수 문자를 제거합니다.
 */
export const removeSpecialCharacters = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9 ]/g, '');
};

/**
 * 문자열에서 중복된 문자를 제거합니다.
 */
export const removeDuplicateCharacters = (str: string): string => {
  // ES5 호환 방식으로 수정
  const chars: string[] = str.split('');
  const uniqueChars: string[] = [];
  
  for (let i = 0; i < chars.length; i++) {
    if (uniqueChars.indexOf(chars[i]) === -1) {
      uniqueChars.push(chars[i]);
    }
  }
  
  return uniqueChars.join('');
};

/**
 * 문자열이 팰린드롬(앞뒤로 읽어도 같은 단어)인지 확인합니다.
 */
export const isPalindrome = (str: string): boolean => {
  const formattedStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return formattedStr === formattedStr.split('').reverse().join('');
};

/**
 * 문자열에서 첫 n개 문자를 추출합니다.
 */
export const first = (str: string, n: number): string => {
  return str.slice(0, n);
};

/**
 * 문자열에서 마지막 n개 문자를 추출합니다.
 */
export const last = (str: string, n: number): string => {
  return str.slice(-n);
};

/**
 * 한글을 초성, 중성, 종성으로 분리합니다.
 */
export const decomposeKorean = (str: string): string[] => {
  const result: string[] = [];
  const chosung = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const jungsung = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const jongsung = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    
    // 한글 유니코드 범위: AC00(가) ~ D7A3(힣)
    if (char >= 0xAC00 && char <= 0xD7A3) {
      const offset = char - 0xAC00;
      const cho = Math.floor(offset / (21 * 28));
      const jung = Math.floor((offset % (21 * 28)) / 28);
      const jong = offset % 28;
      
      result.push(chosung[cho], jungsung[jung]);
      if (jong > 0) result.push(jongsung[jong]);
    } else {
      result.push(str[i]);
    }
  }
  
  return result;
};

/**
 * 문자열의 바이트 길이를 계산합니다. (한글 3바이트, 영어 및 숫자 1바이트)
 */
export const getByteLength = (str: string): number => {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    if (char >= 0x0000 && char <= 0x007F) {
      length += 1; // 영어, 숫자, 특수문자
    } else if (char >= 0x0080 && char <= 0x07FF) {
      length += 2;
    } else if (char >= 0x0800 && char <= 0xFFFF) {
      length += 3; // 한글
    } else if (char >= 0x10000 && char <= 0x1FFFFF) {
      length += 4;
    }
  }
  return length;
};

/**
 * 문자열을 특정 바이트 길이로 자릅니다.
 */
export const truncateByByteLength = (str: string, byteLength: number, suffix: string = '...'): string => {
  let currentLength = 0;
  let result = '';
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    let charByteLength = 0;
    
    if (char >= 0x0000 && char <= 0x007F) {
      charByteLength = 1;
    } else if (char >= 0x0080 && char <= 0x07FF) {
      charByteLength = 2;
    } else if (char >= 0x0800 && char <= 0xFFFF) {
      charByteLength = 3;
    } else if (char >= 0x10000 && char <= 0x1FFFFF) {
      charByteLength = 4;
    }
    
    if (currentLength + charByteLength <= byteLength) {
      result += str[i];
      currentLength += charByteLength;
    } else {
      break;
    }
  }
  
  if (result.length < str.length) {
    result += suffix;
  }
  
  return result;
};
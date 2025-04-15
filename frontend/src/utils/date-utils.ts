/**
 * 날짜 관련 유틸리티 함수
 */

/**
 * 현재 날짜와 시간을 반환합니다.
 */
export const getCurrentDateTime = (): Date => {
  return new Date();
};

/**
 * 날짜를 포맷팅합니다. (YYYY-MM-DD)
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * 시간을 포맷팅합니다. (HH:MM:SS)
 */
export const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * 날짜와 시간을 포맷팅합니다. (YYYY-MM-DD HH:MM:SS)
 */
export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * 상대적 시간을 반환합니다. (예: '3일 전', '방금 전')
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 밀리초 단위 변환
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) {
    return `${years}년 전`;
  } else if (months > 0) {
    return `${months}개월 전`;
  } else if (days > 0) {
    return `${days}일 전`;
  } else if (hours > 0) {
    return `${hours}시간 전`;
  } else if (minutes > 0) {
    return `${minutes}분 전`;
  } else {
    return '방금 전';
  }
};

/**
 * 두 날짜 사이의 차이를 일수로 반환합니다.
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * 두 날짜 사이의 차이를 월수로 반환합니다.
 */
export const getMonthsDifference = (date1: Date, date2: Date): number => {
  const months = (date2.getFullYear() - date1.getFullYear()) * 12;
  return months + (date2.getMonth() - date1.getMonth());
};

/**
 * 날짜에 일수를 더합니다.
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * 날짜에 월수를 더합니다.
 */
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * 날짜에 연수를 더합니다.
 */
export const addYears = (date: Date, years: number): Date => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

/**
 * 날짜가 유효한지 확인합니다.
 */
export const isValidDate = (date: Date): boolean => {
  return !isNaN(date.getTime());
};

/**
 * 문자열을 Date 객체로 변환합니다.
 */
export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * 날짜가 오늘인지 확인합니다.
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * 날짜가 어제인지 확인합니다.
 */
export const isYesterday = (date: Date): boolean => {
  const yesterday = addDays(new Date(), -1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * 날짜가 내일인지 확인합니다.
 */
export const isTomorrow = (date: Date): boolean => {
  const tomorrow = addDays(new Date(), 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

/**
 * 날짜가 이번 주인지 확인합니다.
 */
export const isThisWeek = (date: Date): boolean => {
  const today = new Date();
  const firstDayOfWeek = new Date(today);
  const dayOfWeek = today.getDay(); // 0: 일요일, 6: 토요일
  
  // 이번 주의 시작일 (일요일)로 설정
  firstDayOfWeek.setDate(today.getDate() - dayOfWeek);
  
  // 이번 주의 마지막일 (토요일)
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  
  return date >= firstDayOfWeek && date <= lastDayOfWeek;
};

/**
 * 날짜가 이번 달인지 확인합니다.
 */
export const isThisMonth = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * 날짜가 이번 년도인지 확인합니다.
 */
export const isThisYear = (date: Date): boolean => {
  const today = new Date();
  return date.getFullYear() === today.getFullYear();
};

/**
 * 두 날짜가 같은 날인지 확인합니다.
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * 두 날짜가 같은 월인지 확인합니다.
 */
export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * 두 날짜가 같은 연도인지 확인합니다.
 */
export const isSameYear = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear();
};

/**
 * 날짜가 주말인지 확인합니다.
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0: 일요일, 6: 토요일
};

/**
 * 월의 마지막 날짜를 반환합니다.
 */
export const getLastDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * 날짜를 한국어 형식으로 포맷팅합니다. (YYYY년 MM월 DD일)
 */
export const formatKoreanDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * 날짜의 요일을 한국어로 반환합니다.
 */
export const getKoreanDayOfWeek = (date: Date): string => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()] + '요일';
};

/**
 * ISO 형식의 날짜 문자열을 반환합니다. (YYYY-MM-DD)
 */
export const toISODateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * 타임스탬프를 Date 객체로 변환합니다.
 */
export const fromTimestamp = (timestamp: number): Date => {
  return new Date(timestamp);
};

/**
 * Date 객체를 타임스탬프로 변환합니다.
 */
export const toTimestamp = (date: Date): number => {
  return date.getTime();
};
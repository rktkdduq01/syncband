/**
 * 날짜 관련 유틸리티 함수들
 */

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function getCurrentDateString(): string {
  const date = new Date();
  return formatDateToYYYYMMDD(date);
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * 상대적 시간 포맷팅 (예: "3일 전", "방금 전")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const currentDate = new Date();
  const targetDate = new Date(date);
  
  const diffInSeconds = Math.floor((currentDate.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return '방금 전';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}년 전`;
}

/**
 * 두 날짜 사이의 일 수 계산
 */
export function getDaysBetweenDates(startDate: Date | string, endDate: Date | string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffInTime = end.getTime() - start.getTime();
  return Math.floor(diffInTime / (1000 * 60 * 60 * 24));
}

/**
 * 날짜에 일 수 추가하기
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 날짜에 월 수 추가하기
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * 주어진 연도와 월의 마지막 날짜 가져오기
 */
export function getLastDayOfMonth(year: number, month: number): number {
  // 자바스크립트에서는 월이 0부터 시작하므로 다음 월의 0일을 사용해 마지막 날짜를 구함
  return new Date(year, month, 0).getDate();
}

/**
 * 날짜의 시간을 00:00:00으로 설정
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 날짜의 시간을 23:59:59.999로 설정
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * 주어진 날짜가 오늘인지 확인
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * 날짜를 한국 형식으로 포맷팅 (YYYY년 MM월 DD일)
 */
export function formatDateToKorean(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${year}년 ${month}월 ${day}일`;
}
/**
 * 배열 관련 유틸리티 함수
 */

/**
 * 배열에서 중복된 요소를 제거합니다.
 */
export const removeDuplicates = <T>(array: T[]): T[] => {
  // Set을 사용하되 Array.from으로 변환
  return Array.from(new Set(array));
};

/**
 * 객체 배열에서 특정 키 값을 기준으로 중복을 제거합니다.
 */
export const removeDuplicatesByKey = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * 배열을 주어진 크기의 청크로 나눕니다.
 */
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  if (!array.length || size <= 0) return [];
  
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

/**
 * 두 배열의 교집합을 반환합니다.
 */
export const intersection = <T>(arr1: T[], arr2: T[]): T[] => {
  const set2 = new Set(arr2);
  return arr1.filter(item => set2.has(item));
};

/**
 * 두 배열의 합집합을 반환합니다.
 */
export const union = <T>(arr1: T[], arr2: T[]): T[] => {
  // Set을 사용하되 Array.from으로 변환
  return Array.from(new Set([...arr1, ...arr2]));
};

/**
 * 두 배열의 차집합을 반환합니다. (arr1에는 있지만 arr2에는 없는 요소)
 */
export const difference = <T>(arr1: T[], arr2: T[]): T[] => {
  const set2 = new Set(arr2);
  return arr1.filter(item => !set2.has(item));
};

/**
 * 배열을 임의로 섞습니다.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * 객체 배열을 특정 키를 기준으로 정렬합니다.
 */
export const sortByKey = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (valueA < valueB) {
      return order === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * 배열을 그룹화합니다.
 */
export const groupBy = <T>(array: T[], keyGetter: (item: T) => string): Record<string, T[]> => {
  return array.reduce((acc, item) => {
    const key = keyGetter(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

/**
 * 배열을 특정 조건에 따라 두 그룹으로 분할합니다.
 */
export const partition = <T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] => {
  const truthy: T[] = [];
  const falsy: T[] = [];
  
  for (const item of array) {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  
  return [truthy, falsy];
};

/**
 * 배열의 모든 요소 합계를 계산합니다. (숫자 배열에만 사용)
 */
export const sum = (array: number[]): number => {
  return array.reduce((total, num) => total + num, 0);
};

/**
 * 배열의 평균값을 계산합니다. (숫자 배열에만 사용)
 */
export const average = (array: number[]): number => {
  if (array.length === 0) return 0;
  return sum(array) / array.length;
};

/**
 * 배열에서 최대값을 찾습니다.
 */
export const max = <T>(array: T[], valueGetter: (item: T) => number = (item) => item as unknown as number): T | undefined => {
  if (array.length === 0) return undefined;
  
  return array.reduce((max, current) => {
    return valueGetter(current) > valueGetter(max) ? current : max;
  }, array[0]);
};

/**
 * 배열에서 최소값을 찾습니다.
 */
export const min = <T>(array: T[], valueGetter: (item: T) => number = (item) => item as unknown as number): T | undefined => {
  if (array.length === 0) return undefined;
  
  return array.reduce((min, current) => {
    return valueGetter(current) < valueGetter(min) ? current : min;
  }, array[0]);
};

/**
 * 배열의 요소를 지정된 방향으로 이동합니다.
 */
export const moveItem = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  if (
    fromIndex < 0 || 
    fromIndex >= array.length || 
    toIndex < 0 || 
    toIndex >= array.length || 
    fromIndex === toIndex
  ) {
    return [...array];
  }
  
  const result = [...array];
  const [item] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, item);
  
  return result;
};

/**
 * 배열에서 지정한 값과 일치하는 첫 번째 요소의 인덱스를 찾습니다.
 */
export const findIndex = <T>(array: T[], predicate: (item: T) => boolean): number => {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return i;
    }
  }
  return -1;
};

/**
 * 두 배열이 같은 요소를 가지고 있는지 확인합니다.
 */
export const areArraysEqual = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  
  const set1 = new Set(arr1);
  for (const item of arr2) {
    if (!set1.has(item)) {
      return false;
    }
  }
  
  return true;
};
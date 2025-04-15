/**
 * 파일 관련 유틸리티 함수
 */

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환합니다.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * 파일 확장자를 반환합니다.
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

/**
 * 파일 이름에서 확장자를 제외한 부분을 반환합니다.
 */
export const getFileNameWithoutExtension = (filename: string): string => {
  return filename.substring(0, filename.lastIndexOf('.'));
};

/**
 * 파일이 이미지인지 확인합니다.
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * 파일이 오디오인지 확인합니다.
 */
export const isAudioFile = (file: File): boolean => {
  return file.type.startsWith('audio/');
};

/**
 * 파일이 비디오인지 확인합니다.
 */
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

/**
 * 파일이 문서인지 확인합니다.
 */
export const isDocumentFile = (file: File): boolean => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];
  
  return documentTypes.includes(file.type);
};

/**
 * 파일을 Base64 문자열로 변환합니다.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * 오디오 파일의 지속 시간을 가져옵니다.
 */
export const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
    });
    
    audio.addEventListener('error', reject);
    
    audio.src = URL.createObjectURL(file);
  });
};

/**
 * 파일을 주어진 확장자로 필터링합니다.
 */
export const filterFilesByExtension = (files: File[], extensions: string[]): File[] => {
  const lowerCaseExtensions = extensions.map(ext => ext.toLowerCase());
  
  return files.filter(file => {
    const extension = getFileExtension(file.name).toLowerCase();
    return lowerCaseExtensions.includes(extension);
  });
};

/**
 * 파일 객체로부터 미리보기 URL을 생성합니다.
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * 미리보기 URL을 해제합니다.
 */
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * 파일 이름이 유효한지 확인합니다.
 */
export const isValidFileName = (fileName: string): boolean => {
  // 윈도우에서 허용하지 않는 특수문자 체크
  const invalidChars = /[<>:"\/\\|?*\x00-\x1F]/;
  return !invalidChars.test(fileName);
};

/**
 * 파일을 다운로드합니다.
 */
export const downloadFile = (url: string, fileName: string): void => {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * 텍스트 내용을 파일로 다운로드합니다.
 */
export const downloadTextAsFile = (text: string, fileName: string): void => {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  downloadFile(url, fileName);
  URL.revokeObjectURL(url);
};

/**
 * 다중 파일 선택에서 중복 파일을 제거합니다.
 */
export const removeDuplicateFiles = (files: File[]): File[] => {
  const uniqueFiles: File[] = [];
  const fileNames = new Set<string>();
  
  for (const file of files) {
    if (!fileNames.has(file.name)) {
      fileNames.add(file.name);
      uniqueFiles.push(file);
    }
  }
  
  return uniqueFiles;
};
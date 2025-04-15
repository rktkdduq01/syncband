'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';

// 믹싱 프로젝트 생성 폼 스키마 (수정됨)
const createMixProjectSchema = z.object({
  projectName: z.string().min(3, '프로젝트 이름은 최소 3글자 이상이어야 합니다.'),
  genre: z.string().optional(),
  bpm: z.string()
    .refine(val => !val || !isNaN(Number(val)), {
      message: 'BPM은 숫자여야 합니다.',
    }),
  isCollaborative: z.boolean(),
  description: z.string().optional(),
});

type CreateMixProjectFormValues = z.infer<typeof createMixProjectSchema>;

export default function CreateMixProject() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<CreateMixProjectFormValues>({
    resolver: zodResolver(createMixProjectSchema),
    defaultValues: {
      projectName: '',
      genre: '',
      bpm: '120',
      isCollaborative: false,
      description: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileList = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...fileList]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit: SubmitHandler<CreateMixProjectFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      
      // 서버로 전송하기 전에 BPM을 숫자로 변환
      const serverData = {
        ...data,
        bpm: data.bpm ? Number(data.bpm) : 120,
      };
      
      // 실제 구현에서는 API 요청으로 데이터와 파일을 서버에 보내야 합니다
      console.log('프로젝트 생성 데이터:', serverData);
      console.log('업로드된 오디오 파일:', selectedFiles);
      
      // 임시로 UUID를 사용하여 프로젝트 ID 생성
      const projectId = uuidv4();
      
      // 생성된 프로젝트로 이동
      router.push(`/mix/${projectId}`);
    } catch (error) {
      console.error('프로젝트 생성 오류:', error);
      alert('프로젝트를 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">새 믹싱 프로젝트 만들기</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium mb-1">
                프로젝트 이름 *
              </label>
              <input
                id="projectName"
                type="text"
                {...register('projectName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="믹싱 프로젝트의 이름을 입력하세요"
              />
              {errors.projectName && (
                <p className="mt-1 text-sm text-red-600">{errors.projectName.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="genre" className="block text-sm font-medium mb-1">
                  장르
                </label>
                <select
                  id="genre"
                  {...register('genre')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">장르 선택 (선택사항)</option>
                  <option value="pop">팝</option>
                  <option value="rock">록</option>
                  <option value="hiphop">힙합</option>
                  <option value="electronic">일렉트로닉</option>
                  <option value="jazz">재즈</option>
                  <option value="classical">클래식</option>
                  <option value="rnb">R&B</option>
                  <option value="metal">메탈</option>
                  <option value="folk">포크</option>
                  <option value="other">기타</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="bpm" className="block text-sm font-medium mb-1">
                  BPM
                </label>
                <input
                  id="bpm"
                  type="text"
                  {...register('bpm')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="프로젝트의 BPM (기본값: 120)"
                />
                {errors.bpm && (
                  <p className="mt-1 text-sm text-red-600">{errors.bpm.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                프로젝트 설명
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="프로젝트에 대한 설명을 입력하세요 (선택사항)"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="isCollaborative"
                type="checkbox"
                {...register('isCollaborative')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="isCollaborative" className="ml-2 block text-sm">
                협업 가능한 프로젝트로 만들기
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                오디오 파일 업로드
              </label>
              
              <input
                type="file"
                accept=".mp3,.wav,.ogg,.flac"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={triggerFileInput}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="mx-auto h-12 w-12 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mt-1 text-sm text-gray-500">
                  클릭하여 오디오 파일 선택 또는 파일을 여기로 드래그하세요
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  지원 파일: .mp3, .wav, .ogg, .flac
                </p>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">선택된 파일 ({selectedFiles.length}개)</p>
                  <div className="max-h-48 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                        <div className="flex items-center space-x-2 truncate">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {isSubmitting ? '생성 중...' : '프로젝트 생성하기'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">믹싱 프로젝트 가이드</h2>
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-sm">
            <ul className="list-disc pl-5 space-y-2">
              <li>업로드하는 오디오 파일은 믹싱을 위한 개별 트랙이나 스템으로 준비하는 것이 좋습니다.</li>
              <li>협업 가능한 프로젝트로 설정하면 다른 사용자와 함께 작업할 수 있습니다.</li>
              <li>BPM(분당 비트 수)은 프로젝트의 템포를 결정합니다.</li>
              <li>최대 파일 크기는 50MB입니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
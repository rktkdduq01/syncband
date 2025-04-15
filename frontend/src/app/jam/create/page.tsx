'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';

// 잼 세션 생성 폼 스키마
const createJamSessionSchema = z.object({
  sessionName: z.string().min(3, '세션 이름은 최소 3글자 이상이어야 합니다.'),
  description: z.string().optional(),
  maxParticipants: z.string()
    .refine(val => !isNaN(parseInt(val, 10)), {
      message: '유효한 숫자를 입력해주세요.'
    }),
  isPrivate: z.boolean(),
  password: z.string().optional(),
});

type CreateJamSessionFormValues = z.infer<typeof createJamSessionSchema>;

export default function CreateJamSession() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateJamSessionFormValues>({
    resolver: zodResolver(createJamSessionSchema),
    defaultValues: {
      sessionName: '',
      description: '',
      maxParticipants: '4',
      isPrivate: false,
      password: '',
    },
  });
  
  const isPrivate = watch('isPrivate');

  const onSubmit: SubmitHandler<CreateJamSessionFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      
      // 서버로 보내기 전에 maxParticipants를 숫자로 변환
      const serverData = {
        ...data,
        maxParticipants: parseInt(data.maxParticipants, 10)
      };
      
      // 실제 구현에서는 API 요청으로 데이터를 서버에 보내야 합니다
      console.log('세션 생성 데이터:', serverData);
      
      // 임시로 UUID를 사용하여 방 ID 생성
      const roomId = uuidv4();
      
      // 생성된 방으로 이동
      router.push(`/jam/${roomId}`);
    } catch (error) {
      console.error('세션 생성 오류:', error);
      alert('세션을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">새 잼 세션 만들기</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="sessionName" className="block text-sm font-medium mb-1">
                세션 이름 *
              </label>
              <input
                id="sessionName"
                type="text"
                {...register('sessionName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="함께 연주할 세션의 이름을 입력하세요"
              />
              {errors.sessionName && (
                <p className="mt-1 text-sm text-red-600">{errors.sessionName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                세션 설명
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="세션에 대한 설명을 입력하세요 (선택사항)"
              />
            </div>
            
            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium mb-1">
                최대 참가자 수
              </label>
              <select
                id="maxParticipants"
                {...register('maxParticipants')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2">2명</option>
                <option value="3">3명</option>
                <option value="4">4명</option>
                <option value="5">5명</option>
                <option value="6">6명</option>
                <option value="8">8명</option>
                <option value="10">10명</option>
              </select>
              {errors.maxParticipants && (
                <p className="mt-1 text-sm text-red-600">{errors.maxParticipants.message}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="isPrivate"
                type="checkbox"
                {...register('isPrivate')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm">
                비공개 세션으로 만들기
              </label>
            </div>
            
            {isPrivate && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  세션 비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="비공개 세션 접속용 비밀번호를 입력하세요"
                />
              </div>
            )}
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {isSubmitting ? '생성 중...' : '세션 생성하기'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">세션 생성 가이드</h2>
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-sm">
            <ul className="list-disc pl-5 space-y-2">
              <li>세션 이름은 다른 참가자들이 인식할 수 있는 간결한 이름이 좋습니다.</li>
              <li>비공개 세션은 URL을 알고 있더라도 비밀번호가 없으면 참가할 수 없습니다.</li>
              <li>참가자 수가 많을수록 인터넷 연결 상태에 따라 지연이 발생할 수 있습니다.</li>
              <li>최적의 경험을 위해 유선 인터넷 연결 사용을 권장합니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
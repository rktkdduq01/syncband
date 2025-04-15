'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateJamRoom() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomName: '',
    genre: 'rock',
    maxParticipants: 4,
    isPublic: true,
    description: '',
    password: '',
    instrument: 'guitar'
  });

  // 장르 목록
  const genres = [
    { value: 'rock', label: '록' },
    { value: 'jazz', label: '재즈' },
    { value: 'pop', label: '팝' },
    { value: 'classical', label: '클래식' },
    { value: 'electronic', label: '일렉트로닉' },
    { value: 'hiphop', label: '힙합' },
    { value: 'folk', label: '포크' },
    { value: 'blues', label: '블루스' },
    { value: 'rnb', label: 'R&B' },
    { value: 'kpop', label: 'K-Pop' },
  ];

  // 악기 목록
  const instruments = [
    { value: 'guitar', label: '기타' },
    { value: 'piano', label: '피아노' },
    { value: 'bass', label: '베이스' },
    { value: 'drums', label: '드럼' },
    { value: 'vocal', label: '보컬' },
    { value: 'synth', label: '신디사이저' },
  ];

  // 참가자 수 옵션
  const participantOptions = [2, 3, 4, 5, 6, 8, 10];

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'isPublic') {
      const checkboxInput = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkboxInput.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // 방 생성 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 실제 구현 시 API 호출 (여기서는 모의 처리)
      console.log('방 생성 요청:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 임시 룸 ID (실제로는 서버에서 받아옴)
      const roomId = 'room_' + Date.now().toString();
      
      // 성공 시 생성된 방으로 리디렉션
      router.push(`/sync-room/${roomId}`);
    } catch (error) {
      console.error('방 생성 실패:', error);
      alert('방 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">잼 세션 방 만들기</h1>
            <p className="mt-2 text-gray-600">
              다른 음악가들과 실시간으로 연주하고 녹음할 수 있는 방을 만드세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 방 이름 */}
            <div>
              <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">
                방 이름
              </label>
              <input
                type="text"
                id="roomName"
                name="roomName"
                value={formData.roomName}
                onChange={handleChange}
                required
                placeholder="기타 즉흥 연주 세션"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>

            {/* 장르 */}
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                장르
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                {genres.map((genre) => (
                  <option key={genre.value} value={genre.value}>
                    {genre.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 내 악기 */}
            <div>
              <label htmlFor="instrument" className="block text-sm font-medium text-gray-700">
                내 악기
              </label>
              <select
                id="instrument"
                name="instrument"
                value={formData.instrument}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                {instruments.map((instrument) => (
                  <option key={instrument.value} value={instrument.value}>
                    {instrument.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 최대 참가자 수 */}
            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
                최대 참가자 수
              </label>
              <select
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                {participantOptions.map((num) => (
                  <option key={num} value={num}>
                    {num}명
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                참가자가 많을수록 네트워크 지연이 발생할 수 있습니다.
              </p>
            </div>

            {/* 설명 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                방 설명 (선택)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="이 방에 대한 설명이나 참여자들에게 알리고 싶은 내용을 작성하세요."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>

            {/* 공개 여부 */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isPublic"
                  name="isPublic"
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isPublic" className="font-medium text-gray-700">
                  공개 방
                </label>
                <p className="text-gray-500">
                  공개 방은 모든 사용자가 찾을 수 있습니다. 비공개 방은 링크나 초대를 통해서만 참여할 수 있습니다.
                </p>
              </div>
            </div>

            {/* 비밀번호 (비공개 방일 경우) */}
            {!formData.isPublic && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  방 비밀번호 (선택)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 설정하려면 입력하세요"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            )}

            {/* 버튼 */}
            <div className="flex justify-between pt-4">
              <Link
                href="/sync-room"
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary/70 disabled:cursor-not-allowed"
              >
                {isLoading ? '생성 중...' : '방 생성하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
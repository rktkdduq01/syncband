// 악기별 강좌 메인 페이지

'use client';

import React from 'react';
import Link from 'next/link';

export default function InstrumentsPage() {
  const instruments = [
    {
      id: 'guitar',
      name: '기타',
      description: '기타 연주의 기초부터 고급 테크닉까지 배워보세요.',
      imageUrl: '/assets/instruments/guitar.jpg',
    },
    {
      id: 'piano',
      name: '피아노',
      description: '피아노의 기본 화음부터 복잡한 곡 연주까지 단계별로 학습하세요.',
      imageUrl: '/assets/instruments/piano.jpg',
    },
    {
      id: 'drums',
      name: '드럼',
      description: '기본 리듬과 드럼 세팅부터 고급 드럼 테크닉까지 배워보세요.',
      imageUrl: '/assets/instruments/drums.jpg',
    },
    {
      id: 'vocal',
      name: '보컬',
      description: '발성법과 호흡법부터 시작해 다양한 보컬 스타일을 익혀보세요.',
      imageUrl: '/assets/instruments/vocal.jpg',
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">악기 강좌</h1>
      <p className="text-lg mb-8">
        다양한 악기 강좌를 통해 당신의 음악적 역량을 키워보세요. 각 악기별로 준비된 강좌를 확인해보세요.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {instruments.map((instrument) => (
          <Link 
            href={`/learn/instruments/${instrument.id}`} 
            key={instrument.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-3xl">{instrument.name}</div>
              {/* 실제 이미지가 있을 경우 아래 코드로 대체
              <Image 
                src={instrument.imageUrl} 
                alt={instrument.name}
                width={300}
                height={200}
                className="w-full h-full object-cover"
              />
              */}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{instrument.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{instrument.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

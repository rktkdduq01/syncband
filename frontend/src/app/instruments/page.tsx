'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface InstrumentCard {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
}

export default function InstrumentsPage() {
  const router = useRouter();

  // 가능한 악기 목록
  const instruments: InstrumentCard[] = [
    {
      id: 'piano',
      name: '피아노',
      description: '클래식부터 현대 음악까지 가장 기본적이고 다재다능한 건반 악기입니다. 88개의 건반을 통해 풍부한 음향을 만들어보세요.',
      image: '/assets/instruments/piano.jpg',
      href: '/instruments/piano',
    },
    {
      id: 'synthesizer',
      name: '신디사이저',
      description: '다양한 소리와 효과를 만들어낼 수 있는 전자 악기입니다. 웨이브폼을 조작하고 필터를 적용해 독특한 사운드를 만들어보세요.',
      image: '/assets/instruments/synth.jpg',
      href: '/instruments/synthesizer',
    },
    {
      id: 'drums',
      name: '드럼 머신',
      description: '정교한 비트와 리듬 패턴을 만들 수 있는 가상 드럼 머신입니다. 다양한 드럼 키트와 패턴을 활용해보세요.',
      image: '/assets/instruments/drums.jpg',
      href: '/instruments/drums',
    },
    {
      id: 'guitar',
      name: '기타',
      description: '록부터 재즈, 클래식까지 다양한 장르에서 사용되는 현악기입니다. 코드와 리프를 연주해보세요.',
      image: '/assets/instruments/guitar.jpg',
      href: '/instruments/guitar',
    },
    {
      id: 'bass',
      name: '베이스',
      description: '음악의 리듬과 조화를 책임지는 저음역대 현악기입니다. 강력한 베이스라인으로 음악에 깊이를 더해보세요.',
      image: '/assets/instruments/bass.jpg',
      href: '/instruments/bass',
    },
  ];
  
  const handleInstrumentClick = (href: string) => {
    router.push(href);
  };

  // 최근에 사용한 악기 (임시 데이터)
  const recentInstruments = [instruments[0], instruments[1]];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">가상 악기</h1>
      
      {recentInstruments.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">최근에 사용한 악기</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recentInstruments.map(instrument => (
              <div 
                key={instrument.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleInstrumentClick(instrument.href)}
              >
                <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
                  {/* 이미지 경로는 public 디렉토리 기준 */}
                  {/* 실제 이미지가 없으므로 색상 블록으로 대체 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600" />
                  <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                    {instrument.name}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-1">{instrument.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                    {instrument.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-semibold mb-4">모든 악기</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {instruments.map(instrument => (
            <div 
              key={instrument.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleInstrumentClick(instrument.href)}
            >
              <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
                {/* 이미지 경로는 public 디렉토리 기준 */}
                {/* 실제 이미지가 없으므로 색상 블록으로 대체 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  instrument.id === 'piano' ? 'from-blue-400 to-purple-600' :
                  instrument.id === 'synthesizer' ? 'from-green-400 to-teal-600' :
                  instrument.id === 'drums' ? 'from-red-400 to-orange-600' :
                  instrument.id === 'guitar' ? 'from-yellow-400 to-amber-600' :
                  'from-purple-400 to-pink-600'
                }`} />
                <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                  {instrument.name}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-2">{instrument.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {instrument.description}
                </p>
              </div>
              <div className="px-4 pb-4">
                <Link 
                  href={instrument.href} 
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded-md"
                >
                  연주하기
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
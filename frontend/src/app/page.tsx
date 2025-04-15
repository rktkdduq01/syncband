'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  // 주요 기능 목록
  const features = [
    {
      title: '실시간 잼 세션',
      description: '전 세계 음악가들과 지연 없이 실시간으로 함께 연주하고 창작하세요.',
      icon: 'music_note',
    },
    {
      title: '가상 스튜디오',
      description: '고품질 가상 악기와 오디오 효과를 통해 전문적인 음악 제작을 경험하세요.',
      icon: 'equalizer',
    },
    {
      title: '대화형 음악 교육',
      description: '실시간 피드백과 진행 상황 추적이 포함된 맞춤형 음악 학습 경로를 경험하세요.',
      icon: 'school',
    },
    {
      title: '음악가 커뮤니티',
      description: '비슷한 관심사를 가진 음악가들을 만나 협업하고 피드백을 나눠보세요.',
      icon: 'people',
    },
  ];

  // 지원하는 악기 목록
  const instruments = [
    { name: '피아노', icon: 'piano', path: '/learn/instruments/piano' },
    { name: '기타', icon: 'music_note', path: '/learn/instruments/guitar' },
    { name: '드럼', icon: 'music_note', path: '/learn/instruments/drums' },
    { name: '보컬', icon: 'mic', path: '/learn/instruments/vocal' },
    { name: '베이스', icon: 'music_note', path: '/learn/instruments/bass' },
    { name: '신디사이저', icon: 'piano', path: '/studio/instruments/synthesizer' },
  ];

  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 z-0 opacity-30">
          {/* 배경 이미지 (추후 이미지 구현 시 추가) */}
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            음악 협업의 미래, <span className="text-yellow-400">SyncBand</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 text-gray-100">
            어디서든 지연 없이 실시간으로 연주하고, 배우고, 창작하세요.
            SyncBand는 전 세계 음악가들을 위한 올인원 온라인 음악 플랫폼입니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/studio/jam"
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-lg font-medium"
            >
              무료로 시작하기
            </Link>
            <Link 
              href="/learn/courses"
              className="px-6 py-3 bg-transparent border border-white text-white rounded-md hover:bg-white/10 transition-colors text-lg font-medium"
            >
              학습 시작하기
            </Link>
          </div>
        </div>
        {/* 파형 분리대 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,128L48,117.3C96,107,192,85,288,96C384,107,480,149,576,154.7C672,160,768,128,864,122.7C960,117,1056,139,1152,144C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">SyncBand의 특별한 기능</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              SyncBand는 음악가들을 위한 최고의 온라인 협업 경험을 제공합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="material-icons text-primary text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사용법 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* 텍스트 설명 */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                어떻게 작동하나요?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">방 생성 또는 참여</h3>
                    <p className="text-gray-600">
                      새로운 음악 협업 세션을 시작하거나 친구가 생성한 방에 참여하세요.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">악기 선택</h3>
                    <p className="text-gray-600">
                      실제 악기를 연결하거나 SyncBand의 고품질 가상 악기 중 하나를 선택하세요.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">실시간 연주 및 녹음</h3>
                    <p className="text-gray-600">
                      저지연 기술을 통해 실시간으로 함께 연주하고, 세션을 녹음하여 나중에 믹싱하세요.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Link 
                  href="/studio/jam/create"
                  className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
                >
                  첫 번째 세션 시작하기
                </Link>
              </div>
            </div>
            
            {/* 이미지/비디오 */}
            <div className="w-full lg:w-1/2 bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
              {/* 추후 이미지나 비디오로 교체 */}
              <span className="text-gray-500 text-lg">웹사이트 데모 비디오</span>
            </div>
          </div>
        </div>
      </section>

      {/* 악기 섹션 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">다양한 악기 지원</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              피아노, 기타, 드럼 등 다양한 악기를 연습하고 연주할 수 있습니다.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {instruments.map((instrument, index) => (
              <Link 
                key={index}
                href={instrument.path}
                className="p-6 bg-gray-50 rounded-lg text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="material-icons text-primary text-2xl">{instrument.icon}</span>
                </div>
                <h3 className="text-lg font-medium">{instrument.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 회원가입 유도 섹션 */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 SyncBand와 함께 음악 여정을 시작하세요
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-10 text-gray-100">
            무료로 시작하여 음악 협업의 새로운 세계를 경험해보세요. 
            지금 바로 가입하고 글로벌 음악 커뮤니티에 참여하세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/auth/register"
              className="px-6 py-3 bg-white text-primary rounded-md hover:bg-gray-100 transition-colors text-lg font-medium"
            >
              무료로 가입하기
            </Link>
            <Link 
              href="/pricing"
              className="px-6 py-3 bg-transparent border border-white text-white rounded-md hover:bg-white/10 transition-colors text-lg font-medium"
            >
              요금제 알아보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

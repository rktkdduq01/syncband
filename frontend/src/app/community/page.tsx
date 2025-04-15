'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 커뮤니티 섹션 인터페이스 정의
interface CommunitySection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  color: string;
}

export default function CommunityPage() {
  const router = useRouter();

  // 커뮤니티 섹션 데이터
  const communitySections: CommunitySection[] = [
    {
      id: 'forum',
      title: '포럼',
      description: '음악 제작, 장비, 기술에 대해 다른 아티스트와 토론하세요.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      url: '/community/forum',
      color: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      id: 'collaborations',
      title: '협업',
      description: '함께 작업할 뮤지션을 찾고 협업 프로젝트를 시작하세요.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      url: '/community/collaborations',
      color: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      id: 'showcase',
      title: '쇼케이스',
      description: '자신의 음악 작품을 공유하고 피드백을 받으세요.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      url: '/community/showcase',
      color: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      id: 'gear',
      title: '장비 토론',
      description: '음악 기어와 소프트웨어에 대한 리뷰와 조언을 공유하세요.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      url: '/community/gear',
      color: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
  ];

  // 최근 활동 데이터 (실제 앱에서는 API에서 가져올 것)
  const recentActivity = [
    { id: 1, title: '새로운 키보드 추천해주세요!', category: '장비 토론', user: '재즈러버', time: '방금 전' },
    { id: 2, title: '전자음악 믹싱 작업에 참여할 프로듀서 구합니다', category: '협업', user: 'DJ_스크래치', time: '30분 전' },
    { id: 3, title: '제 첫 EP를 공개합니다!', category: '쇼케이스', user: '기타리스트K', time: '2시간 전' },
    { id: 4, title: 'DAW 초보자를 위한 팁 공유', category: '포럼', user: '프로듀서M', time: '5시간 전' },
  ];

  // 섹션 카드 클릭 핸들러
  const handleSectionClick = (url: string) => {
    router.push(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">SyncBand 커뮤니티</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            전 세계 뮤지션들과 연결하고, 지식을 공유하며, 음악 작업에 대한 영감을 얻으세요.
          </p>
        </div>

        {/* 커뮤니티 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {communitySections.map((section) => (
            <div
              key={section.id}
              className={`${section.color} rounded-xl p-6 cursor-pointer transform transition-transform hover:scale-105`}
              onClick={() => handleSectionClick(section.url)}
            >
              <div className="flex items-start">
                <div className="mr-4 text-gray-700 dark:text-gray-200">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {section.description}
                  </p>
                  <Link href={section.url} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    탐색하기 &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 최근 활동 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">최근 활동</h2>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium text-lg hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                    {item.title}
                  </h3>
                  <span className="text-sm text-gray-500">{item.time}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="mr-2">in {item.category}</span>
                  <span>&bull;</span>
                  <span className="ml-2">by {item.user}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              더 보기 &rarr;
            </button>
          </div>
        </div>

        {/* 커뮤니티 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">15,240</div>
            <div className="text-gray-600 dark:text-gray-400">회원</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">8,652</div>
            <div className="text-gray-600 dark:text-gray-400">토론</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">3,830</div>
            <div className="text-gray-600 dark:text-gray-400">협업</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">12,905</div>
            <div className="text-gray-600 dark:text-gray-400">트랙 공유</div>
          </div>
        </div>
      </div>
    </div>
  );
}

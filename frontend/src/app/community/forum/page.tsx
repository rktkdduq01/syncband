'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 포럼 카테고리 타입 정의
type ForumCategory = {
  id: string;
  name: string;
  description: string;
  topicsCount: number;
  color: string;
};

// 토픽 타입 정의
type ForumTopic = {
  id: number;
  title: string;
  category: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  replies: number;
  views: number;
  lastActivity: string;
  pinned?: boolean;
  hot?: boolean;
};

export default function ForumPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // 포럼 카테고리 데이터 (실제 앱에서는 API에서 가져올 것)
  const categories: ForumCategory[] = [
    {
      id: 'music-production',
      name: '음악 제작',
      description: '작곡, 편곡, 프로덕션, 믹싱, 마스터링 등 음악 제작 관련 토론',
      topicsCount: 528,
      color: 'border-blue-500',
    },
    {
      id: 'instruments',
      name: '악기 & 연주',
      description: '악기 연주 기술, 연습 방법, 튜닝 등에 관한 이야기',
      topicsCount: 421,
      color: 'border-green-500',
    },
    {
      id: 'gear',
      name: '음향 장비',
      description: '악기, 오디오 인터페이스, 마이크, 스피커 등 장비에 관한 토론',
      topicsCount: 357,
      color: 'border-yellow-500',
    },
    {
      id: 'software',
      name: '소프트웨어 & DAW',
      description: 'DAW, 플러그인, 가상악기 등 음악 소프트웨어 관련 토론',
      topicsCount: 492,
      color: 'border-purple-500',
    },
    {
      id: 'theory',
      name: '음악 이론',
      description: '화성학, 리듬, 음악 분석 등 음악 이론에 관한 질문과 토론',
      topicsCount: 215,
      color: 'border-red-500',
    },
    {
      id: 'general',
      name: '일반 토론',
      description: '음악 산업, 커리어, 뉴스 및 기타 음악 관련 토픽',
      topicsCount: 387,
      color: 'border-gray-500',
    },
  ];

  // 최근 토픽 데이터 (실제 앱에서는 API에서 가져올 것)
  const topics: ForumTopic[] = [
    {
      id: 1,
      title: '프로듀서를 위한 최고의 MIDI 키보드는 무엇인가요?',
      category: '음향 장비',
      author: {
        id: 'user1',
        name: '프로듀서K',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      replies: 24,
      views: 478,
      lastActivity: '15분 전',
      hot: true,
    },
    {
      id: 2,
      title: '초보자도 쉽게 시작할 수 있는 무료 DAW 추천',
      category: '소프트웨어 & DAW',
      author: {
        id: 'user2',
        name: 'MusicMaker',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      replies: 42,
      views: 1243,
      lastActivity: '3시간 전',
      pinned: true,
    },
    {
      id: 3,
      title: '마스터링 시 자주 하는 실수와 해결 방법',
      category: '음악 제작',
      author: {
        id: 'user3',
        name: '사운드엔지니어',
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
      replies: 18,
      views: 532,
      lastActivity: '6시간 전',
    },
    {
      id: 4,
      title: '독학으로 피아노 배우기: 나만의 경험과 팁',
      category: '악기 & 연주',
      author: {
        id: 'user4',
        name: '피아노러버',
        avatar: 'https://i.pravatar.cc/150?img=4',
      },
      replies: 31,
      views: 890,
      lastActivity: '12시간 전',
    },
    {
      id: 5,
      title: '화성학 기초: 코드 진행 이해하기',
      category: '음악 이론',
      author: {
        id: 'user5',
        name: '음악선생님',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
      replies: 27,
      views: 712,
      lastActivity: '1일 전',
    },
    {
      id: 6,
      title: '신디사이저 추천 부탁드립니다',
      category: '음향 장비',
      author: {
        id: 'user6',
        name: '일렉트로닉팬',
        avatar: 'https://i.pravatar.cc/150?img=6',
      },
      replies: 15,
      views: 423,
      lastActivity: '1일 전',
    },
    {
      id: 7,
      title: '로직 프로와 에이블톤 라이브 비교',
      category: '소프트웨어 & DAW',
      author: {
        id: 'user7',
        name: '멀티프로듀서',
        avatar: 'https://i.pravatar.cc/150?img=7',
      },
      replies: 56,
      views: 1872,
      lastActivity: '2일 전',
      hot: true,
    },
  ];

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 검색 기능 구현 (API 호출 등)
    console.log('검색어:', searchQuery);
  };

  // 토픽 필터링
  const filteredTopics = topics.filter((topic) => {
    if (activeTab !== 'all' && activeTab !== 'pinned' && activeTab !== 'hot') {
      return topic.category === activeTab;
    }
    if (activeTab === 'pinned') return topic.pinned;
    if (activeTab === 'hot') return topic.hot;
    return true;
  });

  // 카테고리 카드 클릭 핸들러
  const handleCategoryClick = (categoryId: string) => {
    setActiveTab(categoryId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">음악 포럼</h1>
              <p className="text-gray-600 dark:text-gray-300">
                음악 제작, 연주, 장비 등에 대해 토론하고 질문하세요.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                onClick={() => router.push('/community/forum/new')}
              >
                새 토픽 작성
              </button>
            </div>
          </div>
          
          {/* 검색 폼 */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="포럼 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
              >
                검색
              </button>
            </div>
          </form>
        </div>

        {/* 카테고리 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${category.color} cursor-pointer hover:shadow-lg transition duration-300`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <h2 className="text-lg font-semibold mb-2">{category.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{category.description}</p>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{category.topicsCount} 토픽</span>
                <button className="text-blue-600 dark:text-blue-400 hover:underline">
                  모든 토픽 보기
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 탭 메뉴 */}
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('all')}
          >
            모든 토픽
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'pinned'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('pinned')}
          >
            고정된 토픽
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === 'hot'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => setActiveTab('hot')}
          >
            인기 토픽
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-md ${
                activeTab === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveTab(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* 토픽 목록 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">토픽</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">카테고리</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">작성자</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">답변</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">조회수</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">마지막 활동</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredTopics.map((topic) => (
                  <tr 
                    key={topic.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => router.push(`/community/forum/topic/${topic.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        {topic.pinned && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-2">
                            공지
                          </span>
                        )}
                        {topic.hot && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 mr-2">
                            인기
                          </span>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {topic.title}
                          </div>
                          <div className="block sm:hidden text-xs text-gray-500 dark:text-gray-400">
                            {topic.category} · {topic.author.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{topic.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="flex items-center">
                        <img
                          src={topic.author.avatar}
                          alt={topic.author.name}
                          className="h-8 w-8 rounded-full mr-2"
                        />
                        <div className="text-sm text-gray-500 dark:text-gray-400">{topic.author.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      {topic.replies}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                      {topic.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {topic.lastActivity}
                    </td>
                  </tr>
                ))}
                {filteredTopics.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      표시할 토픽이 없습니다. 새로운 토픽을 작성해 보세요!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-center space-x-2">
          <button className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            이전
          </button>
          <button className="px-3 py-2 rounded-md bg-blue-600 text-white">1</button>
          <button className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            2
          </button>
          <button className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            3
          </button>
          <span className="px-3 py-2">...</span>
          <button className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            10
          </button>
          <button className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

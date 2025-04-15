'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 협업 제안 타입 정의
type Collaboration = {
  id: number;
  title: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  genre: string[];
  skills: string[];
  description: string;
  location: string;
  remote: boolean;
  paid: boolean;
  createdAt: string;
  deadline?: string;
  status: 'open' | 'in-progress' | 'completed';
};

// 필터 옵션 타입 정의
type FilterOptions = {
  genre: string | null;
  skill: string | null;
  remote: boolean | null;
  paid: boolean | null;
  status: string | null;
};

export default function CollaborationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    genre: null,
    skill: null,
    remote: null,
    paid: null,
    status: 'open',
  });

  // 협업 데이터 (실제 앱에서는 API에서 가져올 것)
  const collaborations: Collaboration[] = [
    {
      id: 1,
      title: '록 밴드 EP 레코딩을 위한 드러머 구합니다',
      author: {
        id: 'user1',
        name: '기타리스트M',
        avatar: 'https://i.pravatar.cc/150?img=11',
        rating: 4.8,
      },
      genre: ['Rock', 'Alternative'],
      skills: ['drums', 'percussion'],
      description:
        '저희는 5곡으로 구성된 EP를 준비 중인 4인조 밴드입니다. 드럼 녹음을 위한 경험 있는 드러머를 찾습니다. 모든 곡의 데모는 준비되어 있습니다.',
      location: '서울',
      remote: false,
      paid: true,
      createdAt: '2025-04-01',
      deadline: '2025-05-15',
      status: 'open',
    },
    {
      id: 2,
      title: '힙합 트랙을 위한 프로듀서와 래퍼 구합니다',
      author: {
        id: 'user2',
        name: '비트메이커K',
        avatar: 'https://i.pravatar.cc/150?img=12',
        rating: 4.5,
      },
      genre: ['Hip Hop', 'Trap'],
      skills: ['production', 'rap', 'mixing'],
      description:
        '10곡으로 구성된 힙합 앨범을 제작 중입니다. 비트 제작과 랩 파트를 도와줄 협업자를 찾습니다. 수익은 50/50으로 나눕니다.',
      location: '부산',
      remote: true,
      paid: false,
      createdAt: '2025-04-03',
      status: 'open',
    },
    {
      id: 3,
      title: '뮤직비디오 제작을 위한 감독 및 카메라맨 구합니다',
      author: {
        id: 'user3',
        name: '싱어송라이터J',
        avatar: 'https://i.pravatar.cc/150?img=13',
        rating: 5.0,
      },
      genre: ['Pop', 'R&B'],
      skills: ['video direction', 'cinematography'],
      description:
        '싱글 음원 발매를 앞두고 뮤직비디오 제작을 계획 중입니다. 창의적인 아이디어를 가진 감독과 카메라맨을 찾습니다. 예산이 제한적이지만 공정한 보상을 지급합니다.',
      location: '인천',
      remote: false,
      paid: true,
      createdAt: '2025-04-02',
      deadline: '2025-04-30',
      status: 'open',
    },
    {
      id: 4,
      title: '일렉트로닉 트랙 마스터링',
      author: {
        id: 'user4',
        name: 'DJ_Glory',
        avatar: 'https://i.pravatar.cc/150?img=14',
        rating: 4.7,
      },
      genre: ['Electronic', 'House'],
      skills: ['mastering'],
      description:
        '6곡으로 구성된 EP의 마스터링을 맡아줄 엔지니어를 찾습니다. 하우스와 테크노 스타일의 트랙입니다. 마스터링 경험이 필요합니다.',
      location: '대구',
      remote: true,
      paid: true,
      createdAt: '2025-03-25',
      deadline: '2025-04-20',
      status: 'in-progress',
    },
    {
      id: 5,
      title: '재즈 피아노 세션 녹음',
      author: {
        id: 'user5',
        name: '색소폰S',
        avatar: 'https://i.pravatar.cc/150?img=15',
        rating: 4.9,
      },
      genre: ['Jazz', 'Fusion'],
      skills: ['piano', 'keyboards'],
      description:
        '재즈 앨범 녹음을 위한 피아노 연주자를 찾습니다. 즉흥 연주 능력이 필요하며, 리허설 2회와 녹음 1회 참여가 필요합니다.',
      location: '서울',
      remote: false,
      paid: true,
      createdAt: '2025-03-20',
      status: 'completed',
    },
    {
      id: 6,
      title: '포크 어쿠스틱 프로젝트를 위한 보컬리스트',
      author: {
        id: 'user6',
        name: '어쿠스틱G',
        avatar: 'https://i.pravatar.cc/150?img=16',
        rating: 4.6,
      },
      genre: ['Folk', 'Acoustic'],
      skills: ['vocals', 'songwriting'],
      description:
        '어쿠스틱 기반의 포크 앨범을 준비중입니다. 여성 보컬리스트를 찾고 있으며, 공동 작사/작곡에도 참여할 수 있으면 좋습니다.',
      location: '광주',
      remote: true,
      paid: false,
      createdAt: '2025-04-05',
      status: 'open',
    },
    {
      id: 7,
      title: '클래식 현악 편곡 도움 필요',
      author: {
        id: 'user7',
        name: '클래시컬M',
        avatar: 'https://i.pravatar.cc/150?img=17',
        rating: 4.8,
      },
      genre: ['Classical', 'Contemporary'],
      skills: ['arrangement', 'composition'],
      description:
        '현대적인 클래식 작품의 현악 편곡을 도와줄 작곡가를 찾습니다. 현악 4중주를 위한 편곡이며, 관련 경험이 있는 분을 선호합니다.',
      location: '대전',
      remote: true,
      paid: true,
      createdAt: '2025-04-04',
      deadline: '2025-05-10',
      status: 'open',
    },
  ];

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 검색 기능 구현 (API 호출 등)
    console.log('검색어:', searchQuery);
  };

  // 필터 핸들러
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  // 협업 데이터 필터링
  const filteredCollaborations = collaborations.filter((collab) => {
    // 상태 필터링
    if (filters.status && filters.status !== 'all' && collab.status !== filters.status) {
      return false;
    }
    
    // 장르 필터링
    if (filters.genre && !collab.genre.includes(filters.genre)) {
      return false;
    }
    
    // 스킬 필터링
    if (filters.skill && !collab.skills.includes(filters.skill)) {
      return false;
    }
    
    // 원격 필터링
    if (filters.remote !== null && collab.remote !== filters.remote) {
      return false;
    }
    
    // 유료 필터링
    if (filters.paid !== null && collab.paid !== filters.paid) {
      return false;
    }
    
    // 검색어 필터링 (제목, 설명에서 검색)
    if (
      searchQuery &&
      !collab.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !collab.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });

  // 모든 장르 목록 생성
  const allGenres = Array.from(
    new Set(collaborations.flatMap((collab) => collab.genre))
  ).sort();

  // 모든 스킬 목록 생성
  const allSkills = Array.from(
    new Set(collaborations.flatMap((collab) => collab.skills))
  ).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">음악 협업</h1>
              <p className="text-gray-600 dark:text-gray-300">
                뮤지션, 프로듀서, 엔지니어 등 함께 작업할 인재를 찾아보세요.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
                onClick={() => router.push('/community/collaborations/create')}
              >
                협업 제안 등록
              </button>
            </div>
          </div>

          {/* 검색 폼 */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="협업 검색..."
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

        {/* 필터 섹션 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">필터</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">상태</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                value={filters.status || 'all'}
                onChange={(e) => handleFilterChange('status', e.target.value === 'all' ? null : e.target.value)}
              >
                <option value="all">모든 상태</option>
                <option value="open">모집중</option>
                <option value="in-progress">진행중</option>
                <option value="completed">완료됨</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">장르</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                value={filters.genre || ''}
                onChange={(e) => handleFilterChange('genre', e.target.value || null)}
              >
                <option value="">모든 장르</option>
                {allGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">필요 스킬</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                value={filters.skill || ''}
                onChange={(e) => handleFilterChange('skill', e.target.value || null)}
              >
                <option value="">모든 스킬</option>
                {allSkills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">원격 작업</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                value={filters.remote === null ? '' : filters.remote ? 'yes' : 'no'}
                onChange={(e) =>
                  handleFilterChange(
                    'remote',
                    e.target.value === '' ? null : e.target.value === 'yes'
                  )
                }
              >
                <option value="">모든 유형</option>
                <option value="yes">원격 가능</option>
                <option value="no">현장 작업만</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">보상 유형</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                value={filters.paid === null ? '' : filters.paid ? 'paid' : 'unpaid'}
                onChange={(e) =>
                  handleFilterChange(
                    'paid',
                    e.target.value === '' ? null : e.target.value === 'paid'
                  )
                }
              >
                <option value="">모든 유형</option>
                <option value="paid">유료</option>
                <option value="unpaid">무료/수익 공유</option>
              </select>
            </div>
          </div>
        </div>

        {/* 협업 목록 */}
        <div className="space-y-6 mb-8">
          {filteredCollaborations.length > 0 ? (
            filteredCollaborations.map((collab) => (
              <div
                key={collab.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
                onClick={() => router.push(`/community/collaborations/${collab.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-semibold">{collab.title}</h2>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        collab.status === 'open'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : collab.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {collab.status === 'open'
                        ? '모집중'
                        : collab.status === 'in-progress'
                        ? '진행중'
                        : '완료됨'}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{collab.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {collab.genre.map((g) => (
                      <span
                        key={g}
                        className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs font-medium"
                      >
                        {g}
                      </span>
                    ))}
                    {collab.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {collab.remote && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs font-medium">
                        원격 가능
                      </span>
                    )}
                    {collab.paid ? (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded text-xs font-medium">
                        유료
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded text-xs font-medium">
                        무료/수익 공유
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <img
                        src={collab.author.avatar}
                        alt={collab.author.name}
                        className="h-6 w-6 rounded-full mr-2"
                      />
                      <span>
                        {collab.author.name} · {collab.location}
                      </span>
                      <div className="ml-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-yellow-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1">{collab.author.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span>등록일: {collab.createdAt}</span>
                      {collab.deadline && (
                        <span className="ml-3">마감일: {collab.deadline}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 text-center">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                검색 조건에 맞는 협업 제안이 없습니다.
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    genre: null,
                    skill: null,
                    remote: null,
                    paid: null,
                    status: 'open',
                  });
                }}
                className="text-blue-600 dark:text-blue-400 font-medium"
              >
                필터 초기화
              </button>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {filteredCollaborations.length > 0 && (
          <div className="flex items-center justify-center space-x-2">
            <button className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              이전
            </button>
            <button className="px-3 py-2 rounded-md bg-blue-600 text-white">1</button>
            <button className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              2
            </button>
            <button className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

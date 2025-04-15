'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Room 타입 정의
type Room = {
  id: string;
  name: string;
  genre: string;
  participantCount: number;
  maxParticipants: number;
  hostName: string;
  isPasswordProtected: boolean;
  createdAt: string;
};

export default function SyncRoomList() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filterGenre, setFilterGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // 장르 목록
  const genres = [
    { value: 'all', label: '모든 장르' },
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

  // 방 목록 가져오기 (더미 데이터, 실제로는 API 호출)
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      try {
        // 모의 API 호출 (실제 구현 시 대체)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 더미 데이터
        const dummyRooms: Room[] = [
          {
            id: 'room_1',
            name: '기타 즉흥 연주 세션',
            genre: 'rock',
            participantCount: 3,
            maxParticipants: 4,
            hostName: '기타왕',
            isPasswordProtected: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10분 전
          },
          {
            id: 'room_2',
            name: '재즈 잼 세션',
            genre: 'jazz',
            participantCount: 4,
            maxParticipants: 4,
            hostName: '재즈피아니스트',
            isPasswordProtected: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5분 전
          },
          {
            id: 'room_3',
            name: '클래식 앙상블',
            genre: 'classical',
            participantCount: 2,
            maxParticipants: 6,
            hostName: '바이올리니스트',
            isPasswordProtected: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30분 전
          },
          {
            id: 'room_4',
            name: 'K-Pop 커버 세션',
            genre: 'kpop',
            participantCount: 3,
            maxParticipants: 5,
            hostName: '춤신춤왕',
            isPasswordProtected: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2분 전
          },
          {
            id: 'room_5',
            name: '힙합 비트메이킹',
            genre: 'hiphop',
            participantCount: 2,
            maxParticipants: 3,
            hostName: '비트박스',
            isPasswordProtected: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15분 전
          },
        ];
        
        setRooms(dummyRooms);
      } catch (error) {
        console.error('방 목록을 불러오는 데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // 방 필터링 및 정렬
  const filteredAndSortedRooms = React.useMemo(() => {
    let filteredRooms = [...rooms];
    
    // 장르로 필터링
    if (filterGenre !== 'all') {
      filteredRooms = filteredRooms.filter(room => room.genre === filterGenre);
    }
    
    // 검색어로 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredRooms = filteredRooms.filter(
        room => room.name.toLowerCase().includes(query) || room.hostName.toLowerCase().includes(query)
      );
    }
    
    // 자리 있는 방만 표시
    if (showOnlyAvailable) {
      filteredRooms = filteredRooms.filter(room => room.participantCount < room.maxParticipants);
    }
    
    // 정렬
    switch (sortBy) {
      case 'newest':
        filteredRooms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filteredRooms.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'nameAsc':
        filteredRooms.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        filteredRooms.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'participants':
        filteredRooms.sort((a, b) => b.participantCount - a.participantCount);
        break;
    }
    
    return filteredRooms;
  }, [rooms, filterGenre, searchQuery, showOnlyAvailable, sortBy]);

  // 방 입장
  const joinRoom = (roomId: string, isPasswordProtected: boolean) => {
    if (isPasswordProtected) {
      // 비밀번호 입력 다이얼로그 열기 (실제 구현 시)
      const password = prompt('이 방은 비밀번호로 보호되어 있습니다. 비밀번호를 입력하세요:');
      
      if (!password) {
        return; // 사용자가 취소했거나 빈 비밀번호 입력
      }
      
      // 실제로는 비밀번호 검증 후 입장 처리 필요
      console.log(`비밀번호 ${password}로 방 ${roomId} 입장 시도`);
    }
    
    // 방으로 이동
    router.push(`/sync-room/${roomId}`);
  };

  // 상대 시간 표시 (예: "5분 전")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
  };

  // 장르 한글 이름 가져오기
  const getGenreLabel = (genreValue: string) => {
    const genre = genres.find(g => g.value === genreValue);
    return genre ? genre.label : genreValue;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">실시간 잼 세션</h1>
          <p className="mt-2 text-lg text-gray-600">
            다른 음악가들과 실시간으로 연주하고 협업하세요.
          </p>
        </div>

        {/* 필터 및 검색 섹션 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              {/* 장르 필터 */}
              <div className="w-full sm:w-40">
                <label htmlFor="filterGenre" className="block text-sm font-medium text-gray-700 mb-1">
                  장르
                </label>
                <select
                  id="filterGenre"
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
                >
                  {genres.map((genre) => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 정렬 방식 */}
              <div className="w-full sm:w-40">
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                  정렬
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="newest">최신순</option>
                  <option value="oldest">오래된순</option>
                  <option value="nameAsc">이름 (오름차순)</option>
                  <option value="nameDesc">이름 (내림차순)</option>
                  <option value="participants">참가자 많은순</option>
                </select>
              </div>

              {/* 자리 있는 방만 표시 */}
              <div className="flex items-center">
                <input
                  id="showOnlyAvailable"
                  type="checkbox"
                  checked={showOnlyAvailable}
                  onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="showOnlyAvailable" className="ml-2 block text-sm text-gray-700">
                  자리 있는 방만 보기
                </label>
              </div>
            </div>

            {/* 검색 */}
            <div className="w-full lg:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="방 이름 또는 호스트 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons text-gray-400 text-lg">search</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 방 만들기 버튼 */}
        <div className="flex justify-end mb-6">
          <Link 
            href="/sync-room/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <span className="material-icons mr-1 text-sm">add</span>
            새 방 만들기
          </Link>
        </div>

        {/* 방 목록 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredAndSortedRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{room.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        호스트: {room.hostName} • {formatRelativeTime(room.createdAt)}
                      </p>
                    </div>
                    {room.isPasswordProtected && (
                      <div className="flex items-start" title="비밀번호 보호">
                        <span className="material-icons text-gray-400">lock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {getGenreLabel(room.genre)}
                    </span>
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        room.participantCount === room.maxParticipants 
                        ? 'bg-red-100 text-red-800'
                        : room.participantCount > room.maxParticipants * 0.7
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {room.participantCount}/{room.maxParticipants} 참가자
                    </span>
                  </div>
                  
                  <button
                    onClick={() => joinRoom(room.id, room.isPasswordProtected)}
                    disabled={room.participantCount >= room.maxParticipants}
                    className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                      room.participantCount >= room.maxParticipants
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
                    }`}
                  >
                    {room.participantCount >= room.maxParticipants ? '방 가득참' : '입장하기'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <span className="material-icons text-gray-400 text-2xl">search_off</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">조건에 맞는 방이 없습니다</h3>
            <p className="text-gray-500 mb-4">필터 조건을 변경하거나 새 방을 직접 만들어 보세요.</p>
            <Link
              href="/sync-room/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span className="material-icons mr-1 text-sm">add</span>
              새 방 만들기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
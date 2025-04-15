'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  likes: number;
  comments: number;
  genre: string;
  createdAt: string;
  description: string;
}

// 임시 데이터
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: '빗소리 (Rain Sounds)',
    artist: '김하늘',
    imageUrl: '/assets/showcase/project1.jpg',
    audioUrl: '/assets/showcase/audio1.mp3',
    likes: 124,
    comments: 23,
    genre: '일렉트로닉',
    createdAt: '2025-03-15',
    description: '비 오는 날의 감성을 담은 편안한 BGM입니다.'
  },
  {
    id: '2',
    title: '새벽 산책 (Morning Walk)',
    artist: '박새벽',
    imageUrl: '/assets/showcase/project2.jpg',
    audioUrl: '/assets/showcase/audio2.mp3',
    likes: 87,
    comments: 12,
    genre: '어쿠스틱',
    createdAt: '2025-03-18',
    description: '새벽에 산책하며 만든 잔잔한 어쿠스틱 곡입니다.'
  },
  {
    id: '3',
    title: '도시의 밤 (City Nights)',
    artist: '이도시',
    imageUrl: '/assets/showcase/project3.jpg',
    audioUrl: '/assets/showcase/audio3.mp3',
    likes: 203,
    comments: 45,
    genre: '팝',
    createdAt: '2025-03-05',
    description: '도시의 밤거리를 걸으며 느끼는 감정을 담았습니다.'
  },
  {
    id: '4',
    title: '꿈속의 여행 (Dream Journey)',
    artist: '정꿈나무',
    imageUrl: '/assets/showcase/project4.jpg',
    audioUrl: '/assets/showcase/audio4.mp3',
    likes: 56,
    comments: 8,
    genre: '앰비언트',
    createdAt: '2025-03-22',
    description: '꿈속을 여행하는 듯한 몽환적인 사운드스케이프입니다.'
  },
  {
    id: '5',
    title: '여름 바다 (Summer Ocean)',
    artist: '최바다',
    imageUrl: '/assets/showcase/project5.jpg',
    audioUrl: '/assets/showcase/audio5.mp3',
    likes: 142,
    comments: 31,
    genre: '칠아웃',
    createdAt: '2025-03-10',
    description: '여름 바다의 푸른 파도 소리를 담은 릴렉싱 음악입니다.'
  },
  {
    id: '6',
    title: '별이 빛나는 밤 (Starry Night)',
    artist: '강별빛',
    imageUrl: '/assets/showcase/project6.jpg',
    audioUrl: '/assets/showcase/audio6.mp3',
    likes: 178,
    comments: 27,
    genre: '클래식',
    createdAt: '2025-03-08',
    description: '밤하늘의 별들을 바라보며 만든 피아노 솔로 작품입니다.'
  }
];

// 장르 목록
const GENRES = [
  '전체',
  '팝',
  '록',
  '힙합',
  '일렉트로닉',
  '클래식',
  '재즈',
  '어쿠스틱',
  '칠아웃',
  '앰비언트'
];

export default function ShowcasePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedGenre, setSelectedGenre] = useState<string>('전체');
  const [sortOption, setSortOption] = useState<string>('latest');
  const [playing, setPlaying] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // 오디오 요소 레퍼런스
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  // 장르, 정렬, 검색어에 따라 프로젝트 필터링
  useEffect(() => {
    let filtered = [...MOCK_PROJECTS];
    
    // 장르 필터링
    if (selectedGenre !== '전체') {
      filtered = filtered.filter(project => project.genre === selectedGenre);
    }
    
    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 정렬
    if (sortOption === 'latest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'likes') {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (sortOption === 'comments') {
      filtered.sort((a, b) => b.comments - a.comments);
    } else if (sortOption === 'alphabetical') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setProjects(filtered);
  }, [selectedGenre, sortOption, searchTerm]);
  
  // 오디오 재생/정지 토글
  const togglePlay = (projectId: string, audioUrl: string) => {
    if (playing === projectId) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(error => console.error('오디오 재생 오류:', error));
        setPlaying(projectId);
      }
    }
  };
  
  // 좋아요 기능
  const handleLike = (projectId: string) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, likes: project.likes + 1 } 
          : project
      )
    );
  };
  
  // 새 프로젝트 업로드
  const handleUploadClick = () => {
    router.push('/community/showcase/upload');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">작품 쇼케이스</h1>
          <p className="text-gray-600 dark:text-gray-400">
            SyncBand 커뮤니티의 창작물을 발견하고 공유하세요
          </p>
        </div>
        
        <button
          onClick={handleUploadClick}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          작품 업로드
        </button>
      </div>
      
      {/* 필터 및 검색 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="genre-filter" className="block text-sm font-medium mb-1">장르</label>
            <select
              id="genre-filter"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              {GENRES.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="sort-option" className="block text-sm font-medium mb-1">정렬 기준</label>
            <select
              id="sort-option"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="latest">최신순</option>
              <option value="likes">좋아요순</option>
              <option value="comments">댓글순</option>
              <option value="alphabetical">제목순</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="search" className="block text-sm font-medium mb-1">검색</label>
            <input
              type="text"
              id="search"
              placeholder="제목, 아티스트 또는 설명 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
      
      {/* 쇼케이스 그리드 */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div 
              key={project.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl"
            >
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                {/* 임시 이미지 대체 */}
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{project.title}</span>
                </div>
                
                <button 
                  onClick={() => togglePlay(project.id, project.audioUrl)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition duration-300"
                >
                  {playing === project.id ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
                
                <span className="absolute bottom-2 right-2 bg-gray-800/70 text-white px-2 py-1 rounded text-xs">
                  {project.genre}
                </span>
              </div>
              
              <div className="p-4">
                <Link href={`/community/showcase/${project.id}`}>
                  <h3 className="text-xl font-semibold mb-1 hover:text-blue-600 transition duration-300">{project.title}</h3>
                </Link>
                <Link href={`/profile/${project.artist}`}>
                  <p className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition duration-300">
                    {project.artist}
                  </p>
                </Link>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{project.description}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleLike(project.id)}
                      className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-500 transition duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span>{project.likes}</span>
                    </button>
                    <Link href={`/community/showcase/${project.id}#comments`} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 transition duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>{project.comments}</span>
                    </Link>
                  </div>
                  <span className="text-xs text-gray-500">{project.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">작품을 찾을 수 없습니다</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            검색 조건에 맞는 작품이 없습니다. 다른 장르를 선택하거나 검색어를 변경해보세요.
          </p>
        </div>
      )}
      
      {/* 히든 오디오 플레이어 */}
      <audio ref={audioRef} className="hidden" onEnded={() => setPlaying(null)} />
    </div>
  );
}

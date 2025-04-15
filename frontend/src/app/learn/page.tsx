'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 추천 코스 타입 정의
type Course = {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  instructor: string;
  duration: string;
  image: string;
  rating: number;
  totalLessons: number;
};

// 악기 카테고리 타입 정의
type InstrumentCategory = {
  id: string;
  name: string;
  icon: string;
  path: string;
  description: string;
};

export default function Learn() {
  // 추천 코스 더미 데이터
  const featuredCourses: Course[] = [
    {
      id: 'course-1',
      title: '기타 입문: 기초부터 시작하기',
      description: '기타를 처음 접하는 분들을 위한 기초 코스입니다. 기타 구조, 튜닝, 기본 코드, 스트럼 패턴을 배웁니다.',
      level: 'beginner',
      category: '기타',
      instructor: '김기타',
      duration: '4주',
      image: '/assets/courses/guitar-basics.jpg',
      rating: 4.8,
      totalLessons: 24,
    },
    {
      id: 'course-2',
      title: '피아노 기초: 클래식에서 팝까지',
      description: '피아노의 기본 연주법과 음악 이론을 배우며 다양한 장르의 곡을 연주해봅니다.',
      level: 'beginner',
      category: '피아노',
      instructor: '박피아노',
      duration: '6주',
      image: '/assets/courses/piano-basics.jpg',
      rating: 4.7,
      totalLessons: 30,
    },
    {
      id: 'course-3',
      title: '드럼 중급: 복잡한 리듬 마스터하기',
      description: '기본기를 넘어 다양한 장르의 복잡한 리듬을 배우고 연주 실력을 향상시킵니다.',
      level: 'intermediate',
      category: '드럼',
      instructor: '최드러머',
      duration: '5주',
      image: '/assets/courses/drum-intermediate.jpg',
      rating: 4.9,
      totalLessons: 25,
    },
    {
      id: 'course-4',
      title: '보컬 트레이닝: 목소리의 힘 키우기',
      description: '올바른 호흡법과 발성법으로 목소리의 힘과 톤을 향상시키는 보컬 코스입니다.',
      level: 'beginner',
      category: '보컬',
      instructor: '이보컬',
      duration: '8주',
      image: '/assets/courses/vocal-training.jpg',
      rating: 4.6,
      totalLessons: 32,
    },
  ];

  // 악기 카테고리
  const instrumentCategories: InstrumentCategory[] = [
    {
      id: 'guitar',
      name: '기타',
      icon: 'music_note',
      path: '/learn/instruments/guitar',
      description: '어쿠스틱, 일렉트릭, 클래식 기타까지 다양한 기타 기법을 배워보세요.',
    },
    {
      id: 'piano',
      name: '피아노',
      icon: 'piano',
      path: '/learn/instruments/piano',
      description: '건반의 기초부터 고급 연주 기법까지 체계적으로 배울 수 있습니다.',
    },
    {
      id: 'drums',
      name: '드럼',
      icon: 'music_note',
      path: '/learn/instruments/drums',
      description: '리듬의 기본과 다양한 타악기 연주법을 학습하세요.',
    },
    {
      id: 'vocal',
      name: '보컬',
      icon: 'mic',
      path: '/learn/instruments/vocal',
      description: '올바른 발성법, 호흡법으로 가창력을 향상시키세요.',
    },
    {
      id: 'bass',
      name: '베이스',
      icon: 'music_note',
      path: '/learn/instruments/bass',
      description: '그루브와 베이스 라인 작성의 기술을 배워보세요.',
    },
    {
      id: 'various',
      name: '기타 악기',
      icon: 'album',
      path: '/learn/instruments',
      description: '바이올린, 첼로, 색소폰 등 다양한 악기 튜토리얼을 찾아보세요.',
    },
  ];

  // 레벨에 따른 배지 색상 설정
  const getLevelBadgeColor = (level: string) => {
    switch(level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 레벨 한글화
  const getLevelLabel = (level: string) => {
    switch(level) {
      case 'beginner':
        return '입문';
      case 'intermediate':
        return '중급';
      case 'advanced':
        return '고급';
      default:
        return level;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 히어로 섹션 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SyncBand 학습 센터</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            코스, 튜토리얼, 가이드 등 다양한 자료로 음악 실력을 향상시키세요.
            모든 수준의 음악가를 위한 컨텐츠가 준비되어 있습니다.
          </p>
        </div>

        {/* 추천 코스 섹션 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">추천 코스</h2>
            <Link
              href="/learn/courses"
              className="text-primary hover:text-primary/80 transition-colors flex items-center"
            >
              모든 코스 보기
              <span className="material-icons ml-1 text-sm">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <Link
                href={`/learn/courses/${course.id}`}
                key={course.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    {/* 이미지가 없을 경우 대체 텍스트 (실제 구현 시 이미지 추가) */}
                    <span className="text-gray-400">{course.title} 커버 이미지</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelBadgeColor(course.level)}`}>
                      {getLevelLabel(course.level)}
                    </span>
                    <span className="ml-2 text-gray-500 text-sm">{course.category}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">강사: {course.instructor} • {course.duration}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="material-icons text-yellow-400 text-sm">star</span>
                      <span className="text-sm font-medium text-gray-900 ml-1">{course.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">{course.totalLessons}개 레슨</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 악기별 학습 섹션 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">악기별 학습</h2>
            <Link
              href="/learn/instruments"
              className="text-primary hover:text-primary/80 transition-colors flex items-center"
            >
              모든 악기 보기
              <span className="material-icons ml-1 text-sm">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instrumentCategories.map((instrument) => (
              <Link
                href={instrument.path}
                key={instrument.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow p-6 flex"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                  <span className="material-icons text-primary">{instrument.icon}</span>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{instrument.name}</h3>
                  <p className="text-gray-600 text-sm">{instrument.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 학습 자료 및 리소스 섹션 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">학습 자료 및 리소스</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
              <span className="material-icons text-3xl mb-4">book</span>
              <h3 className="text-xl font-bold mb-2">음악 이론 가이드</h3>
              <p className="mb-4">화성학, 음계, 리듬 등 음악의 기초 이론을 배우세요.</p>
              <Link
                href="/learn/theory"
                className="inline-flex items-center text-sm font-medium text-white hover:underline"
              >
                시작하기 <span className="material-icons ml-1 text-sm">arrow_forward</span>
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow p-6">
              <span className="material-icons text-3xl mb-4">equalizer</span>
              <h3 className="text-xl font-bold mb-2">믹싱 & 마스터링</h3>
              <p className="mb-4">전문적인 사운드를 위한 오디오 편집 기술을 배우세요.</p>
              <Link
                href="/learn/mixing"
                className="inline-flex items-center text-sm font-medium text-white hover:underline"
              >
                시작하기 <span className="material-icons ml-1 text-sm">arrow_forward</span>
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-6">
              <span className="material-icons text-3xl mb-4">music_note</span>
              <h3 className="text-xl font-bold mb-2">작곡 & 편곡</h3>
              <p className="mb-4">나만의 음악을 만들기 위한 작곡 및 편곡 기법을 배우세요.</p>
              <Link
                href="/learn/composition"
                className="inline-flex items-center text-sm font-medium text-white hover:underline"
              >
                시작하기 <span className="material-icons ml-1 text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 커뮤니티 및 지원 섹션 */}
        <section className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">함께 배우고 성장하세요</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            질문이 있거나 다른 음악가들과 지식을 공유하고 싶으신가요? SyncBand의 커뮤니티에 참여하세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/community/forum"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              커뮤니티 포럼
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              자주 묻는 질문
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

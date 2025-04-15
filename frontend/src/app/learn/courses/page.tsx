'use client';

import { useState, useEffect } from 'react';
import CourseCard from '@/components/features/learn/CourseCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/common/Tabs';

// 샘플 데이터 타입 정의
interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  coverImage: string;
  duration: number; // 분 단위
  lessonCount: number;
  rating?: number;
  ratingCount?: number;
  price?: number;
  isFree: boolean;
  isPopular: boolean;
  isNew: boolean;
  createdAt: string;
  tags: string[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');

  // 강의 데이터 가져오기
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        // 실제로는 API 호출로 데이터를 가져옴
        // const response = await fetch('/api/courses');
        // const data = await response.json();

        // 샘플 데이터 (실제 구현 시 API에서 가져와야 함)
        const sampleCourses: Course[] = [
          {
            id: 'course-1',
            title: '기초부터 배우는 피아노 마스터 클래스',
            description: '피아노를 처음 배우는 분들을 위한 기초 강의',
            level: 'beginner',
            instructor: {
              id: 'instructor-1',
              name: '김피아노',
              avatar: '/assets/instructor-1.jpg'
            },
            category: '피아노',
            coverImage: '/assets/piano-course-cover.jpg',
            duration: 720, // 12시간
            lessonCount: 24,
            rating: 4.8,
            ratingCount: 235,
            price: 99000,
            isFree: false,
            isPopular: true,
            isNew: false,
            createdAt: '2023-01-15T00:00:00Z',
            tags: ['피아노', '클래식', '초보자']
          },
          {
            id: 'course-2',
            title: '어쿠스틱 기타 입문자를 위한 코드와 주법',
            description: '기타의 기본 코드와 주법을 쉽게 배우는 입문 강의',
            level: 'beginner',
            instructor: {
              id: 'instructor-2',
              name: '박기타',
              avatar: '/assets/instructor-2.jpg'
            },
            category: '기타',
            coverImage: '/assets/guitar-course-cover.jpg',
            duration: 480, // 8시간
            lessonCount: 16,
            rating: 4.7,
            ratingCount: 189,
            price: 79000,
            isFree: false,
            isPopular: true,
            isNew: false,
            createdAt: '2023-02-20T00:00:00Z',
            tags: ['기타', '어쿠스틱', '코드', '핑거스타일']
          },
          {
            id: 'course-3',
            title: '일렉트릭 기타 중급: 솔로와 리프 마스터하기',
            description: '일렉트릭 기타의 다양한 솔로 테크닉과 리프를 배우는 중급 과정',
            level: 'intermediate',
            instructor: {
              id: 'instructor-3',
              name: '이일렉',
              avatar: '/assets/instructor-3.jpg'
            },
            category: '기타',
            coverImage: '/assets/electric-guitar-course-cover.jpg',
            duration: 600, // 10시간
            lessonCount: 20,
            rating: 4.9,
            ratingCount: 127,
            price: 89000,
            isFree: false,
            isPopular: false,
            isNew: false,
            createdAt: '2023-03-10T00:00:00Z',
            tags: ['기타', '일렉트릭', '솔로', '록', '블루스']
          },
          {
            id: 'course-4',
            title: '드럼 입문: 기본 리듬과 패턴 마스터하기',
            description: '드럼의 기초부터 시작해 다양한 리듬과 패턴을 배우는 강의',
            level: 'beginner',
            instructor: {
              id: 'instructor-4',
              name: '최드러머',
              avatar: '/assets/instructor-4.jpg'
            },
            category: '드럼',
            coverImage: '/assets/drum-course-cover.jpg',
            duration: 540, // 9시간
            lessonCount: 18,
            rating: 4.6,
            ratingCount: 98,
            price: 0,
            isFree: true,
            isPopular: false,
            isNew: true,
            createdAt: '2023-04-05T00:00:00Z',
            tags: ['드럼', '리듬', '비트', '초보자']
          },
          {
            id: 'course-5',
            title: '실용 음악 이론 기초',
            description: '실용 음악 이론의 기초를 쉽게 이해하고 적용하는 방법',
            level: 'beginner',
            instructor: {
              id: 'instructor-5',
              name: '정교수',
              avatar: '/assets/instructor-5.jpg'
            },
            category: '음악이론',
            coverImage: '/assets/music-theory-course-cover.jpg',
            duration: 420, // 7시간
            lessonCount: 14,
            rating: 4.9,
            ratingCount: 215,
            price: 0,
            isFree: true,
            isPopular: true,
            isNew: false,
            createdAt: '2023-02-28T00:00:00Z',
            tags: ['음악이론', '화성학', '작곡', '초보자']
          },
          {
            id: 'course-6',
            title: '베이스 기타 입문',
            description: '베이스 기타를 처음 접하는 분들을 위한 기초 강의',
            level: 'beginner',
            instructor: {
              id: 'instructor-6',
              name: '이베이스',
              avatar: '/assets/instructor-6.jpg'
            },
            category: '베이스',
            coverImage: '/assets/bass-course-cover.jpg',
            duration: 480, // 8시간
            lessonCount: 16,
            rating: 4.7,
            ratingCount: 87,
            price: 69000,
            isFree: false,
            isPopular: false,
            isNew: true,
            createdAt: '2023-05-15T00:00:00Z',
            tags: ['베이스', '그루브', '핑거링', '초보자']
          },
          {
            id: 'course-7',
            title: '재즈 피아노 중급: 즉흥 연주와 화성',
            description: '재즈 피아노의 즉흥 연주 기법과 고급 화성을 배우는 중급 과정',
            level: 'intermediate',
            instructor: {
              id: 'instructor-7',
              name: '한재즈',
              avatar: '/assets/instructor-7.jpg'
            },
            category: '피아노',
            coverImage: '/assets/jazz-piano-course-cover.jpg',
            duration: 660, // 11시간
            lessonCount: 22,
            rating: 4.8,
            ratingCount: 112,
            price: 109000,
            isFree: false,
            isPopular: false,
            isNew: false,
            createdAt: '2023-03-20T00:00:00Z',
            tags: ['피아노', '재즈', '즉흥연주', '화성']
          },
          {
            id: 'course-8',
            title: '보컬 트레이닝: 발성과 호흡법',
            description: '올바른 발성과 호흡법으로 노래 실력 향상시키기',
            level: 'beginner',
            instructor: {
              id: 'instructor-8',
              name: '김보컬',
              avatar: '/assets/instructor-8.jpg'
            },
            category: '보컬',
            coverImage: '/assets/vocal-course-cover.jpg',
            duration: 540, // 9시간
            lessonCount: 18,
            rating: 4.7,
            ratingCount: 165,
            price: 89000,
            isFree: false,
            isPopular: true,
            isNew: false,
            createdAt: '2023-04-10T00:00:00Z',
            tags: ['보컬', '발성', '호흡', '노래']
          }
        ];

        setCourses(sampleCourses);
        setFilteredCourses(sampleCourses);
      } catch (err) {
        setError('강의 목록을 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 필터링 및 정렬 적용
  useEffect(() => {
    if (!courses.length) return;

    let result = [...courses];

    // 검색어 필터링
    if (searchQuery.trim()) {
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      result = result.filter(course => course.category === selectedCategory);
    }

    // 난이도 필터링
    if (selectedLevel !== 'all') {
      result = result.filter(course => course.level === selectedLevel);
    }

    // 정렬
    switch (selectedSort) {
      case 'popular':
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => (a.isFree ? -1 : a.price || 0) - (b.isFree ? -1 : b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.isFree ? -1 : b.price || 0) - (a.isFree ? -1 : a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    setFilteredCourses(result);
  }, [courses, searchQuery, selectedCategory, selectedLevel, selectedSort]);

  // 카테고리 목록 추출
  const categories = ['all', ...Array.from(new Set(courses.map(course => course.category)))];

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // 난이도 변경 핸들러
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(e.target.value);
  };

  // 정렬 변경 핸들러
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSort(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">강의 목록</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-2/3"></div>
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">오류:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">음악 강의</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        다양한 악기와 음악 이론을 배워보세요. 초보자부터 고급자까지 모두를 위한 강의가 준비되어 있습니다.
      </p>

      {/* 필터링 및 검색 영역 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="강의 검색..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 material-icons text-gray-400">search</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="w-full sm:w-40">
              <select
                value={selectedLevel}
                onChange={handleLevelChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">모든 난이도</option>
                <option value="beginner">초급</option>
                <option value="intermediate">중급</option>
                <option value="advanced">고급</option>
              </select>
            </div>
            <div className="w-full sm:w-40">
              <select
                value={selectedSort}
                onChange={handleSortChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="popular">인기순</option>
                <option value="newest">최신순</option>
                <option value="rating">평점순</option>
                <option value="price-low">가격 낮은순</option>
                <option value="price-high">가격 높은순</option>
              </select>
            </div>
          </div>
        </div>

        {/* 카테고리 탭 */}
        <Tabs defaultValue="all" onValueChange={handleCategoryChange}>
          <TabsList className="flex overflow-x-auto hide-scrollbar">
            <TabsTrigger value="all">전체</TabsTrigger>
            {categories.filter(cat => cat !== 'all').map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* 결과 메시지 */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          {filteredCourses.length}개의 강의를 찾았습니다
        </p>
      </div>

      {/* 강의 목록 그리드 */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              coverImage={course.coverImage}
              instructor={course.instructor}
              category={course.category}
              level={course.level}
              lessonCount={course.lessonCount}
              duration={course.duration}
              rating={course.rating}
              ratingCount={course.ratingCount}
              price={course.price}
              isFree={course.isFree}
              isPopular={course.isPopular}
              isNew={course.isNew}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="material-icons text-5xl text-gray-400 mb-4">search_off</div>
          <h3 className="text-xl font-medium mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            다른 검색어를 입력하거나 필터를 조정해 보세요.
          </p>
        </div>
      )}
    </div>
  );
}

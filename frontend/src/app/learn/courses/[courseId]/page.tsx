'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/common/Tabs';
import VideoPlayer from '@/components/features/learn/VideoPlayer';
import LessonList from '@/components/features/learn/LessonList';

// 샘플 데이터 타입 정의
interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // 초
  videoUrl: string;
  isFree: boolean;
  isCompleted?: boolean; // 선택적 속성으로 변경
}

interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    bio: string;
  };
  category: string;
  coverImage: string;
  duration: number; // 분 단위
  lessons: Lesson[];
  rating: number;
  ratingCount: number;
  price?: number;
  isFree: boolean;
  prerequisites?: string[];
  learningOutcomes: string[];
  requirements: string[];
  createdAt: string;
  updatedAt: string;
}

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 강의 데이터 가져오기
  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      try {
        // 실제로는 API 호출로 데이터를 가져옴
        // const response = await fetch(`/api/courses/${courseId}`);
        // const data = await response.json();

        // 샘플 데이터 (실제 구현 시 API에서 가져와야 함)
        const sampleCourse: Course = {
          id: courseId as string,
          title: '기초부터 배우는 피아노 마스터 클래스',
          description: '피아노를 처음 배우는 분들을 위한 기초 강의',
          longDescription: '이 강의는 피아노를 처음 접하는 초보자부터 중급자까지 모두가 쉽게 이해할 수 있도록 설계되었습니다. 음계, 코드, 리듬 등 기본적인 음악 이론부터 시작해 실제 곡 연주까지 단계별로 배워볼 수 있습니다. 기초 테크닉부터 점차 난이도를 높여가며 학습하며, 클래식부터 팝, 재즈까지 다양한 장르의 곡을 연습할 수 있습니다.',
          level: 'beginner',
          instructor: {
            id: 'instructor-1',
            name: '김피아노',
            avatar: '/assets/instructor-1.jpg',
            bio: '15년차 피아노 강사로 국내외 다양한 공연과 마스터클래스를 진행했으며, 300명 이상의 학생들을 가르쳤습니다.'
          },
          category: '피아노',
          coverImage: '/assets/piano-course-cover.jpg',
          duration: 720, // 12시간
          lessons: [
            {
              id: 'lesson-1',
              title: '피아노 기초: 올바른 자세와 손 위치',
              description: '피아노를 연주하기 위한 기본 자세와 손 위치를 배웁니다.',
              duration: 900, // 15분
              videoUrl: 'https://example.com/videos/lesson-1.mp4',
              isFree: true,
              isCompleted: false
            },
            {
              id: 'lesson-2',
              title: '음계와 코드의 기초',
              description: 'C 메이저 스케일과 기본 코드를 배웁니다.',
              duration: 1200, // 20분
              videoUrl: 'https://example.com/videos/lesson-2.mp4',
              isFree: true,
              isCompleted: false
            },
            {
              id: 'lesson-3',
              title: '첫 번째 곡: 작은 별 변주곡',
              description: '트윙클 리틀 스타(작은 별) 곡을 통해 기본 멜로디를 연습합니다.',
              duration: 1500, // 25분
              videoUrl: 'https://example.com/videos/lesson-3.mp4',
              isFree: false,
              isCompleted: false
            }
            // 추가 레슨...
          ],
          rating: 4.8,
          ratingCount: 235,
          price: 99000,
          isFree: false,
          prerequisites: ['없음 - 완전 초보자도 수강 가능합니다.'],
          learningOutcomes: [
            '피아노의 기본 자세와 손 위치를 이해합니다.',
            '기본 음계와 코드를 배우고 연습할 수 있습니다.',
            '간단한 곡들을 연주할 수 있습니다.',
            '음악 이론의 기초를 이해합니다.'
          ],
          requirements: ['피아노 또는 키보드 악기'],
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2023-04-20T00:00:00Z'
        };

        setCourse(sampleCourse);
        setSelectedLesson(sampleCourse.lessons[0]);
      } catch (err) {
        setError('강의 정보를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  // 레슨 선택 핸들러
  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    // 수강 이력 업데이트 등의 추가 로직...
  };

  // 난이도 한글 표시
  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return level;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">오류:</strong>
          <span className="block sm:inline"> {error || '강의를 찾을 수 없습니다.'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-8 pb-16 px-4">
      {/* 강의 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
        
        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
          <span className="flex items-center">
            <span className="material-icons text-yellow-500 mr-1">star</span>
            <span>{course.rating.toFixed(1)} ({course.ratingCount} 수강평)</span>
          </span>
          <span className="flex items-center">
            <span className="material-icons mr-1">schedule</span>
            <span>총 {Math.floor(course.duration / 60)}시간 {course.duration % 60}분</span>
          </span>
          <span className="flex items-center">
            <span className="material-icons mr-1">school</span>
            <span>{getLevelText(course.level)}</span>
          </span>
          <span className="flex items-center">
            <span className="material-icons mr-1">update</span>
            <span>최근 업데이트: {new Date(course.updatedAt).toLocaleDateString()}</span>
          </span>
        </div>
        
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3">
            {course.instructor.avatar && (
              <Image 
                src={course.instructor.avatar} 
                alt={course.instructor.name} 
                width={48} 
                height={48} 
                className="object-cover" 
              />
            )}
          </div>
          <div>
            <p className="font-medium">강사: {course.instructor.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{course.instructor.bio.substring(0, 60)}...</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 강의 컨텐츠 영역 */}
        <div className="lg:col-span-2">
          {/* 비디오 플레이어 */}
          {selectedLesson && (
            <div className="mb-6">
              <VideoPlayer 
                videoUrl={selectedLesson.videoUrl} 
                title={selectedLesson.title} 
                isPremium={!selectedLesson.isFree && !course.isFree}
              />
              <h2 className="text-xl font-semibold mt-4 mb-2">{selectedLesson.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{selectedLesson.description}</p>
            </div>
          )}

          {/* 강의 탭 내용 */}
          <Tabs defaultValue="overview" className="mt-8">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">강의 개요</TabsTrigger>
              <TabsTrigger value="curriculum">커리큘럼</TabsTrigger>
              <TabsTrigger value="reviews">수강평</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">강의 소개</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {course.longDescription}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">배울 내용</h3>
                  <ul className="space-y-2">
                    {course.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex">
                        <span className="material-icons text-green-500 mr-2">check_circle</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">선수 지식</h3>
                    <ul className="space-y-1">
                      {course.prerequisites.map((prerequisite, index) => (
                        <li key={index} className="flex">
                          <span className="material-icons text-blue-500 mr-2">info</span>
                          <span>{prerequisite}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-2">수강 요구사항</h3>
                  <ul className="space-y-1">
                    {course.requirements.map((requirement, index) => (
                      <li key={index} className="flex">
                        <span className="material-icons text-gray-500 mr-2">desktop_windows</span>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="curriculum">
              <LessonList 
                lessons={course.lessons} 
                onLessonSelect={handleLessonSelect} 
                selectedLessonId={selectedLesson?.id} 
                isPremiumContent={!course.isFree} 
              />
            </TabsContent>

            <TabsContent value="reviews">
              <div className="text-center py-8">
                <p className="text-gray-500">아직 등록된 수강평이 없습니다.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 사이드바: 강의 등록/정보 */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
            {course.isFree ? (
              <div className="text-2xl font-bold text-green-600 mb-4">무료 강의</div>
            ) : (
              <div className="text-2xl font-bold mb-4">{course.price?.toLocaleString()}원</div>
            )}

            <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-md mb-4">
              {course.isFree ? '무료로 수강하기' : '수강 신청하기'}
            </button>

            <button className="w-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-md border border-gray-300 dark:border-gray-600 mb-6">
              위시리스트에 추가
            </button>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">총 강의 수</span>
                <span className="font-medium">{course.lessons.length}개</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">총 강의 시간</span>
                <span className="font-medium">{Math.floor(course.duration / 60)}시간 {course.duration % 60}분</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">난이도</span>
                <span className="font-medium">{getLevelText(course.level)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">카테고리</span>
                <span className="font-medium">{course.category}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3">이 강의를 공유하세요</h4>
              <div className="flex space-x-3">
                <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <span className="material-icons">share</span>
                </button>
                <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <span className="material-icons">facebook</span>
                </button>
                <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <span className="material-icons">link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

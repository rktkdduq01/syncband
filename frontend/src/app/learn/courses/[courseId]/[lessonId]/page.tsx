'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import VideoPlayer from '@/components/features/learn/VideoPlayer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/common/Tabs';

// 샘플 데이터 타입 정의 (실제 구현 시 types 폴더로 이동하는 것이 좋음)
interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number; // 초
  videoUrl: string;
  isFree: boolean;
  isCompleted?: boolean;
  resources?: {
    name: string;
    url: string;
    type: 'pdf' | 'code' | 'link' | 'image';
  }[];
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

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
  lessons: Lesson[];
  isFree: boolean;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [progress, setProgress] = useState(0);

  // 강의 및 레슨 데이터 가져오기
  useEffect(() => {
    const fetchCourseAndLessonData = async () => {
      setIsLoading(true);
      
      try {
        // 실제로는 API 호출로 데이터를 가져옴
        // const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`);
        // const data = await response.json();
        
        // 샘플 데이터 (실제 구현 시 API에서 가져와야 함)
        const sampleCourse: Course = {
          id: courseId,
          title: '기초부터 배우는 피아노 마스터 클래스',
          description: '피아노를 처음 배우는 분들을 위한 기초 강의',
          level: 'beginner',
          instructor: {
            id: 'instructor-1',
            name: '김피아노',
            avatar: '/assets/instructor-1.jpg'
          },
          category: '피아노',
          lessons: [
            {
              id: 'lesson-1',
              title: '피아노 기초: 올바른 자세와 손 위치',
              description: '피아노를 연주하기 위한 기본 자세와 손 위치를 배웁니다.',
              content: `
                <h2>올바른 피아노 연주 자세</h2>
                <p>피아노를 연주할 때 올바른 자세는 매우 중요합니다. 등을 곧게 펴고 어깨에 힘을 빼세요.</p>
                <p>의자는 피아노로부터 적당한 거리에 앉아 팔꿈치가 약간 구부러질 수 있게 해야 합니다.</p>
                <h2>손 위치와 손가락 번호</h2>
                <p>피아노에서는 손가락에 1부터 5까지 번호를 매깁니다. 엄지손가락이 1번, 새끼손가락이 5번입니다.</p>
                <p>건반 위에서 손을 C 포지션에 놓고 시작해 봅시다. 오른손 엄지손가락(1번)은 가운데 C에, 왼손 엄지손가락은 그보다 한 옥타브 아래 C에 위치합니다.</p>
              `,
              duration: 900, // 15분
              videoUrl: 'https://example.com/videos/lesson-1.mp4',
              isFree: true,
              isCompleted: false,
              resources: [
                { name: '올바른 자세 가이드', url: '/resources/posture-guide.pdf', type: 'pdf' },
                { name: '연습용 악보', url: '/resources/practice-sheet.pdf', type: 'pdf' }
              ],
              quiz: [
                {
                  question: '피아노에서 엄지손가락의 번호는 무엇인가요?',
                  options: ['0번', '1번', '2번', '5번'],
                  correctAnswer: 1
                },
                {
                  question: '오른손 엄지손가락이 위치하는 기본 건반은?',
                  options: ['가운데 C', '가운데 D', '가운데 G', '낮은 C'],
                  correctAnswer: 0
                }
              ]
            },
            {
              id: 'lesson-2',
              title: '음계와 코드의 기초',
              description: 'C 메이저 스케일과 기본 코드를 배웁니다.',
              content: `
                <h2>C 메이저 스케일</h2>
                <p>C 메이저 스케일은 가장 기본적인 음계로, 검은 건반 없이 흰 건반만으로 연주할 수 있습니다.</p>
                <p>C, D, E, F, G, A, B, C 순서로 8개의 음이 있으며, 이를 한 옥타브라고 합니다.</p>
                <h2>기본 코드</h2>
                <p>코드는 여러 음을 동시에 연주하는 것입니다. 가장 기본적인 코드는 3화음으로, 루트(기본음), 3도, 5도로 구성됩니다.</p>
                <p>C 메이저 코드는 C, E, G 음으로 구성됩니다.</p>
              `,
              duration: 1200, // 20분
              videoUrl: 'https://example.com/videos/lesson-2.mp4',
              isFree: true,
              isCompleted: false,
              resources: [
                { name: 'C 메이저 스케일 연습', url: '/resources/c-scale-practice.pdf', type: 'pdf' },
                { name: '코드 차트', url: '/resources/chord-chart.pdf', type: 'pdf' }
              ]
            },
            {
              id: 'lesson-3',
              title: '첫 번째 곡: 작은 별 변주곡',
              description: '트윙클 리틀 스타(작은 별) 곡을 통해 기본 멜로디를 연습합니다.',
              content: `
                <h2>작은 별 변주곡 소개</h2>
                <p>작은 별 변주곡은 모차르트가 작곡한 곡으로, 초보자가 배우기에 적합한 곡입니다.</p>
                <p>이 레슨에서는 멜로디를 먼저 천천히 연습한 후, 왼손 반주를 추가하여 완성된 곡을 연주해 볼 것입니다.</p>
                <h2>연주 방법</h2>
                <p>먼저 오른손으로 멜로디를 연습합니다. C-C-G-G-A-A-G 패턴으로 시작합니다.</p>
                <p>왼손은 C와 G 화음을 번갈아가며 연주합니다.</p>
              `,
              duration: 1500, // 25분
              videoUrl: 'https://example.com/videos/lesson-3.mp4',
              isFree: false,
              isCompleted: false,
              resources: [
                { name: '작은 별 악보', url: '/resources/twinkle-sheet.pdf', type: 'pdf' },
                { name: '연주 가이드', url: '/resources/playing-guide.pdf', type: 'pdf' }
              ]
            }
          ],
          isFree: false
        };

        setCourse(sampleCourse);
        const currentLesson = sampleCourse.lessons.find(l => l.id === lessonId);
        
        if (currentLesson) {
          setLesson(currentLesson);
          // 진행률 계산 (현재 레슨이 전체 레슨 중 몇 번째인지)
          const lessonIndex = sampleCourse.lessons.findIndex(l => l.id === lessonId);
          setProgress(Math.round(((lessonIndex + 1) / sampleCourse.lessons.length) * 100));
        } else {
          setError('레슨을 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('레슨 정보를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId && lessonId) {
      fetchCourseAndLessonData();
    }
  }, [courseId, lessonId]);

  // 레슨 완료 처리
  const handleCompleteLesson = async () => {
    setIsCompleting(true);
    try {
      // 실제로는 API를 통해 레슨 완료 상태 업데이트
      // await fetch(`/api/courses/${courseId}/lessons/${lessonId}/complete`, {
      //   method: 'POST'
      // });
      
      // 프론트엔드에서 완료 상태 업데이트
      if (lesson) {
        setLesson({ ...lesson, isCompleted: true });
      }
      
      // 다음 레슨으로 이동하기 위한 로직
      if (course) {
        const currentIndex = course.lessons.findIndex(l => l.id === lessonId);
        if (currentIndex < course.lessons.length - 1) {
          // 다음 레슨이 있으면 이동
          const nextLesson = course.lessons[currentIndex + 1];
          router.push(`/learn/courses/${courseId}/${nextLesson.id}`);
        }
      }
    } catch (error) {
      console.error('레슨 완료 처리 중 오류 발생:', error);
    } finally {
      setIsCompleting(false);
    }
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

  // 이전/다음 레슨 이동 처리
  const navigateToLesson = (direction: 'prev' | 'next') => {
    if (!course) return;
    
    const currentIndex = course.lessons.findIndex(l => l.id === lessonId);
    let targetIndex: number;
    
    if (direction === 'prev') {
      targetIndex = Math.max(0, currentIndex - 1);
    } else {
      targetIndex = Math.min(course.lessons.length - 1, currentIndex + 1);
    }
    
    if (targetIndex !== currentIndex) {
      router.push(`/learn/courses/${courseId}/${course.lessons[targetIndex].id}`);
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

  if (error || !lesson || !course) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">오류:</strong>
          <span className="block sm:inline"> {error || '레슨을 찾을 수 없습니다.'}</span>
        </div>
      </div>
    );
  }

  // 유료 컨텐츠에 대한 접근 권한 여부 확인
  const canAccessContent = lesson.isFree || course.isFree || true; // 실제로는 사용자의 결제 여부를 확인

  return (
    <div className="container mx-auto py-8 px-4">
      {/* 상단 네비게이션 바 */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Link href={`/learn/courses/${courseId}`} className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-primary">
          <span className="material-icons mr-1 text-sm">arrow_back</span>
          <span>강의로 돌아가기</span>
        </Link>
        <div className="flex items-center">
          <div className="w-48 bg-gray-300 dark:bg-gray-700 rounded-full h-2.5 mr-4">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300">{progress}% 완료</span>
        </div>
      </div>

      {/* 레슨 제목 및 메타 정보 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{lesson.description}</p>
        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
          <span className="flex items-center">
            <span className="material-icons mr-1">schedule</span>
            <span>{Math.floor(lesson.duration / 60)}분 {lesson.duration % 60}초</span>
          </span>
          <span className="flex items-center">
            <span className="material-icons mr-1">school</span>
            <span>{getLevelText(course.level)}</span>
          </span>
          {lesson.isCompleted && (
            <span className="flex items-center text-green-600">
              <span className="material-icons mr-1">check_circle</span>
              <span>완료됨</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 레슨 컨텐츠 영역 */}
        <div className="lg:col-span-2">
          {/* 비디오 플레이어 */}
          <div className="mb-6">
            <VideoPlayer 
              videoUrl={lesson.videoUrl} 
              title={lesson.title} 
              isPremium={!canAccessContent}
            />
          </div>

          {/* 레슨 콘텐츠 탭 */}
          <Tabs defaultValue="content" className="mt-8">
            <TabsList className="mb-4">
              <TabsTrigger value="content">레슨 내용</TabsTrigger>
              <TabsTrigger value="resources">학습 자료</TabsTrigger>
              {lesson.quiz && <TabsTrigger value="quiz">퀴즈</TabsTrigger>}
            </TabsList>

            <TabsContent value="content">
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              </div>
            </TabsContent>

            <TabsContent value="resources">
              {lesson.resources && lesson.resources.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">다운로드 가능한 학습 자료</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lesson.resources.map((resource, idx) => (
                      <div key={idx} className="border dark:border-gray-700 rounded-lg p-4 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                          <span className="material-icons">
                            {resource.type === 'pdf' ? 'picture_as_pdf' : 
                             resource.type === 'code' ? 'code' :
                             resource.type === 'image' ? 'image' : 'link'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{resource.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{resource.type.toUpperCase()}</p>
                        </div>
                        <a 
                          href={resource.url} 
                          download 
                          className="text-primary hover:text-primary/80"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="material-icons">download</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">이 레슨에는 추가 학습 자료가 없습니다.</p>
                </div>
              )}
            </TabsContent>

            {lesson.quiz && (
              <TabsContent value="quiz">
                <div className="space-y-8">
                  <h3 className="text-lg font-semibold mb-4">이해도 확인 퀴즈</h3>
                  {lesson.quiz.map((quizItem, quizIdx) => (
                    <div key={quizIdx} className="border dark:border-gray-700 rounded-lg p-6">
                      <h4 className="font-medium mb-4">문제 {quizIdx + 1}: {quizItem.question}</h4>
                      <div className="space-y-3">
                        {quizItem.options.map((option, optIdx) => (
                          <label key={optIdx} className="flex items-center p-3 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                            <input
                              type="radio"
                              name={`quiz-${quizIdx}`}
                              value={optIdx}
                              className="mr-3"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="mt-6">
                    <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md">
                      답안 제출
                    </button>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>

          {/* 이전/다음 레슨 네비게이션 */}
          <div className="mt-12 flex items-center justify-between">
            <button 
              onClick={() => navigateToLesson('prev')}
              className="flex items-center px-4 py-2 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
              disabled={course.lessons.findIndex(l => l.id === lessonId) === 0}
            >
              <span className="material-icons mr-2">chevron_left</span>
              <span>이전 레슨</span>
            </button>
            
            <button
              onClick={handleCompleteLesson}
              className={`px-6 py-2 ${lesson.isCompleted ? 'bg-green-500' : 'bg-primary hover:bg-primary/90'} text-white rounded-md flex items-center`}
              disabled={isCompleting || lesson.isCompleted}
            >
              {isCompleting ? (
                <>
                  <span className="animate-spin material-icons mr-2">refresh</span>
                  <span>처리 중...</span>
                </>
              ) : lesson.isCompleted ? (
                <>
                  <span className="material-icons mr-2">check</span>
                  <span>완료됨</span>
                </>
              ) : (
                <>
                  <span className="material-icons mr-2">check_circle</span>
                  <span>레슨 완료</span>
                </>
              )}
            </button>
            
            <button 
              onClick={() => navigateToLesson('next')}
              className="flex items-center px-4 py-2 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
              disabled={course.lessons.findIndex(l => l.id === lessonId) === course.lessons.length - 1}
            >
              <span>다음 레슨</span>
              <span className="material-icons ml-2">chevron_right</span>
            </button>
          </div>
        </div>

        {/* 사이드바: 레슨 목록 및 정보 */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8">
            <h3 className="text-lg font-semibold border-b dark:border-gray-700 pb-4 mb-4">레슨 목록</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {course.lessons.map((item, index) => (
                <Link 
                  key={item.id}
                  href={`/learn/courses/${courseId}/${item.id}`}
                  className={`block p-3 rounded-md ${item.id === lessonId ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3 text-xs">
                        {index + 1}
                      </div>
                      <div>
                        <p className={`font-medium ${item.id === lessonId ? 'text-primary' : ''}`}>{item.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{Math.floor(item.duration / 60)}분</p>
                      </div>
                    </div>
                    {!item.isFree && !course.isFree ? (
                      <span className="material-icons text-gray-400">lock</span>
                    ) : item.isCompleted ? (
                      <span className="material-icons text-green-500">check_circle</span>
                    ) : item.id === lessonId ? (
                      <span className="material-icons text-primary">play_circle</span>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>

            {/* 강의 정보 요약 */}
            <div className="mt-6 pt-6 border-t dark:border-gray-700">
              <h4 className="font-semibold mb-4">강의 정보</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                    {course.instructor.avatar && (
                      <Image 
                        src={course.instructor.avatar} 
                        alt={course.instructor.name} 
                        width={40} 
                        height={40}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">강사: {course.instructor.name}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">카테고리</span>
                  <span className="font-medium">{course.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">난이도</span>
                  <span className="font-medium">{getLevelText(course.level)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">총 레슨 수</span>
                  <span className="font-medium">{course.lessons.length}개</span>
                </div>
              </div>
            </div>

            {/* 도움말 및 지원 */}
            <div className="mt-6 pt-6 border-t dark:border-gray-700">
              <h4 className="font-semibold mb-4">도움이 필요하신가요?</h4>
              <div className="space-y-2">
                <Link href="/support" className="text-primary hover:underline flex items-center">
                  <span className="material-icons mr-2 text-sm">help_outline</span>
                  <span>도움말 센터</span>
                </Link>
                <Link href="/support/contact" className="text-primary hover:underline flex items-center">
                  <span className="material-icons mr-2 text-sm">chat</span>
                  <span>문의하기</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

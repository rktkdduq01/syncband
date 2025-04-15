'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // 초
  videoUrl: string;
  isFree: boolean;
  isCompleted?: boolean;
}

interface LessonListProps {
  lessons: Lesson[];
  onLessonSelect?: (lesson: Lesson) => void;
  selectedLessonId?: string;
  courseId?: string;
  isPremiumContent?: boolean;
  showProgress?: boolean;
}

export default function LessonList({
  lessons,
  onLessonSelect,
  selectedLessonId,
  courseId,
  isPremiumContent = false,
  showProgress = true
}: LessonListProps) {
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});

  // 완료된 레슨 수 계산
  const completedLessonsCount = lessons.filter(lesson => lesson.isCompleted).length;
  const progressPercentage = lessons.length > 0 ? Math.round((completedLessonsCount / lessons.length) * 100) : 0;

  // 레슨 설명 토글
  const toggleLessonDescription = (lessonId: string) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  // 시간 포맷 변환 (초 -> MM:SS 또는 H:MM:SS)
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    } else {
      return `${minutes}분`;
    }
  };

  // 레슨 클릭 핸들러
  const handleLessonClick = (lesson: Lesson) => {
    // 프리미엄 콘텐츠이고 무료가 아닌 경우, 클릭 방지
    if (isPremiumContent && !lesson.isFree) {
      return;
    }
    
    if (onLessonSelect) {
      onLessonSelect(lesson);
    }
  };

  return (
    <div className="mb-6">
      {showProgress && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">진행률</span>
            <span className="text-sm font-medium">{completedLessonsCount} / {lessons.length} ({progressPercentage}%)</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {lessons.map((lesson, index) => {
          const isLocked = isPremiumContent && !lesson.isFree;
          const isSelected = lesson.id === selectedLessonId;
          const isExpanded = expandedLessons[lesson.id];

          return (
            <div 
              key={lesson.id} 
              className={`py-4 ${isSelected ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
            >
              <div 
                className={`flex items-start ${isLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                onClick={() => !isLocked && handleLessonClick(lesson)}
              >
                <div className="flex-shrink-0 mr-3">
                  {lesson.isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <span className="material-icons text-green-600 dark:text-green-400 text-sm">check</span>
                    </div>
                  ) : (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center
                      ${isSelected ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                      <span className="text-xs">{index + 1}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`text-base font-medium ${isSelected ? 'text-primary' : ''}`}>
                        {lesson.title}
                        {lesson.isFree && (
                          <span className="ml-2 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 py-0.5 px-2 rounded-md">
                            무료
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDuration(lesson.duration)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isLocked && (
                        <span className="material-icons text-gray-400">lock</span>
                      )}
                      
                      {courseId ? (
                        <Link 
                          href={`/learn/courses/${courseId}/${lesson.id}`}
                          className="text-primary hover:text-primary/80"
                        >
                          <span className="material-icons">play_circle</span>
                        </Link>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLessonDescription(lesson.id);
                          }}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <span className="material-icons">
                            {isExpanded ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {lesson.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
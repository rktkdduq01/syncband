'use client';

import Image from 'next/image';
import Link from 'next/link';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  instructor: {
    name: string;
    avatar?: string;
  };
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessonCount: number;
  duration: number; // 분 단위
  rating?: number;
  ratingCount?: number;
  price?: number;
  isFree: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

export default function CourseCard({
  id,
  title,
  description,
  coverImage,
  instructor,
  category,
  level,
  lessonCount,
  duration,
  rating,
  ratingCount,
  price,
  isFree,
  isPopular = false,
  isNew = false
}: CourseCardProps) {
  // 난이도 한글 표시
  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return level;
    }
  };

  return (
    <Link href={`/learn/courses/${id}`} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full flex flex-col">
        {/* 이미지 컨테이너 */}
        <div className="relative h-48 overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 dark:bg-gray-700" />
          )}

          {/* 배지 */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isPopular && (
              <span className="bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                인기
              </span>
            )}
            {isNew && (
              <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                신규
              </span>
            )}
            {isFree && (
              <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                무료
              </span>
            )}
          </div>

          {/* 카테고리 */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-md">
              {category}
            </span>
          </div>
        </div>
        
        {/* 콘텐츠 */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
            {description}
          </p>
          
          {/* 강사 정보 */}
          <div className="flex items-center mt-auto mb-3">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mr-2">
              {instructor.avatar ? (
                <Image
                  src={instructor.avatar}
                  alt={instructor.name}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              ) : (
                <span className="material-icons text-gray-400 text-xs flex items-center justify-center h-full">
                  person
                </span>
              )}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {instructor.name}
            </span>
          </div>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="flex items-center">
              <span className="material-icons text-xs mr-1">school</span>
              {getLevelText(level)}
            </span>
            <span className="flex items-center">
              <span className="material-icons text-xs mr-1">schedule</span>
              {duration >= 60 ? `${Math.floor(duration / 60)}시간 ${duration % 60}분` : `${duration}분`}
            </span>
            <span className="flex items-center">
              <span className="material-icons text-xs mr-1">video_library</span>
              {lessonCount}개 레슨
            </span>
          </div>

          {/* 하단 영역 */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
            {rating ? (
              <div className="flex items-center">
                <div className="flex items-center text-yellow-500">
                  <span className="material-icons text-sm">star</span>
                </div>
                <span className="ml-1 text-sm font-medium">
                  {rating.toFixed(1)}
                </span>
                {ratingCount && (
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                    ({ratingCount})
                  </span>
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400">아직 평가 없음</div>
            )}
            
            <div className="font-semibold">
              {isFree ? (
                <span className="text-green-600 dark:text-green-400">무료</span>
              ) : (
                <span>{price?.toLocaleString()}원</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
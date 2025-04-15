// 프로필 메인 페이지

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  followers: number;
  following: number;
  joinDate: string;
  instruments: string[];
  skills: string[];
}

interface UserActivity {
  type: 'project' | 'track' | 'collaboration' | 'course';
  id: string;
  title: string;
  date: string;
  thumbnail?: string;
  description?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 실제 구현에서는 서버에서 현재 로그인한 사용자 정보를 가져옴
    // 여기서는 예시 데이터를 사용
    const mockUser: UserProfile = {
      id: 'current-user-id',
      username: 'musiclover',
      displayName: '음악천재',
      bio: '음악을 사랑하는 기타리스트입니다. 다양한 장르의 음악 작업을 즐깁니다.',
      profileImage: '/assets/profile/default.jpg',
      followers: 120,
      following: 45,
      joinDate: '2023년 10월',
      instruments: ['기타', '피아노', '드럼'],
      skills: ['작곡', '믹싱', '마스터링']
    };
    
    const mockActivities: UserActivity[] = [
      {
        type: 'project',
        id: 'project-1',
        title: '첫 번째 EP 앨범',
        date: '2025년 3월 15일',
        thumbnail: '/assets/projects/project1.jpg',
        description: '3곡으로 구성된 첫 번째 EP 앨범 작업'
      },
      {
        type: 'collaboration',
        id: 'collab-1',
        title: '재즈 세션',
        date: '2025년 2월 28일',
        thumbnail: '/assets/collaborations/collab1.jpg',
        description: '온라인 재즈 세션 참여'
      },
      {
        type: 'course',
        id: 'course-1',
        title: '고급 기타 테크닉',
        date: '2025년 1월 10일',
        thumbnail: '/assets/courses/guitar-advanced.jpg',
        description: '고급 기타 테크닉 강좌 수료'
      },
      {
        type: 'track',
        id: 'track-1',
        title: '여름 노래',
        date: '2024년 12월 20일',
        thumbnail: '/assets/tracks/summer-song.jpg',
        description: '싱글 트랙 발매'
      },
    ];
    
    setTimeout(() => {
      setUser(mockUser);
      setActivities(mockActivities);
      setIsLoading(false);
    }, 500); // 로딩 시뮬레이션
    
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">프로필을 찾을 수 없습니다.</h1>
        <p className="mb-4">로그인이 필요하거나 계정이 없을 수 있습니다.</p>
        <Link 
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          로그인하기
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row">
            <div className="mb-6 md:mb-0 md:mr-8 flex-shrink-0">
              <div className="relative w-32 h-32 rounded-full bg-gray-300 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {user.displayName.charAt(0)}
                </div>
                {/* 실제 이미지가 있다면 아래 코드로 대체
                <Image
                  src={user.profileImage}
                  alt={user.displayName}
                  width={128}
                  height={128}
                  className="object-cover"
                />
                */}
              </div>
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{user.displayName}</h1>
                  <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
                </div>
                <div className="mt-2 sm:mt-0 space-x-2">
                  <Link
                    href="/profile/settings"
                    className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    프로필 편집
                  </Link>
                </div>
              </div>
              
              <p className="text-gray-800 dark:text-gray-200 mb-4">{user.bio}</p>
              
              <div className="flex space-x-4 mb-4 text-sm">
                <div>
                  <span className="font-semibold">{user.followers}</span> 팔로워
                </div>
                <div>
                  <span className="font-semibold">{user.following}</span> 팔로잉
                </div>
                <div>
                  <span className="font-semibold">{user.joinDate}</span> 가입
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">연주 악기</h3>
                <div className="flex flex-wrap gap-2">
                  {user.instruments.map((instrument) => (
                    <span 
                      key={instrument} 
                      className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm"
                    >
                      {instrument}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">음악 제작 기술</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">최근 활동</h2>
          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            모두 보기
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activities.map((activity) => (
            <div 
              key={`${activity.type}-${activity.id}`} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              onClick={() => {
                // 활동 유형에 따라 다른 페이지로 이동
                switch(activity.type) {
                  case 'project':
                    router.push(`/studio/mix/${activity.id}`);
                    break;
                  case 'track':
                    router.push(`/community/showcase/${activity.id}`);
                    break;
                  case 'collaboration':
                    router.push(`/community/collaborations/${activity.id}`);
                    break;
                  case 'course':
                    router.push(`/learn/courses/${activity.id}`);
                    break;
                }
              }}
            >
              <div className="h-32 bg-gray-200 dark:bg-gray-700">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-lg">{activity.title}</span>
                </div>
                {/* 실제 이미지가 있다면 아래 코드로 대체
                <Image
                  src={activity.thumbnail || ''}
                  alt={activity.title}
                  width={300}
                  height={150}
                  className="w-full h-full object-cover"
                />
                */}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium">{activity.title}</h3>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {activity.type === 'project' && '프로젝트'}
                    {activity.type === 'track' && '트랙'}
                    {activity.type === 'collaboration' && '협업'}
                    {activity.type === 'course' && '강좌'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{activity.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">프로 기능 활성화</h2>
        <p className="mb-4">
          고급 스튜디오 도구, 무제한 프로젝트 저장, 고품질 내보내기 등 더 많은 기능을 사용해보세요.
        </p>
        <Link 
          href="/subscription"
          className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded hover:from-blue-700 hover:to-purple-700 transition-colors"
        >
          프로 플랜 살펴보기
        </Link>
      </div>
    </div>
  );
}

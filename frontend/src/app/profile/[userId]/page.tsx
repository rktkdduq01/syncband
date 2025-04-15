// 사용자 프로필 페이지

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
  isCurrentUser: boolean;
  isFollowing: boolean;
}

interface UserProject {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  tracks: number;
  likes: number;
  date: string;
}

interface UserTrack {
  id: string;
  title: string;
  coverImage?: string;
  duration: string;
  plays: number;
  likes: number;
  date: string;
}

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const userId = params.userId;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [tracks, setTracks] = useState<UserTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'tracks'>('projects');
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    // 실제 구현에서는 서버에서 userId에 해당하는 사용자 정보를 가져옴
    // 여기서는 예시 데이터를 사용
    const fetchUserData = async () => {
      try {
        // 실제로는 API 호출로 대체
        // const response = await fetch(`/api/users/${userId}`);
        // const data = await response.json();
        
        // 예시 데이터
        const mockUser: UserProfile = {
          id: userId,
          username: 'guitarist123',
          displayName: '기타의 달인',
          bio: '8년차 기타리스트, 작곡가입니다. 록, 메탈, 재즈 등 다양한 장르의 음악을 연주합니다.',
          profileImage: '/assets/profile/user1.jpg',
          followers: 245,
          following: 87,
          joinDate: '2022년 5월',
          instruments: ['일렉기타', '어쿠스틱기타', '베이스'],
          skills: ['작곡', '편곡', '녹음'],
          isCurrentUser: userId === 'current-user-id',
          isFollowing: false
        };
        
        const mockProjects: UserProject[] = [
          {
            id: 'project-1',
            title: '락 앨범 프로젝트',
            description: '4곡으로 구성된 미니 EP 앨범입니다.',
            coverImage: '/assets/projects/rock-album.jpg',
            tracks: 4,
            likes: 58,
            date: '2025년 2월 15일'
          },
          {
            id: 'project-2',
            title: '어쿠스틱 세션',
            description: '어쿠스틱 기타 솔로 세션입니다.',
            coverImage: '/assets/projects/acoustic-session.jpg',
            tracks: 6,
            likes: 32,
            date: '2025년 1월 10일'
          },
          {
            id: 'project-3',
            title: '재즈 트리오',
            description: '피아노, 베이스, 드럼과 함께한 재즈 세션입니다.',
            coverImage: '/assets/projects/jazz-trio.jpg',
            tracks: 3,
            likes: 45,
            date: '2024년 12월 5일'
          }
        ];
        
        const mockTracks: UserTrack[] = [
          {
            id: 'track-1',
            title: 'Guitar Solo No.5',
            coverImage: '/assets/tracks/solo5.jpg',
            duration: '4:32',
            plays: 1250,
            likes: 87,
            date: '2025년 3월 20일'
          },
          {
            id: 'track-2',
            title: '빗소리 (Acoustic Ver.)',
            coverImage: '/assets/tracks/rain.jpg',
            duration: '3:45',
            plays: 862,
            likes: 53,
            date: '2025년 2월 8일'
          },
          {
            id: 'track-3',
            title: 'Metal Riff Collection',
            coverImage: '/assets/tracks/metal.jpg',
            duration: '5:12',
            plays: 943,
            likes: 68,
            date: '2025년 1월 15일'
          },
          {
            id: 'track-4',
            title: 'Fingerstyle Practice',
            coverImage: '/assets/tracks/fingerstyle.jpg',
            duration: '2:58',
            plays: 521,
            likes: 37,
            date: '2024년 12월 28일'
          }
        ];
        
        setTimeout(() => {
          setUser(mockUser);
          setProjects(mockProjects);
          setTracks(mockTracks);
          setIsLoading(false);
        }, 500); // 로딩 시뮬레이션
        
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);

  const handleFollowToggle = async () => {
    if (!user) return;
    
    setIsFollowLoading(true);
    try {
      // 실제로는 API 호출로 대체
      // const response = await fetch(`/api/users/${userId}/follow`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // const data = await response.json();
      
      // 예시 동작
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          isFollowing: !prev.isFollowing,
          followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1
        };
      });
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
    } finally {
      setIsFollowLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold mb-4">사용자를 찾을 수 없습니다</h1>
        <p className="mb-6">해당 사용자가 존재하지 않거나 프로필이 비공개일 수 있습니다.</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          이전 페이지로 돌아가기
        </button>
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
                <div className="mt-4 sm:mt-0 space-x-2">
                  {user.isCurrentUser ? (
                    <Link
                      href="/profile/settings"
                      className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      프로필 편집
                    </Link>
                  ) : (
                    <button
                      onClick={handleFollowToggle}
                      disabled={isFollowLoading}
                      className={`px-4 py-2 text-sm rounded transition-colors ${
                        user.isFollowing 
                          ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isFollowLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                      ) : user.isFollowing ? '팔로잉' : '팔로우'}
                    </button>
                  )}
                  <button
                    className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    메시지
                  </button>
                </div>
              </div>
              
              <p className="text-gray-800 dark:text-gray-200 mb-4">{user.bio}</p>
              
              <div className="flex space-x-6 mb-4 text-sm">
                <button className="hover:underline">
                  <span className="font-semibold">{user.followers}</span> 팔로워
                </button>
                <button className="hover:underline">
                  <span className="font-semibold">{user.following}</span> 팔로잉
                </button>
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
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`py-2 px-4 relative ${
              activeTab === 'projects'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            프로젝트 ({projects.length})
            {activeTab === 'projects' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>
            )}
          </button>
          <button
            className={`py-2 px-4 relative ${
              activeTab === 'tracks'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('tracks')}
          >
            트랙 ({tracks.length})
            {activeTab === 'tracks' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>
            )}
          </button>
        </div>
        
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/studio/mix/${project.id}`)}
              >
                <div className="h-40 bg-gray-200 dark:bg-gray-700">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-lg">{project.title}</span>
                  </div>
                  {/* 실제 이미지가 있다면 아래 코드로 대체
                  <Image
                    src={project.coverImage || ''}
                    alt={project.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                  */}
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span>{project.tracks} 트랙</span>
                      <span>{project.likes} 좋아요</span>
                    </div>
                    <span>{project.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'tracks' && (
          <div>
            {tracks.map((track) => (
              <div 
                key={track.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/community/showcase/${track.id}`)}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-32 h-24 sm:h-auto bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center">
                      <span>{track.title}</span>
                    </div>
                    {/* 실제 이미지가 있다면 아래 코드로 대체
                    <Image
                      src={track.coverImage || ''}
                      alt={track.title}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                    */}
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium mb-1">{track.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{track.duration}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>{track.plays} 재생</span>
                        <span>{track.likes} 좋아요</span>
                      </div>
                      <span>{track.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">더 많은 음악 발견하기</h2>
        <p className="mb-4">
          {user.displayName}님과 비슷한 스타일의 아티스트들을 찾아보세요.
        </p>
        <Link 
          href="/community/collaborations"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          협업 찾아보기
        </Link>
      </div>
    </div>
  );
}

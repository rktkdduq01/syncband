// 프로필 설정 페이지

'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface UserSettings {
  displayName: string;
  username: string;
  email: string;
  bio: string;
  profileImage: string | null;
  instruments: string[];
  skills: string[];
  notificationSettings: {
    email: boolean;
    collaboration: boolean;
    message: boolean;
    newsletter: boolean;
  };
  privacySettings: {
    profileVisibility: 'public' | 'followers' | 'private';
    activityVisibility: 'public' | 'followers' | 'private';
    projectsVisibility: 'public' | 'followers' | 'private';
    showInSearch: boolean;
  };
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notification' | 'privacy'>('profile');
  const [newInstrument, setNewInstrument] = useState('');
  const [newSkill, setNewSkill] = useState('');
  
  // 사용 가능한 악기 목록 (실제로는 API에서 불러올 수 있음)
  const availableInstruments = [
    '기타', '일렉 기타', '베이스 기타', '드럼', '피아노', '키보드', '바이올린',
    '첼로', '트럼펫', '색소폰', '플루트', '클라리넷', '보컬', '신디사이저'
  ];
  
  // 사용 가능한 스킬 목록
  const availableSkills = [
    '작곡', '편곡', '믹싱', '마스터링', '녹음', '작사', '음악 프로듀싱', 
    '사운드 디자인', 'DAW 전문가', 'MIDI 프로그래밍', '보컬 편집', '오디오 인터페이스'
  ];

  useEffect(() => {
    // 실제 구현에서는 서버에서 사용자 설정을 가져옴
    // 여기서는 예시 데이터를 사용
    const fetchUserSettings = async () => {
      try {
        // 실제로는 API 호출로 대체
        // const response = await fetch('/api/user/settings');
        // const data = await response.json();
        
        // 예시 데이터
        const mockSettings: UserSettings = {
          displayName: '음악천재',
          username: 'musiclover',
          email: 'music@example.com',
          bio: '음악을 사랑하는 기타리스트입니다. 다양한 장르의 음악 작업을 즐깁니다.',
          profileImage: null,
          instruments: ['기타', '피아노', '드럼'],
          skills: ['작곡', '믹싱', '마스터링'],
          notificationSettings: {
            email: true,
            collaboration: true,
            message: true,
            newsletter: false
          },
          privacySettings: {
            profileVisibility: 'public',
            activityVisibility: 'public',
            projectsVisibility: 'followers',
            showInSearch: true
          }
        };
        
        setTimeout(() => {
          setSettings(mockSettings);
          setIsLoading(false);
        }, 500); // 로딩 시뮬레이션
        
      } catch (error) {
        console.error("Failed to fetch user settings:", error);
        setIsLoading(false);
      }
    };
    
    fetchUserSettings();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings(prev => {
      if (!prev) return null;
      
      if (name.startsWith('notification.')) {
        const notificationKey = name.split('.')[1] as keyof typeof prev.notificationSettings;
        return {
          ...prev,
          notificationSettings: {
            ...prev.notificationSettings,
            [notificationKey]: checked
          }
        };
      }
      
      if (name.startsWith('privacy.')) {
        const privacyKey = name.split('.')[1] as keyof typeof prev.privacySettings;
        return {
          ...prev,
          privacySettings: {
            ...prev.privacySettings,
            [privacyKey]: type === 'checkbox' ? checked : value
          }
        };
      }
      
      return {
        ...prev,
        [name]: value
      };
    });
    
    setIsDirty(true);
    
    // 에러 상태 업데이트
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const addInstrument = () => {
    if (!newInstrument || !settings) return;
    
    if (settings.instruments.includes(newInstrument)) {
      setErrors(prev => ({
        ...prev,
        instruments: '이미 추가된 악기입니다.'
      }));
      return;
    }
    
    setSettings({
      ...settings,
      instruments: [...settings.instruments, newInstrument]
    });
    
    setNewInstrument('');
    setIsDirty(true);
  };
  
  const removeInstrument = (instrument: string) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      instruments: settings.instruments.filter(item => item !== instrument)
    });
    
    setIsDirty(true);
  };
  
  const addSkill = () => {
    if (!newSkill || !settings) return;
    
    if (settings.skills.includes(newSkill)) {
      setErrors(prev => ({
        ...prev,
        skills: '이미 추가된 스킬입니다.'
      }));
      return;
    }
    
    setSettings({
      ...settings,
      skills: [...settings.skills, newSkill]
    });
    
    setNewSkill('');
    setIsDirty(true);
  };
  
  const removeSkill = (skill: string) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      skills: settings.skills.filter(item => item !== skill)
    });
    
    setIsDirty(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!settings?.displayName?.trim()) {
      newErrors.displayName = '이름을 입력해주세요';
    }
    
    if (!settings?.username?.trim()) {
      newErrors.username = '사용자 이름을 입력해주세요';
    } else if (settings.username.length < 3) {
      newErrors.username = '사용자 이름은 3글자 이상이어야 합니다';
    }
    
    if (!settings?.email?.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      newErrors.email = '유효하지 않은 이메일 주소입니다';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !settings) {
      // 폼이 유효하지 않으면 제출하지 않음
      return;
    }
    
    setIsSaving(true);
    
    try {
      // 실제로는 API 호출로 대체
      // const response = await fetch('/api/user/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
      // 저장 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 저장 성공 시 처리
      setIsDirty(false);
      // 성공 메시지 표시 또는 리다이렉트 등의 처리
      router.push('/profile');
      
    } catch (error) {
      console.error("Failed to save settings:", error);
      // 오류 처리
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">설정을 불러올 수 없습니다</h1>
        <p className="mb-4">로그인이 필요하거나 설정 데이터를 가져오는 중 오류가 발생했습니다.</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          이전 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">프로필 설정</h1>
            <div className="space-x-2">
              {isDirty && (
                <button
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => router.push('/profile')}
                  disabled={isSaving}
                >
                  취소
                </button>
              )}
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                onClick={handleSubmit}
                disabled={!isDirty || isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <span className="inline-block w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                    저장 중...
                  </span>
                ) : '변경사항 저장'}
              </button>
            </div>
          </div>
          
          <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button
              className={`py-2 px-4 relative whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              프로필 정보
              {activeTab === 'profile' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>
              )}
            </button>
            <button
              className={`py-2 px-4 relative whitespace-nowrap ${
                activeTab === 'account'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('account')}
            >
              계정 설정
              {activeTab === 'account' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>
              )}
            </button>
            <button
              className={`py-2 px-4 relative whitespace-nowrap ${
                activeTab === 'notification'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('notification')}
            >
              알림 설정
              {activeTab === 'notification' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>
              )}
            </button>
            <button
              className={`py-2 px-4 relative whitespace-nowrap ${
                activeTab === 'privacy'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('privacy')}
            >
              개인정보 설정
              {activeTab === 'privacy' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>
              )}
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {activeTab === 'profile' && (
              <div>
                <div className="mb-6">
                  <label className="block mb-2 font-medium">프로필 이미지</label>
                  <div className="flex items-center">
                    <div className="relative w-24 h-24 rounded-full bg-gray-300 overflow-hidden mr-4">
                      <div className="absolute inset-0 flex items-center justify-center text-4xl">
                        {settings.displayName.charAt(0)}
                      </div>
                      {/* 실제 이미지가 있다면 아래 코드로 대체
                      <Image
                        src={settings.profileImage || ''}
                        alt="Profile Image"
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                      */}
                    </div>
                    <div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors mb-2"
                      >
                        이미지 업로드
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        JPG, PNG, GIF 형식. 최대 5MB.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="displayName" className="block mb-2 font-medium">이름</label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={settings.displayName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded border ${
                      errors.displayName 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } focus:border-transparent focus:ring-2 outline-none dark:bg-gray-700`}
                  />
                  {errors.displayName && (
                    <p className="text-red-500 text-sm mt-1">{errors.displayName}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="bio" className="block mb-2 font-medium">소개</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={settings.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 focus:border-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700"
                    placeholder="자신에 대한 소개를 작성해주세요."
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2 font-medium">연주 악기</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {settings.instruments.map((instrument) => (
                      <span 
                        key={instrument} 
                        className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm flex items-center"
                      >
                        {instrument}
                        <button 
                          type="button"
                          onClick={() => removeInstrument(instrument)}
                          className="ml-1 text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <select
                      value={newInstrument}
                      onChange={(e) => setNewInstrument(e.target.value)}
                      className="flex-grow px-4 py-2 rounded-l border border-gray-300 dark:border-gray-600 focus:border-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700"
                    >
                      <option value="">악기 선택...</option>
                      {availableInstruments.filter(i => !settings.instruments.includes(i)).map(instrument => (
                        <option key={instrument} value={instrument}>{instrument}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addInstrument}
                      disabled={!newInstrument}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                      추가
                    </button>
                  </div>
                  {errors.instruments && (
                    <p className="text-red-500 text-sm mt-1">{errors.instruments}</p>
                  )}
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">음악 제작 기술</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {settings.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm flex items-center"
                      >
                        {skill}
                        <button 
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 text-blue-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <select
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-grow px-4 py-2 rounded-l border border-gray-300 dark:border-gray-600 focus:border-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700"
                    >
                      <option value="">기술 선택...</option>
                      {availableSkills.filter(s => !settings.skills.includes(s)).map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addSkill}
                      disabled={!newSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    >
                      추가
                    </button>
                  </div>
                  {errors.skills && (
                    <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'account' && (
              <div>
                <div className="mb-4">
                  <label htmlFor="username" className="block mb-2 font-medium">사용자 이름</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={settings.username}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded border ${
                      errors.username 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } focus:border-transparent focus:ring-2 outline-none dark:bg-gray-700`}
                  />
                  {errors.username ? (
                    <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      유저네임은 프로필 URL에 사용됩니다: syncband.com/profile/{settings.username}
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2 font-medium">이메일</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded border ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } focus:border-transparent focus:ring-2 outline-none dark:bg-gray-700`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">비밀번호 변경</h3>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    비밀번호 변경하기
                  </button>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium mb-2">연결된 계정</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white mr-3">
                          F
                        </div>
                        <span>Facebook</span>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        연결하기
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white mr-3">
                          G
                        </div>
                        <span>Google</span>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        연결 해제
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white mr-3">
                          S
                        </div>
                        <span>SoundCloud</span>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        연결하기
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">계정 삭제</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    계정 삭제
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'notification' && (
              <div className="space-y-4">
                <h3 className="font-medium mb-2">알림 설정</h3>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div>
                    <h4 className="font-medium">이메일 알림</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      중요한 업데이트와 알림을 이메일로 받습니다.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="notification.email"
                      checked={settings.notificationSettings.email}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div>
                    <h4 className="font-medium">협업 요청 알림</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      다른 사용자가 나에게 협업을 요청할 때 알림을 받습니다.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="notification.collaboration"
                      checked={settings.notificationSettings.collaboration}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div>
                    <h4 className="font-medium">메시지 알림</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      새 메시지가 도착했을 때 알림을 받습니다.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="notification.message"
                      checked={settings.notificationSettings.message}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div>
                    <h4 className="font-medium">뉴스레터</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      새로운 기능과 업데이트에 대한 뉴스레터를 받습니다.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="notification.newsletter"
                      checked={settings.notificationSettings.newsletter}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            )}
            
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">프로필 공개 설정</h3>
                  
                  <div className="mb-4">
                    <label htmlFor="profileVisibility" className="block mb-2">
                      <span className="font-medium">프로필 공개 범위</span>
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        누가 내 프로필을 볼 수 있는지 설정합니다.
                      </span>
                    </label>
                    <select
                      id="profileVisibility"
                      name="privacy.profileVisibility"
                      value={settings.privacySettings.profileVisibility}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 focus:border-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700"
                    >
                      <option value="public">전체 공개 - 모든 사용자</option>
                      <option value="followers">팔로워만 - 나를 팔로우하는 사용자만</option>
                      <option value="private">비공개 - 나만 볼 수 있음</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="activityVisibility" className="block mb-2">
                      <span className="font-medium">활동 공개 범위</span>
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        누가 내 활동 내역을 볼 수 있는지 설정합니다.
                      </span>
                    </label>
                    <select
                      id="activityVisibility"
                      name="privacy.activityVisibility"
                      value={settings.privacySettings.activityVisibility}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 focus:border-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700"
                    >
                      <option value="public">전체 공개 - 모든 사용자</option>
                      <option value="followers">팔로워만 - 나를 팔로우하는 사용자만</option>
                      <option value="private">비공개 - 나만 볼 수 있음</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="projectsVisibility" className="block mb-2">
                      <span className="font-medium">프로젝트 공개 범위</span>
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        누가 내 음악 프로젝트를 볼 수 있는지 설정합니다.
                      </span>
                    </label>
                    <select
                      id="projectsVisibility"
                      name="privacy.projectsVisibility"
                      value={settings.privacySettings.projectsVisibility}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 focus:border-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700"
                    >
                      <option value="public">전체 공개 - 모든 사용자</option>
                      <option value="followers">팔로워만 - 나를 팔로우하는 사용자만</option>
                      <option value="private">비공개 - 나만 볼 수 있음</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showInSearch"
                      name="privacy.showInSearch"
                      checked={settings.privacySettings.showInSearch}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="showInSearch" className="ml-2">
                      <span className="font-medium">검색 결과에 프로필 표시</span>
                      <span className="block text-sm text-gray-600 dark:text-gray-400">
                        다른 사용자가 내 프로필을 검색할 수 있습니다.
                      </span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">데이터 관리</h3>
                  <button
                    type="button"
                    className="px-4 py-2 mr-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    내 데이터 다운로드
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    쿠키 설정
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

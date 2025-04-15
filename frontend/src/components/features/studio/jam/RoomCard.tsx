"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/common/Button';

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    description: string;
    host: {
      id: string;
      name: string;
      profileImage: string;
    };
    participantsCount: number;
    maxParticipants: number;
    genre?: string[];
    isPrivate: boolean;
    status: 'waiting' | 'live' | 'ended';
    createdAt: string;
    thumbnailUrl?: string;
  };
  onJoin?: (roomId: string) => void;
}

const RoomCard = ({ room, onJoin }: RoomCardProps) => {
  const {
    id,
    name,
    description,
    host,
    participantsCount,
    maxParticipants,
    genre,
    isPrivate,
    status,
    thumbnailUrl
  } = room;

  const handleJoin = () => {
    if (onJoin) {
      onJoin(id);
    } else {
      // 기본 동작 - 라우터로 이동
      window.location.href = `/sync-room/${id}`;
    }
  };

  // 상태에 따른 뱃지 색상 표시
  const getStatusBadge = () => {
    switch(status) {
      case 'waiting':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">대기 중</span>;
      case 'live':
        return <span className="animate-pulse bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
          라이브
        </span>;
      case 'ended':
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">종료됨</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-40 w-full">
        <Image
          src={thumbnailUrl || '/assets/default-room.jpg'}
          alt={name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          {getStatusBadge()}
          {isPrivate && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              비공개
            </span>
          )}
        </div>
      </div>
      
      <div className="p-5">
        <Link href={`/sync-room/${id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-blue-600">{name}</h3>
        </Link>
        
        <div className="flex items-center mb-3">
          <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
            <Image 
              src={host.profileImage || '/assets/default-profile.png'} 
              alt={host.name}
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <Link href={`/profile/${host.id}`} className="text-sm font-medium text-gray-700 hover:underline">
            {host.name}
          </Link>
        </div>
        
        {description && (
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        )}
        
        {genre && genre.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {genre.map((g) => (
              <span key={g} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {g}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{participantsCount}/{maxParticipants}</span> 참가자
          </div>
        </div>
        
        <Button
          onClick={handleJoin}
          disabled={status === 'ended' || participantsCount >= maxParticipants}
          variant={status === 'ended' ? "outline" : "default"}
          className="w-full"
        >
          {status === 'ended' ? '종료됨' : (status === 'live' ? '참여하기' : '입장하기')}
        </Button>
      </div>
    </div>
  );
};

export default RoomCard;
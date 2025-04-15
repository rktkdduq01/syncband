"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/common/Button';

interface CollaborationCardProps {
  collaboration: {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    genre: string[];
    author: {
      id: string;
      name: string;
      profileImage: string;
    };
    createdAt: string;
    deadline?: string;
    lookingFor: string[];
    participantsCount: number;
    maxParticipants: number;
    status: 'open' | 'in-progress' | 'completed';
  };
  onJoin?: (collaborationId: string) => void;
}

const CollaborationCard = ({ collaboration, onJoin }: CollaborationCardProps) => {
  const {
    id,
    title,
    description,
    coverImage,
    genre,
    author,
    createdAt,
    deadline,
    lookingFor,
    participantsCount,
    maxParticipants,
    status
  } = collaboration;

  const formattedDate = new Date(createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedDeadline = deadline 
    ? new Date(deadline).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const handleJoin = () => {
    if (onJoin) {
      onJoin(id);
    }
  };

  const getStatusBadge = () => {
    switch(status) {
      case 'open':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">모집 중</span>;
      case 'in-progress':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">진행 중</span>;
      case 'completed':
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">완료됨</span>;
      default:
        return null;
    }
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={coverImage || '/assets/default-cover.jpg'}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          {getStatusBadge()}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center mb-3">
          <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
            <Image 
              src={author.profileImage || '/assets/default-profile.png'} 
              alt={author.name}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div>
            <Link href={`/profile/${author.id}`} className="text-sm font-medium text-blue-600 hover:underline">
              {author.name}
            </Link>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
        
        <Link href={`/community/collaborations/${id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-blue-600">{title}</h3>
        </Link>
        
        <p className="text-gray-700 text-sm mb-4">{truncateDescription(description)}</p>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {genre.map((g) => (
              <span key={g} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {g}
              </span>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {lookingFor.map((role) => (
              <span key={role} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                {role}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{participantsCount}/{maxParticipants}</span> 참가자
          </div>
          
          {formattedDeadline && (
            <div className="text-sm text-gray-500">
              마감: <span className="font-medium">{formattedDeadline}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Link href={`/community/collaborations/${id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              상세 보기
            </Button>
          </Link>
          
          {status === 'open' && participantsCount < maxParticipants && (
            <Button onClick={handleJoin} className="flex-1">
              참여하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationCard;
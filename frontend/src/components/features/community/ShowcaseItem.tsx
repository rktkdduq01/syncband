"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/common/Button';

interface ShowcaseItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    audioUrl: string;
    coverImage: string;
    author: {
      id: string;
      name: string;
      profileImage: string;
    };
    createdAt: string;
    genre: string[];
    likesCount: number;
    commentsCount: number;
    playCount: number;
  };
  onLike?: (itemId: string) => void;
}

const ShowcaseItem = ({ item, onLike }: ShowcaseItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handlePlayToggle = () => {
    if (!audioElement) {
      const audio = new Audio(item.audioUrl);
      audio.addEventListener('ended', () => setIsPlaying(false));
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = () => {
    if (onLike) {
      onLike(item.id);
    }
    setLiked(!liked);
  };

  const formattedDate = new Date(item.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={item.coverImage || '/assets/default-cover.jpg'}
          alt={item.title}
          fill
          className="object-cover"
        />
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer group"
          onClick={handlePlayToggle}
        >
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center group-hover:scale-110 transition-transform">
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center mb-3">
          <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
            <Image 
              src={item.author.profileImage || '/assets/default-profile.png'} 
              alt={item.author.name}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div>
            <Link href={`/profile/${item.author.id}`} className="text-sm font-medium text-blue-600 hover:underline">
              {item.author.name}
            </Link>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
        
        <Link href={`/community/showcase/${item.id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-blue-600">{item.title}</h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {item.genre.map((g) => (
            <span key={g} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {g}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {item.playCount}
            </div>
            
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              {item.commentsCount}
            </div>
            
            <button 
              onClick={handleLike}
              className={`flex items-center ${liked ? 'text-red-500' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {item.likesCount + (liked ? 1 : 0)}
            </button>
          </div>
          
          <Link href={`/community/showcase/${item.id}`}>
            <Button variant="outline" size="sm">
              자세히 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseItem;
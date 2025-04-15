"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/common/Button';

interface ForumPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: {
      id: string;
      name: string;
      profileImage: string;
    };
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    tags?: string[];
  };
  onLike?: (postId: string) => void;
}

const ForumPost = ({ post, onLike }: ForumPostProps) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const handleLike = () => {
    if (onLike) {
      onLike(post.id);
    }
    if (!liked) {
      setLikesCount(prev => prev + 1);
      setLiked(true);
    } else {
      setLikesCount(prev => prev - 1);
      setLiked(false);
    }
  };

  // 날짜를 사용자 친화적인 형식으로 변환
  const formattedDate = new Date(post.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 게시물 내용이 너무 길면 자르기
  const truncatedContent = post.content.length > 200 
    ? post.content.substring(0, 200) + '...' 
    : post.content;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
          <Image 
            src={post.author.profileImage || '/assets/default-profile.png'} 
            alt={post.author.name}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div>
          <Link href={`/profile/${post.author.id}`} className="text-blue-600 hover:underline font-medium">
            {post.author.name}
          </Link>
          <p className="text-gray-500 text-sm">{formattedDate}</p>
        </div>
      </div>

      <Link href={`/community/forum/post/${post.id}`}>
        <h3 className="text-xl font-bold mb-2 hover:text-blue-600">{post.title}</h3>
      </Link>
      
      <p className="text-gray-700 mb-4">{truncatedContent}</p>
      
      {post.tags && post.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span 
              key={tag} 
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex space-x-4">
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-1 ${liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likesCount}</span>
          </button>
          
          <Link href={`/community/forum/post/${post.id}`} className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>{post.commentsCount}</span>
          </Link>
        </div>
        
        <Link href={`/community/forum/post/${post.id}`}>
          <Button variant="outline" size="sm">
            자세히 보기
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ForumPost;
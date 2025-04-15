"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/common/Button';

interface CommentProps {
  comment: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      profileImage: string;
    };
    createdAt: string;
    likesCount: number;
    isReply?: boolean;
    replies?: Array<{
      id: string;
      content: string;
      author: {
        id: string;
        name: string;
        profileImage: string;
      };
      createdAt: string;
      likesCount: number;
    }>;
  };
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => void;
}

const Comment = ({ comment, onLike, onReply }: CommentProps) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleLike = () => {
    if (onLike) {
      onLike(comment.id);
    }
    if (!liked) {
      setLikesCount(prev => prev + 1);
      setLiked(true);
    } else {
      setLikesCount(prev => prev - 1);
      setLiked(false);
    }
  };

  const handleReply = () => {
    if (replyContent.trim() && onReply) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const toggleReplyForm = () => {
    setIsReplying(!isReplying);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={`${comment.isReply ? 'ml-12 mt-4' : 'mb-6'} bg-white rounded-lg p-4 border border-gray-200`}>
      <div className="flex items-start">
        <div className="h-8 w-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
          <Image 
            src={comment.author.profileImage || '/assets/default-profile.png'} 
            alt={comment.author.name}
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <div>
              <Link href={`/profile/${comment.author.id}`} className="font-medium text-blue-600 hover:underline">
                {comment.author.name}
              </Link>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-500 text-sm">{formattedDate}</span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-3">{comment.content}</p>
          
          <div className="flex items-center space-x-4 text-sm">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-1 ${liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{likesCount}</span>
            </button>
            
            {!comment.isReply && (
              <button 
                onClick={toggleReplyForm}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span>답글</span>
              </button>
            )}
            
            {hasReplies && !comment.isReply && (
              <button 
                onClick={toggleReplies}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform ${showReplies ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span>{showReplies ? '답글 숨기기' : `답글 ${comment.replies?.length}개 보기`}</span>
              </button>
            )}
          </div>
          
          {isReplying && (
            <div className="mt-4">
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="답글을 작성하세요..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              ></textarea>
              <div className="mt-2 flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsReplying(false)}>
                  취소
                </Button>
                <Button size="sm" onClick={handleReply} disabled={replyContent.trim() === ''}>
                  답글 작성
                </Button>
              </div>
            </div>
          )}
          
          {hasReplies && showReplies && !comment.isReply && (
            <div className="mt-4 space-y-4">
              {comment.replies?.map((reply) => (
                <Comment 
                  key={reply.id} 
                  comment={{...reply, isReply: true}}
                  onLike={onLike}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
'use client';

import React, { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
};

interface ChatPanelProps {
  messages: Message[];
  sendMessage: (text: string) => void;
  currentUserId: string;
}

export default function ChatPanel({ messages, sendMessage, currentUserId }: ChatPanelProps) {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(messageText);
      setMessageText('');
    }
  };

  const formatTime = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date); // 문자열이면 Date 객체로 변환
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 채팅 헤더 */}
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">채팅</h3>
      </div>
      
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-4">
            아직 메시지가 없습니다. 첫 메시지를 보내보세요!
          </p>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUserId;
            
            return (
              <div 
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] rounded-lg p-2 ${
                    isCurrentUser 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {!isCurrentUser && (
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {message.senderName}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                  <p 
                    className={`text-xs mt-1 text-right ${
                      isCurrentUser ? 'text-primary-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* 메시지 입력 폼 */}
      <form 
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 p-2 flex gap-2 bg-white"
      >
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="메시지 입력..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        />
        <button
          type="submit"
          disabled={!messageText.trim()}
          className="bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          전송
        </button>
      </form>
    </div>
  );
}
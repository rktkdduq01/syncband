"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface GridLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  cols?: 1 | 2 | 3 | 4 | 5;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
  headerAction?: React.ReactNode;
  fullWidth?: boolean;
  noContainer?: boolean;
}

const GridLayout = ({
  children,
  title,
  description,
  cols = 3,
  gap = 'md',
  className,
  headerAction,
  fullWidth = false,
  noContainer = false,
}: GridLayoutProps) => {
  // 그리드 열 설정
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  };

  // 그리드 간격 설정
  const gridGap = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const containerContent = (
    <>
      {/* 헤더 영역 */}
      {(title || description) && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
              {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}

      {/* 그리드 콘텐츠 */}
      <div
        className={cn(
          'grid',
          gridCols[cols],
          gridGap[gap],
          className
        )}
      >
        {children}
      </div>
    </>
  );

  // 컨테이너 없이 그리드만 반환하는 경우
  if (noContainer) {
    return containerContent;
  }

  // 컨테이너로 감싸서 반환하는 경우
  return (
    <div className={fullWidth ? 'w-full' : 'container mx-auto px-4 py-8'}>
      {containerContent}
    </div>
  );
};

export default GridLayout;
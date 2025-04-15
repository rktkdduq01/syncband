"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

interface ContentLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerImage?: string;
  breadcrumbs?: {
    label: string;
    href: string;
  }[];
  actions?: React.ReactNode;
  sidebarContent?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  hideNavbar?: boolean;
  hideFooter?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const ContentLayout = ({
  children,
  title,
  subtitle,
  headerImage,
  breadcrumbs,
  actions,
  sidebarContent,
  className,
  containerClassName,
  hideNavbar = false,
  hideFooter = false,
  maxWidth = 'xl',
}: ContentLayoutProps) => {
  // 최대 너비 설정
  const maxWidthClass = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}
      
      {/* 헤더 영역 */}
      {(headerImage || title || subtitle) && (
        <header className={cn(
          "relative py-16 bg-gray-900 text-white",
          headerImage ? "bg-cover bg-center" : ""
        )}
         style={headerImage ? { backgroundImage: `url(${headerImage})` } : undefined}>
          {/* 헤더 이미지가 있을 경우 오버레이 추가 */}
          {headerImage && (
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          )}
          
          <div className={cn(
            "container mx-auto px-4 relative z-10",
            maxWidthClass[maxWidth]
          )}>
            {/* 브레드크럼 */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <li>
                          <span className="text-gray-400">/</span>
                        </li>
                      )}
                      <li>
                        <a 
                          href={crumb.href} 
                          className={cn(
                            "text-sm",
                            index === breadcrumbs.length - 1
                              ? "text-white font-medium"
                              : "text-gray-300 hover:text-white"
                          )}
                        >
                          {crumb.label}
                        </a>
                      </li>
                    </React.Fragment>
                  ))}
                </ol>
              </nav>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                {title && <h1 className="text-3xl font-bold">{title}</h1>}
                {subtitle && <p className="mt-2 text-gray-300">{subtitle}</p>}
              </div>
              {actions && <div>{actions}</div>}
            </div>
          </div>
        </header>
      )}

      {/* 메인 콘텐츠 영역 */}
      <main className={cn("flex-grow py-8", className)}>
        <div className={cn(
          "container mx-auto px-4",
          maxWidthClass[maxWidth],
          containerClassName
        )}>
          {sidebarContent ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* 사이드바가 있을 경우 콘텐츠를 2열로 배치 */}
              <div className="flex-grow order-2 lg:order-1">
                {children}
              </div>
              <div className="w-full lg:w-80 order-1 lg:order-2">
                {sidebarContent}
              </div>
            </div>
          ) : (
            // 사이드바가 없을 경우 전체 너비 사용
            children
          )}
        </div>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
};

export default ContentLayout;
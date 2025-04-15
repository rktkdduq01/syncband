"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from '../common/Navbar';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  rightContent?: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}

const DashboardLayout = ({
  children,
  navItems,
  rightContent,
  pageTitle,
  pageDescription,
}: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* 모바일 메뉴 토글 버튼 */}
      <div className="lg:hidden fixed bottom-4 right-4 z-20">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-full bg-indigo-600 p-3 text-white shadow-lg"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex">
        {/* 사이드바: 대형 화면에서는 항상 표시, 모바일에서는 토글 */}
        <aside
          className={cn(
            "bg-white fixed inset-y-0 left-0 z-10 w-64 transform border-r border-gray-200 pt-16 transition-transform duration-300 lg:static lg:translate-x-0",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="h-full overflow-y-auto px-4 py-6">
            <nav className="space-y-1">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link key={index} href={item.href}>
                    <span 
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                        isActive
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <span className="mr-3 flex-shrink-0 text-gray-500">{item.icon}</span>
                      <span>{item.name}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* 페이지 헤더 */}
            {(pageTitle || pageDescription) && (
              <div className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    {pageTitle && <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>}
                    {pageDescription && <p className="mt-1 text-sm text-gray-500">{pageDescription}</p>}
                  </div>
                  {rightContent && <div>{rightContent}</div>}
                </div>
              </div>
            )}

            {/* 페이지 콘텐츠 */}
            <div className="py-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
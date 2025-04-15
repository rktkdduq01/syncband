"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  backgroundImage?: string;
  showBackButton?: boolean;
  backUrl?: string;
  backText?: string;
}

const AuthLayout = ({
  children,
  title,
  subtitle,
  showLogo = true,
  backgroundImage = '/assets/auth-bg.jpg',
  showBackButton = false,
  backUrl = '/',
  backText = '홈으로 돌아가기'
}: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      {/* 왼쪽 콘텐츠 영역 */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[500px] xl:px-12">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {showLogo && (
            <div className="flex justify-center mb-8">
              <Link href="/">
                <div className="flex items-center">
                  <Image
                    src="/assets/logo.svg"
                    alt="SyncBand"
                    width={50}
                    height={50}
                  />
                  <span className="ml-2 text-2xl font-bold">SyncBand</span>
                </div>
              </Link>
            </div>
          )}

          {showBackButton && (
            <div className="mb-8">
              <Link href={backUrl}>
                <span className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  {backText}
                </span>
              </Link>
            </div>
          )}

          {(title || subtitle) && (
            <div className="mb-8">
              {title && <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>}
              {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
            </div>
          )}

          <div>{children}</div>
        </div>
      </div>

      {/* 오른쪽 이미지 영역 - 모바일에서는 숨김 */}
      <div
        className="hidden lg:block relative w-0 flex-1 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-indigo-900 bg-opacity-40 backdrop-filter backdrop-blur-sm"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="mx-auto w-full max-w-md px-8">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm p-8 rounded-lg shadow-xl">
              <h3 className="text-2xl font-bold text-white">함께 음악을 만들어보세요</h3>
              <p className="mt-2 text-white">
                SyncBand는 전 세계 뮤지션들과 함께 실시간으로 음악을 만들고 공유할 수 있는 플랫폼입니다.
              </p>
              <div className="mt-4">
                <Link href="/learn">
                  <span className="inline-flex items-center text-sm font-medium text-blue-100 hover:text-white">
                    더 알아보기
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
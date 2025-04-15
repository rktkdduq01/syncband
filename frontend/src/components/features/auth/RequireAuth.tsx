"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // 로컬 스토리지에서 토큰 검사
      const token = localStorage.getItem('token');

      if (!token) {
        // 토큰이 없으면 로그인 페이지로 리다이렉트
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      try {
        // 토큰 유효성 검사 (선택적)
        const response = await fetch('/api/auth/validate', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Token validation failed');
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth validation error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isAuthenticated === null) {
    // 인증 확인 중 로딩 상태 표시
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
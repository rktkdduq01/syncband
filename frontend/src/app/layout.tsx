import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

// Inter 폰트 설정
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SyncBand - 온라인 음악 협업 플랫폼',
  description: '전 세계 음악가들과 실시간으로 협업하고, 배우고, 창작하세요. SyncBand는 온라인 음악 스튜디오, 강의, 커뮤니티를 제공합니다.',
  keywords: '온라인 음악, 실시간 음악 협업, 가상 스튜디오, 음악 레슨, 음악가 커뮤니티',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable}`}>
      <head>
        {/* Material Icons */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

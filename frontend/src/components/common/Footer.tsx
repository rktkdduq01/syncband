'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  // 현재 연도 계산
  const currentYear = new Date().getFullYear();
  
  // 사이트맵 링크
  const siteLinks = [
    {
      title: "서비스",
      links: [
        { name: "실시간 잼", href: "/sync-room" },
        { name: "믹스 스튜디오", href: "/mix" },
        { name: "악기 연습", href: "/instruments" },
        { name: "요금제", href: "/pricing" },
      ]
    },
    {
      title: "학습",
      links: [
        { name: "코스", href: "/learn/courses" },
        { name: "악기 학습", href: "/learn/instruments" },
        { name: "튜토리얼", href: "/learn/tutorials" },
        { name: "FAQ", href: "/faq" },
      ]
    },
    {
      title: "커뮤니티",
      links: [
        { name: "포럼", href: "/community/forum" },
        { name: "사용자 작업", href: "/community/showcase" },
        { name: "콜라보레이션", href: "/community/collaborations" },
        { name: "장비 토론", href: "/community/gear" },
      ]
    },
    {
      title: "회사",
      links: [
        { name: "소개", href: "/about" },
        { name: "블로그", href: "/blog" },
        { name: "채용", href: "/careers" },
        { name: "문의하기", href: "/contact" },
      ]
    }
  ];

  // 소셜 미디어 링크
  const socialLinks = [
    { name: "YouTube", icon: "smart_display", href: "https://youtube.com" },
    { name: "Twitter", icon: "flutter_dash", href: "https://twitter.com" },
    { name: "Instagram", icon: "photo_camera", href: "https://instagram.com" },
    { name: "Facebook", icon: "facebook", href: "https://facebook.com" },
  ];
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* 메인 푸터 컨텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* 로고 및 소개 */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8">
                <Image src="/assets/logo.svg" alt="SyncBand 로고" fill className="invert" />
              </div>
              <span className="text-xl font-bold">SyncBand</span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              온라인 음악 협업과 학습을 위한 최고의 플랫폼. 어디서나 음악을 만들고 배우세요.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="material-icons">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 사이트맵 */}
          {siteLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 하단 푸터 */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} SyncBand. 모든 권리 보유.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-gray-500 hover:text-white transition-colors text-sm">
              이용약관
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors text-sm">
              개인정보처리방침
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-white transition-colors text-sm">
              쿠키 정책
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

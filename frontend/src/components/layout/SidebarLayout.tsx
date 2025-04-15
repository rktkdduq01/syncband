"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { cn } from '@/lib/utils';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  items: SidebarItem[];
  title?: string;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

const SidebarLayout = ({ 
  children, 
  items, 
  title = "SyncBand", 
  hideNavbar = false,
  hideFooter = false
}: SidebarLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}
      
      <div className="flex flex-1">
        {/* 사이드바 */}
        <aside 
          className={cn(
            "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out h-[calc(100vh-64px)] sticky top-16",
            collapsed ? "w-16" : "w-64"
          )}
        >
          <div className="p-4 flex items-center justify-between">
            {!collapsed && <h2 className="font-bold text-lg">{title}</h2>}
            <button 
              onClick={toggleSidebar} 
              className="p-1 rounded-full hover:bg-gray-200"
            >
              {collapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          
          <nav className="mt-4">
            <ul className="space-y-1">
              {items.map((item, index) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <li key={index}>
                    <Link href={item.href}>
                      <span 
                        className={cn(
                          "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                          isActive 
                            ? "bg-indigo-100 text-indigo-700" 
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <span className={cn("flex-shrink-0", collapsed ? "mr-0" : "mr-3")}>
                          {item.icon}
                        </span>
                        {!collapsed && <span>{item.name}</span>}
                      </span>
                    </Link>
                    
                    {!collapsed && item.children && item.children.length > 0 && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.children.map((child, childIndex) => {
                          const isChildActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                          
                          return (
                            <li key={`${index}-${childIndex}`}>
                              <Link href={child.href}>
                                <span 
                                  className={cn(
                                    "flex items-center px-2 py-1 text-sm rounded-md transition-colors",
                                    isChildActive 
                                      ? "text-indigo-700 font-medium" 
                                      : "text-gray-600 hover:text-gray-900"
                                  )}
                                >
                                  <span className="h-5 w-5 flex-shrink-0 mr-2">
                                    {child.icon}
                                  </span>
                                  <span>{child.name}</span>
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        
        {/* 메인 콘텐츠 */}
        <main className={cn(
          "flex-1 p-6 transition-all duration-300 ease-in-out",
          collapsed ? "ml-16" : "ml-0"
        )}>
          {children}
        </main>
      </div>
      
      {!hideFooter && <Footer />}
    </div>
  );
};

export default SidebarLayout;
import React, { createContext, useContext, useState } from 'react';

// 탭 컨텍스트 타입
type TabsContextType = {
  value: string;
  onChange: (value: string) => void;
};

// 탭 컨텍스트 생성
const TabsContext = createContext<TabsContextType | undefined>(undefined);

// 커스텀 훅으로 컨텍스트 값 사용
function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs 컴포넌트 내부에서만 사용할 수 있습니다');
  }
  return context;
}

// Tabs 컴포넌트 props
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

// TabsList 컴포넌트 props
interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

// TabsTrigger 컴포넌트 props
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  className?: string;
  children: React.ReactNode;
}

// TabsContent 컴포넌트 props
interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
  children: React.ReactNode;
}

// 메인 Tabs 컴포넌트
const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  className = "",
  children,
  ...props
}) => {
  const [tabValue, setTabValue] = useState(defaultValue);
  
  // 제어 컴포넌트인지 비제어 컴포넌트인지에 따라 값 결정
  const currentValue = value !== undefined ? value : tabValue;
  const handleValueChange = onValueChange || setTabValue;

  return (
    <TabsContext.Provider value={{ value: currentValue, onChange: handleValueChange }}>
      <div className={`tabs ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// 탭 목록 컴포넌트
const TabsList: React.FC<TabsListProps> = ({ className = "", children, ...props }) => {
  return (
    <div 
      role="tablist" 
      className={`flex border-b border-gray-200 dark:border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// 탭 트리거(버튼) 컴포넌트
const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className = "",
  children,
  ...props
}) => {
  const { value: currentValue, onChange } = useTabsContext();
  const isActive = currentValue === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      className={`
        px-4 py-2 -mb-px text-sm font-medium transition-all
        ${isActive 
          ? "border-b-2 border-primary text-primary"
          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        }
        ${className}
      `}
      onClick={() => onChange(value)}
      {...props}
    >
      {children}
    </button>
  );
};

// 탭 콘텐츠 컴포넌트
const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className = "",
  children,
  ...props
}) => {
  const { value: currentValue } = useTabsContext();
  const isActive = currentValue === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={`py-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
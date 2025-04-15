import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

// 버튼 속성 타입
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

// 입력 필드 속성 타입
export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

// 텍스트 영역 속성 타입
export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
};

// 체크박스 속성 타입
export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  description?: string;
  isChecked?: boolean;
  isIndeterminate?: boolean;
  isInvalid?: boolean;
};

// 라디오 버튼 속성 타입
export type RadioProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  description?: string;
  isChecked?: boolean;
  isInvalid?: boolean;
};

// 셀렉트 속성 타입
export type SelectProps = {
  id?: string;
  name?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  onBlur?: () => void;
  options: SelectOption[];
  isMulti?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

// 셀렉트 옵션 타입
export type SelectOption = {
  value: string;
  label: string;
  isDisabled?: boolean;
  group?: string;
};

// 모달 속성 타입
export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  isCentered?: boolean;
  scrollBehavior?: 'inside' | 'outside';
};

// 토스트 타입
export type Toast = {
  id: string;
  title?: string;
  description?: string;
  status: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  isClosable?: boolean;
  position?: ToastPosition;
};

// 토스트 위치 타입
export type ToastPosition = 
  | 'top'
  | 'top-right'
  | 'top-left'
  | 'bottom'
  | 'bottom-right'
  | 'bottom-left';

// 탭 패널 속성 타입
export type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'line' | 'enclosed' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
};

// 탭 타입
export type Tab = {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  isDisabled?: boolean;
};

// 아코디언 속성 타입
export type AccordionProps = {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultIndex?: number | number[];
  onChange?: (expandedIndex: number | number[]) => void;
};

// 아코디언 아이템 타입
export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
  isDisabled?: boolean;
};

// 아바타 속성 타입
export type AvatarProps = {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  badge?: ReactNode;
};

// 테이블 속성 타입
export type TableProps = {
  columns: TableColumn[];
  data: any[];
  isLoading?: boolean;
  sortable?: boolean;
  onSort?: (column: string, direction: SortDirection) => void;
  onRowClick?: (row: any) => void;
  emptyState?: ReactNode;
  pageSize?: number;
  currentPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
};

// 테이블 컬럼 타입
export type TableColumn = {
  id: string;
  header: string;
  accessor: string | ((row: any) => any);
  cell?: (value: any, row: any) => ReactNode;
  isSortable?: boolean;
  width?: string | number;
};

// 정렬 방향 타입
export type SortDirection = 'asc' | 'desc';

// 페이지네이션 속성 타입
export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  siblingCount?: number;
};

// 뱃지 속성 타입
export type BadgeProps = {
  children: ReactNode;
  variant?: 'solid' | 'subtle' | 'outline';
  colorScheme?: 'gray' | 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'pink' | 'orange';
  size?: 'sm' | 'md' | 'lg';
};

// 툴팁 속성 타입
export type TooltipProps = {
  label: string;
  placement?: TooltipPlacement;
  children: ReactNode;
  showDelay?: number;
  hideDelay?: number;
  isDisabled?: boolean;
};

// 툴팁 위치 타입
export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end';
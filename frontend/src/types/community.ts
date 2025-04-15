// 포럼 카테고리 타입
export type ForumCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  order: number;
  topicCount: number;
  latestTopicId?: string;
  parentId?: string;
  isPrivate: boolean;
};

// 포럼 토픽(글) 타입
export type ForumTopic = {
  id: string;
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  replyCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastReplyAt?: Date;
  lastReplyById?: string;
  lastReplyByName?: string;
  tags?: string[];
  attachments?: TopicAttachment[];
  isSolved?: boolean;
  pollId?: string;
};

// 토픽 첨부 파일 타입
export type TopicAttachment = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
};

// 포럼 댓글 타입
export type ForumReply = {
  id: string;
  topicId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  likeCount: number;
  isAcceptedAnswer: boolean;
  attachments?: ReplyAttachment[];
  isEdited: boolean;
  mentions?: string[];
};

// 댓글 첨부 파일 타입
export type ReplyAttachment = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
};

// 포럼 투표 타입
export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  createdAt: Date;
  endsAt?: Date;
  isMultipleChoice: boolean;
  isPublic: boolean;
  totalVotes: number;
};

// 투표 옵션 타입
export type PollOption = {
  id: string;
  text: string;
  voteCount: number;
  voters?: string[];
};

// 쇼케이스 포스트 타입
export type ShowcasePost = {
  id: string;
  title: string;
  description: string;
  content?: string;
  mediaType: 'audio' | 'video' | 'image' | 'sheet-music';
  mediaUrl: string;
  thumbnailUrl?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  genre?: string;
  instruments?: string[];
  isOriginal: boolean;
  coCreators?: Creator[];
  software?: string[];
  duration?: number;
  isFeatured: boolean;
  license?: string;
};

// 공동 창작자 타입
export type Creator = {
  userId?: string;
  name: string;
  role: string;
  profileUrl?: string;
};

// 협업 프로젝트 타입
export type CollaborationProject = {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  tags: string[];
  deadline?: Date;
  genre?: string;
  neededRoles: CollaborationRole[];
  applicants?: CollaborationApplicant[];
  collaborators: Collaborator[];
  privateNotes?: string;
  visibility: 'public' | 'private' | 'unlisted';
  projectType: 'song' | 'album' | 'cover' | 'remix' | 'other';
  referenceLinks?: string[];
};

// 협업 역할 타입
export type CollaborationRole = {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
  isFilled: boolean;
  filledById?: string;
  skills?: string[];
};

// 협업 신청자 타입
export type CollaborationApplicant = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  roleId: string;
  roleName: string;
  message?: string;
  appliedAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
  reviewedAt?: Date;
};

// 협업자 타입
export type Collaborator = {
  userId: string;
  userName: string;
  userAvatar?: string;
  roleId: string;
  roleName: string;
  joinedAt: Date;
  contributions?: string;
};

// 장비 리뷰 타입
export type GearReview = {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  category: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  rating: number;
  pros: string[];
  cons: string[];
  mediaUrls?: string[];
  createdAt: Date;
  updatedAt: Date;
  helpfulCount: number;
  commentCount: number;
  verifiedPurchase: boolean;
  usageDuration: string;
  specifications?: Record<string, string>;
  finalVerdict?: string;
};

// 댓글 타입 (모든 엔티티에 공통으로 사용 가능)
export type Comment = {
  id: string;
  entityId: string;
  entityType: 'showcase' | 'gear-review' | 'collaboration';
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt?: Date;
  parentId?: string;
  likeCount: number;
  isEdited: boolean;
  mentions?: string[];
};

// 알림 타입
export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, any>;
  link?: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
};

// 알림 타입 열거형
export type NotificationType = 
  | 'comment' 
  | 'like' 
  | 'mention' 
  | 'follow' 
  | 'collaboration-invite' 
  | 'collaboration-request' 
  | 'collaboration-accepted' 
  | 'forum-reply' 
  | 'system';
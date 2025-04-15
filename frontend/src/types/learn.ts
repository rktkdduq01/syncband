// 코스 타입
export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  level: CourseLevel;
  category: string;
  instructor: Instructor;
  price: number | null;
  discountPrice?: number;
  isFree: boolean;
  duration: string;
  image: string;
  rating: number;
  ratingCount: number;
  totalLessons: number;
  totalDuration: number;
  tags: string[];
  requirements?: string[];
  learningOutcomes?: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  isPublished: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  lessons?: Lesson[];
  enrollmentCount: number;
  completionRate: number;
};

// 코스 수준 타입 
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all-levels';

// 강사 타입
export type Instructor = {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  expertise: string[];
  rating: number;
  totalCourses: number;
  totalStudents: number;
  socialLinks?: {
    website?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
};

// 레슨 타입
export type Lesson = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  courseId: string;
  order: number;
  type: LessonType;
  duration: number;
  videoUrl?: string;
  videoThumbnail?: string;
  content?: string;
  attachments?: LessonAttachment[];
  isPreview: boolean;
  isCompleted?: boolean;
  quizzes?: Quiz[];
  exercises?: Exercise[];
  notesCount?: number;
  commentsCount?: number;
};

// 레슨 타입 열거형
export type LessonType = 'video' | 'text' | 'quiz' | 'exercise' | 'interactive';

// 레슨 첨부 파일 타입
export type LessonAttachment = {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  description?: string;
};

// 퀴즈 타입
export type Quiz = {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
  attempts?: number;
};

// 퀴즈 질문 타입
export type QuizQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  options?: QuizOption[];
  correctOptionIds: string[];
  explanation?: string;
  points: number;
};

// 질문 타입 열거형
export type QuestionType = 'multiple-choice' | 'single-choice' | 'true-false' | 'fill-in-the-blank' | 'matching';

// 퀴즈 옵션 타입
export type QuizOption = {
  id: string;
  text: string;
};

// 연습 문제 타입
export type Exercise = {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string;
  audioReference?: string;
  sheetMusic?: string;
  duration?: number;
  tips?: string[];
  goals?: string[];
  submissionType: 'audio' | 'video' | 'text';
};

// 연습 문제 제출 타입
export type ExerciseSubmission = {
  id: string;
  exerciseId: string;
  userId: string;
  content: string;
  contentType: 'audio' | 'video' | 'text';
  feedback?: string;
  rating?: number;
  createdAt: Date;
  reviewedAt?: Date;
};

// 코스 진행 상황 타입
export type CourseProgress = {
  courseId: string;
  userId: string;
  completedLessonIds: string[];
  currentLessonId?: string;
  quizResults: QuizResult[];
  exerciseSubmissions: ExerciseSubmission[];
  startDate: Date;
  lastAccessDate: Date;
  completionDate?: Date;
  completionPercentage: number;
  certificateId?: string;
};

// 퀴즈 결과 타입
export type QuizResult = {
  quizId: string;
  score: number;
  isPassed: boolean;
  attemptCount: number;
  lastAttemptDate: Date;
  answers: {
    questionId: string;
    selectedOptionIds: string[];
    isCorrect: boolean;
  }[];
};

// 악기 카테고리 타입
export type InstrumentCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  coursesCount: number;
  popularCourses?: Course[];
};

// 학습 자료 타입
export type LearningResource = {
  id: string;
  title: string;
  type: 'article' | 'video' | 'audio' | 'sheet-music' | 'ebook';
  description: string;
  url?: string;
  content?: string;
  author?: string;
  thumbnail?: string;
  createdAt: Date;
  category: string;
  tags?: string[];
  viewCount: number;
  likeCount: number;
  downloadCount?: number;
  isPremium: boolean;
};

// 학습 노트 타입
export type StudyNote = {
  id: string;
  userId: string;
  courseId?: string;
  lessonId?: string;
  title?: string;
  content: string;
  timestamp?: number;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
};
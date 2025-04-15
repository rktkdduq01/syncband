import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 커뮤니티 포스트 목록 조회
export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // 카테고리 (forum, showcase, gear, collaborations)
    const limit = Number(searchParams.get('limit') || 10);
    const page = Number(searchParams.get('page') || 1);
    const sortBy = searchParams.get('sortBy') || 'latest'; // latest, popular, trending

    // TODO: 실제 포스트 목록 조회 로직 (백엔드 API 호출)
    // 예시 응답
    const posts = [
      {
        id: 'post-1',
        title: '새로운 기타 연주 기법을 공유합니다',
        content: '최근에 발견한 새로운 기타 연주 기법을 공유합니다...',
        authorId: 'user-123',
        authorName: '기타마스터',
        category: 'gear',
        tags: ['기타', '연주 기법', '팁'],
        createdAt: '2023-04-01T10:00:00Z',
        updatedAt: '2023-04-01T10:00:00Z',
        likes: 25,
        comments: 8,
        thumbnail: '/assets/post-thumbnails/guitar-technique.jpg'
      },
      {
        id: 'post-2',
        title: '재즈 세션 멤버를 찾습니다',
        content: '서울 지역에서 주말 재즈 세션할 멤버를 찾고 있습니다...',
        authorId: 'user-456',
        authorName: '재즈피아니스트',
        category: 'collaborations',
        tags: ['재즈', '협업', '서울', '세션'],
        createdAt: '2023-04-02T15:30:00Z',
        updatedAt: '2023-04-02T16:45:00Z',
        likes: 15,
        comments: 12,
        thumbnail: null
      }
    ];

    // 필터링 및 정렬
    let filteredPosts = category 
      ? posts.filter(post => post.category === category) 
      : posts;
      
    // 정렬 로직
    switch(sortBy) {
      case 'popular':
        filteredPosts.sort((a, b) => b.likes - a.likes);
        break;
      case 'trending':
        filteredPosts.sort((a, b) => b.comments - a.comments);
        break;
      case 'latest':
      default:
        filteredPosts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    
    return NextResponse.json({
      success: true,
      posts: filteredPosts,
      pagination: {
        total: filteredPosts.length,
        page,
        limit
      }
    });
  } catch (error) {
    console.error('커뮤니티 포스트 목록 조회 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '포스트 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 새 포스트 작성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, tags, userId, userName } = body;

    if (!title || !content || !category || !userId) {
      return NextResponse.json(
        { success: false, message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // TODO: 실제 포스트 작성 로직 (백엔드 API 호출)
    // 예시 응답
    const postId = `post-${Date.now()}`;
    const timestamp = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: '포스트가 작성되었습니다.',
      post: {
        id: postId,
        title,
        content,
        authorId: userId,
        authorName: userName || '사용자',
        category,
        tags: tags || [],
        createdAt: timestamp,
        updatedAt: timestamp,
        likes: 0,
        comments: 0,
        thumbnail: null
      }
    });
  } catch (error) {
    console.error('포스트 작성 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '포스트 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
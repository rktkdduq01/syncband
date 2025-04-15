import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 특정 포스트 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;

    if (!postId) {
      return NextResponse.json(
        { success: false, message: '포스트 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // TODO: 실제 포스트 조회 로직 (백엔드 API 호출)
    // 예시 응답
    const post = {
      id: postId,
      title: '새로운 기타 연주 기법을 공유합니다',
      content: `
      최근에 발견한 새로운 기타 연주 기법을 공유합니다.
      
      이 기법은 오른손 엄지와 검지를 이용해 동시에 여러 현을 튕기는 방식으로,
      마치 하프를 연주하는 느낌을 줍니다. 구체적인 연습 방법은 다음과 같습니다:
      
      1. 엄지로 4~6번 현을 튕깁니다.
      2. 동시에 검지로 1~3번 현을 튕깁니다.
      3. 이 동작을 리듬감 있게 반복합니다.
      
      첨부한 영상과 악보를 참고해주세요!
      `,
      authorId: 'user-123',
      authorName: '기타마스터',
      authorProfile: '/assets/profiles/user-123.jpg',
      category: 'gear',
      tags: ['기타', '연주 기법', '팁'],
      createdAt: '2023-04-01T10:00:00Z',
      updatedAt: '2023-04-01T10:00:00Z',
      likes: 25,
      comments: [
        {
          id: 'comment-1',
          authorId: 'user-456',
          authorName: '기타학생',
          content: '정말 도움이 되는 팁이에요! 감사합니다.',
          createdAt: '2023-04-01T11:30:00Z',
          likes: 3
        },
        {
          id: 'comment-2',
          authorId: 'user-789',
          authorName: '음악가',
          content: '영상에서 보여주신 손동작이 매우 흥미롭네요. 저도 시도해봐야겠어요.',
          createdAt: '2023-04-01T14:15:00Z',
          likes: 2
        }
      ],
      attachments: [
        {
          id: 'att-1',
          type: 'video',
          url: '/assets/attachments/guitar-technique-video.mp4',
          thumbnail: '/assets/thumbnails/guitar-video.jpg'
        },
        {
          id: 'att-2',
          type: 'pdf',
          url: '/assets/attachments/guitar-tabs.pdf',
          name: '기타 악보.pdf'
        }
      ]
    };

    return NextResponse.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('포스트 조회 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '포스트 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 포스트 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;
    const body = await request.json();
    const { title, content, category, tags, userId } = body;

    if (!postId || !userId) {
      return NextResponse.json(
        { success: false, message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // TODO: 사용자 권한 확인 로직 (작성자인지)
    
    // TODO: 실제 포스트 수정 로직 (백엔드 API 호출)
    // 예시 응답
    return NextResponse.json({
      success: true,
      message: '포스트가 수정되었습니다.',
      post: {
        id: postId,
        title: title || '제목 없음',
        content: content || '',
        category: category || 'general',
        tags: tags || [],
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('포스트 수정 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '포스트 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 포스트 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const postId = params.postId;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!postId || !userId) {
      return NextResponse.json(
        { success: false, message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // TODO: 사용자 권한 확인 로직 (작성자 또는 관리자인지)
    
    // TODO: 실제 포스트 삭제 로직 (백엔드 API 호출)
    // 예시 응답
    return NextResponse.json({
      success: true,
      message: '포스트가 삭제되었습니다.',
      postId
    });
  } catch (error) {
    console.error('포스트 삭제 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '포스트 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
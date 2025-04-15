import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 사용자 프로필 조회
export async function GET(request: NextRequest) {
  try {
    // URL에서 사용자 ID 파라미터 가져오기
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // TODO: 실제 사용자 프로필 조회 로직 (백엔드 API 호출)
    // 예시 응답
    const userProfile = {
      id: userId,
      name: '음악가 사용자',
      email: 'user@example.com',
      bio: '음악을 사랑하는 기타리스트입니다.',
      profileImage: '/assets/profile-images/default.png',
      instruments: ['기타', '피아노'],
      followers: 120,
      following: 85,
      joinDate: '2023-01-15'
    };

    return NextResponse.json({ success: true, profile: userProfile });
  } catch (error) {
    console.error('프로필 조회 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '프로필 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 사용자 프로필 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, bio, instruments } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // TODO: 실제 프로필 업데이트 로직 (백엔드 API 호출)
    // 예시 응답
    return NextResponse.json({
      success: true,
      message: '프로필이 성공적으로 업데이트되었습니다.',
      profile: {
        id: userId,
        name: name || '사용자',
        bio: bio || '',
        instruments: instruments || []
      }
    });
  } catch (error) {
    console.error('프로필 업데이트 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '프로필 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
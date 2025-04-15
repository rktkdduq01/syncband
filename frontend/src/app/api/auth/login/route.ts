import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: 실제 인증 로직 구현 (백엔드 API 호출 또는 직접 인증)
    // 예시 응답 (실제로는 백엔드 API와 연동 필요)
    if (email && password) {
      // 성공 시 사용자 정보 및 토큰 반환
      return NextResponse.json({
        success: true,
        user: {
          id: 'user123',
          email: email,
          name: '사용자',
          profileImage: '/assets/default-profile.png'
        },
        token: 'example-jwt-token'
      });
    } else {
      return NextResponse.json(
        { success: false, message: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('로그인 처리 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
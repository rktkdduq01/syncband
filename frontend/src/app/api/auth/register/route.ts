import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // TODO: 실제 회원가입 로직 구현 (백엔드 API 호출)
    // 예시 응답 (실제로는 백엔드 API와 연동 필요)
    if (email && password && name) {
      // 회원가입 성공 응답
      return NextResponse.json({
        success: true,
        message: '회원가입이 완료되었습니다.',
        user: {
          id: 'new-user-123',
          email,
          name
        }
      });
    } else {
      return NextResponse.json(
        { success: false, message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('회원가입 처리 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '회원가입 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
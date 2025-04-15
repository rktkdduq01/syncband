import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 특정 룸 참가자 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = params.roomId;

    if (!roomId) {
      return NextResponse.json(
        { success: false, message: '룸 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // TODO: 실제 룸 참가자 목록 조회 로직 (백엔드 API 호출)
    // 예시 응답
    const participants = [
      {
        id: 'user-123',
        name: '재즈마스터',
        instrument: '피아노',
        isHost: true,
        joinedAt: '2023-04-01T10:00:00Z',
        status: 'active'
      },
      {
        id: 'user-456',
        name: '베이시스트',
        instrument: '베이스',
        isHost: false,
        joinedAt: '2023-04-01T10:05:00Z',
        status: 'active'
      },
      {
        id: 'user-789',
        name: '드러머',
        instrument: '드럼',
        isHost: false,
        joinedAt: '2023-04-01T10:10:00Z',
        status: 'active'
      }
    ];

    return NextResponse.json({
      success: true,
      participants
    });
  } catch (error) {
    console.error('룸 참가자 목록 조회 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '룸 참가자 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 룸 참가
export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = params.roomId;
    const body = await request.json();
    const { userId, userName, instrument } = body;

    if (!roomId || !userId) {
      return NextResponse.json(
        { success: false, message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // TODO: 실제 룸 참가 로직 (백엔드 API 호출)
    // 예시 응답
    return NextResponse.json({
      success: true,
      message: '룸에 참가했습니다.',
      participant: {
        id: userId,
        name: userName || '참가자',
        instrument: instrument || '기타 악기',
        isHost: false,
        joinedAt: new Date().toISOString(),
        status: 'active'
      }
    });
  } catch (error) {
    console.error('룸 참가 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '룸 참가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 룸에서 특정 참가자 제거 (호스트 권한 필요)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = params.roomId;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const requesterId = searchParams.get('requesterId'); // 요청자 ID (권한 확인용)

    if (!roomId || !userId) {
      return NextResponse.json(
        { success: false, message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // TODO: 실제 참가자 제거 로직 (백엔드 API 호출) - 호스트 권한 체크 포함
    
    // 권한 체크 예시 - 실제로는 백엔드에서 처리
    const isHost = requesterId === 'user-123'; // 예시: user-123이 호스트라고 가정
    
    if (!isHost) {
      return NextResponse.json(
        { success: false, message: '참가자를 제거할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 예시 응답
    return NextResponse.json({
      success: true,
      message: '참가자가 룸에서 제거되었습니다.',
      userId
    });
  } catch (error) {
    console.error('참가자 제거 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '참가자 제거 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
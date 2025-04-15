import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 특정 싱크룸 정보 조회
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

    // TODO: 실제 싱크룸 정보 조회 로직 (백엔드 API 호출)
    // 예시 응답
    const roomInfo = {
      id: roomId,
      name: '주말 재즈 잼 세션',
      hostId: 'user-123',
      hostName: '재즈마스터',
      participants: [
        {
          id: 'user-123',
          name: '재즈마스터',
          instrument: '피아노',
          isHost: true
        },
        {
          id: 'user-456',
          name: '베이시스트',
          instrument: '베이스',
          isHost: false
        },
        {
          id: 'user-789',
          name: '드러머',
          instrument: '드럼',
          isHost: false
        }
      ],
      maxParticipants: 8,
      status: 'active',
      genre: '재즈',
      availableInstruments: ['색소폰', '트럼펫', '기타'],
      startTime: new Date().toISOString(),
      description: '재즈 스탠다드를 함께 연주해요',
      settings: {
        allowSpectators: true,
        isPrivate: false,
        recordSession: true
      }
    };

    return NextResponse.json({
      success: true,
      room: roomInfo
    });
  } catch (error) {
    console.error('싱크룸 정보 조회 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '싱크룸 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 싱크룸 정보 업데이트
export async function PUT(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const roomId = params.roomId;
    const body = await request.json();
    const { name, maxParticipants, genre, description, settings } = body;

    if (!roomId) {
      return NextResponse.json(
        { success: false, message: '룸 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // TODO: 실제 싱크룸 정보 업데이트 로직 (백엔드 API 호출)
    // 예시 응답
    return NextResponse.json({
      success: true,
      message: '싱크룸 정보가 업데이트되었습니다.',
      room: {
        id: roomId,
        name: name || '싱크룸',
        maxParticipants: maxParticipants || 8,
        genre: genre || '기타',
        description: description || '',
        settings: settings || {
          allowSpectators: true,
          isPrivate: false,
          recordSession: true
        }
      }
    });
  } catch (error) {
    console.error('싱크룸 정보 업데이트 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '싱크룸 정보 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 싱크룸 삭제
export async function DELETE(
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

    // TODO: 실제 싱크룸 삭제 로직 (백엔드 API 호출)
    // 예시 응답
    return NextResponse.json({
      success: true,
      message: '싱크룸이 삭제되었습니다.',
      roomId
    });
  } catch (error) {
    console.error('싱크룸 삭제 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '싱크룸 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
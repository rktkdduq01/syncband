import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 싱크룸 목록 조회
export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit') || 10);
    const page = Number(searchParams.get('page') || 1);
    const status = searchParams.get('status'); // 'active', 'scheduled', 'completed' 등

    // TODO: 실제 싱크룸 목록 조회 로직 (백엔드 API 호출)
    // 예시 응답
    const rooms = [
      {
        id: 'room-1',
        name: '주말 재즈 잼 세션',
        hostId: 'user-123',
        hostName: '재즈마스터',
        participants: 3,
        maxParticipants: 8,
        status: 'active',
        genre: '재즈',
        instruments: ['피아노', '베이스', '드럼'],
        startTime: new Date().toISOString(),
        description: '재즈 스탠다드를 함께 연주해요'
      },
      {
        id: 'room-2',
        name: '락 밴드 세션',
        hostId: 'user-456',
        hostName: '록스타',
        participants: 4,
        maxParticipants: 5,
        status: 'active',
        genre: '락',
        instruments: ['일렉기타', '베이스', '드럼', '보컬'],
        startTime: new Date().toISOString(),
        description: '락 클래식 커버 밴드'
      }
    ];

    // 필터링 처리 (예: status가 지정된 경우)
    const filteredRooms = status 
      ? rooms.filter(room => room.status === status)
      : rooms;

    return NextResponse.json({
      success: true,
      rooms: filteredRooms,
      pagination: {
        total: filteredRooms.length,
        page,
        limit
      }
    });
  } catch (error) {
    console.error('싱크룸 목록 조회 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '싱크룸 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 새 싱크룸 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, hostId, maxParticipants, genre, instruments, description } = body;

    if (!name || !hostId) {
      return NextResponse.json(
        { success: false, message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // TODO: 실제 싱크룸 생성 로직 (백엔드 API 호출)
    // 예시 응답
    const newRoomId = `room-${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      message: '싱크룸이 생성되었습니다.',
      room: {
        id: newRoomId,
        name,
        hostId,
        participants: 1, // 호스트만 있는 상태
        maxParticipants: maxParticipants || 8,
        status: 'active',
        genre: genre || '기타',
        instruments: instruments || [],
        startTime: new Date().toISOString(),
        description: description || ''
      }
    });
  } catch (error) {
    console.error('싱크룸 생성 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '싱크룸 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
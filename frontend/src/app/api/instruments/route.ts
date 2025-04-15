import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 악기 목록 조회
export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // TODO: 실제 악기 목록 조회 로직 (백엔드 API 호출)
    // 예시 응답
    const instruments = [
      {
        id: 'guitar',
        name: '기타',
        category: '현악기',
        types: ['어쿠스틱 기타', '일렉트릭 기타', '베이스 기타'],
        description: '줄을 튕겨 소리를 내는 대표적인 현악기입니다.',
        icon: '/assets/instruments/guitar.svg'
      },
      {
        id: 'piano',
        name: '피아노',
        category: '건반악기',
        types: ['그랜드 피아노', '업라이트 피아노', '디지털 피아노', '신시사이저'],
        description: '건반을 눌러 해머가 현을 치는 방식으로 소리를 내는 악기입니다.',
        icon: '/assets/instruments/piano.svg'
      },
      {
        id: 'drums',
        name: '드럼',
        category: '타악기',
        types: ['어쿠스틱 드럼', '전자 드럼'],
        description: '다양한 타악기를 조합한 세트형 악기입니다.',
        icon: '/assets/instruments/drums.svg'
      },
      {
        id: 'violin',
        name: '바이올린',
        category: '현악기',
        types: ['클래식 바이올린', '일렉트릭 바이올린'],
        description: '활로 줄을 문질러 소리를 내는 현악기입니다.',
        icon: '/assets/instruments/violin.svg'
      },
      {
        id: 'saxophone',
        name: '색소폰',
        category: '관악기',
        types: ['소프라노', '알토', '테너', '바리톤'],
        description: '호흡으로 소리를 내는 금관악기입니다.',
        icon: '/assets/instruments/saxophone.svg'
      }
    ];
    
    // 카테고리 필터링
    const filteredInstruments = category
      ? instruments.filter(instrument => instrument.category === category)
      : instruments;
    
    return NextResponse.json({
      success: true,
      instruments: filteredInstruments
    });
  } catch (error) {
    console.error('악기 목록 조회 중 오류 발생:', error);
    return NextResponse.json(
      { success: false, message: '악기 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
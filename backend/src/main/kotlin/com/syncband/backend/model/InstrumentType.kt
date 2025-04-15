package com.syncband.backend.model

/**
 * SyncBand 애플리케이션에서 지원하는 악기 타입 열거형
 */
enum class InstrumentType {
    GUITAR,        // 기타
    BASS,          // 베이스
    DRUMS,         // 드럼
    KEYBOARD,      // 키보드/피아노
    VOCAL,         // 보컬
    VIOLIN,        // 바이올린
    CELLO,         // 첼로
    FLUTE,         // 플룻
    SAXOPHONE,     // 색소폰
    TRUMPET,       // 트럼펫
    HARMONICA,     // 하모니카
    UKULELE,       // 우쿨렐레
    BANJO,         // 밴조
    MANDOLIN,      // 만돌린
    HARP,          // 하프
    ACCORDION,     // 아코디언
    SYNTHESIZER,   // 신디사이저
    CLARINET,      // 클라리넷
    TROMBONE,      // 트롬본
    OTHER;         // 기타 악기
    
    companion object {
        /**
         * 문자열로부터 악기 타입 열거형 값을 반환
         * 대소문자 구분 없이 일치하는 값 반환, 일치하는 값이 없으면 OTHER 반환
         */
        fun fromString(value: String): InstrumentType {
            return values().find { 
                it.name.equals(value, ignoreCase = true) 
            } ?: OTHER
        }
    }
}
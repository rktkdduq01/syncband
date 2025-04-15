package com.syncband.backend.model

/**
 * SyncBand 애플리케이션에서 사용하는 콘텐츠 난이도 레벨
 */
enum class DifficultyLevel {
    BEGINNER,      // 입문
    EASY,          // 쉬움
    INTERMEDIATE,  // 중급
    ADVANCED,      // 고급
    EXPERT;        // 전문가
    
    companion object {
        /**
         * 문자열로부터 난이도 레벨 열거형 값을 반환
         * 대소문자 구분 없이 일치하는 값 반환, 일치하는 값이 없으면 BEGINNER 반환
         */
        fun fromString(value: String): DifficultyLevel {
            return values().find { 
                it.name.equals(value, ignoreCase = true) 
            } ?: BEGINNER
        }
    }
}
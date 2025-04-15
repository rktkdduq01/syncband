package com.syncband.backend.exception

import org.springframework.http.HttpStatus
import java.time.LocalDateTime

data class ApiError(
    val status: HttpStatus,
    val message: String,
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val debugMessage: String? = null,
    val subErrors: List<ApiSubError> = emptyList()
) {
    // API 하위 오류를 표현하기 위한 인터페이스
    interface ApiSubError

    // 유효성 검사 오류를 표현하기 위한 클래스
    data class ApiValidationError(
        val objectName: String,
        val field: String? = null,
        val rejectedValue: Any? = null,
        val message: String? = null
    ) : ApiSubError
}
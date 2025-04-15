package com.syncband.backend.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

// 리소스를 찾을 수 없는 경우 사용하는 예외
@ResponseStatus(HttpStatus.NOT_FOUND)
class ResourceNotFoundException(message: String) : RuntimeException(message)

// 잘못된 요청 파라미터나 본문인 경우 사용하는 예외
@ResponseStatus(HttpStatus.BAD_REQUEST)
class BadRequestException(message: String) : RuntimeException(message)

// 인증이 필요한 작업에서 인증이 되지 않았을 때 사용하는 예외
@ResponseStatus(HttpStatus.UNAUTHORIZED)
class UnauthorizedException(message: String) : RuntimeException(message) 

// 권한이 없는 작업을 시도했을 때 사용하는 예외
@ResponseStatus(HttpStatus.FORBIDDEN)
class ForbiddenException(message: String) : RuntimeException(message)

// 파일이나 리소스 처리 중 오류가 발생한 경우 사용하는 예외
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
class FileProcessingException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)

// 중복 데이터나 충돌이 발생한 경우 사용하는 예외
@ResponseStatus(HttpStatus.CONFLICT)
class DataConflictException(message: String) : RuntimeException(message)
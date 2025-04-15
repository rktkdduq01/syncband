package com.syncband.backend.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import java.io.IOException

// ResourceNotFoundException은 CustomExceptions.kt에 이미 정의되어 있으므로 제거했습니다

@ResponseStatus(HttpStatus.CONFLICT)
class UserAlreadyExistsException(message: String) : RuntimeException(message)

@ResponseStatus(HttpStatus.FORBIDDEN)
class AccessDeniedException(message: String) : RuntimeException(message)

@ResponseStatus(HttpStatus.BAD_REQUEST)
class InvalidRequestException(message: String) : RuntimeException(message)

// FileStorageException은 FileStorageException.kt에 이미 정의되어 있으므로 제거했습니다
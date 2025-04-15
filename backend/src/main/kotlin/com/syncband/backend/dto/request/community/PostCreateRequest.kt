package com.syncband.backend.dto.request.community

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class PostCreateRequest(
    @field:NotBlank(message = "제목은 필수입니다")
    @field:Size(max = 100, message = "제목은 최대 100자까지 입력 가능합니다")
    val title: String,
    
    @field:NotBlank(message = "내용은 필수입니다")
    @field:Size(max = 10000, message = "내용은 최대 10000자까지 입력 가능합니다")
    val content: String,
    
    @field:NotNull(message = "카테고리는 필수입니다")
    val categoryId: Long,
    
    val tagIds: List<Long> = emptyList()
)
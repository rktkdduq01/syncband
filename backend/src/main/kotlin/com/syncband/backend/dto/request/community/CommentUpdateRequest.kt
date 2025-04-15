package com.syncband.backend.dto.request.community

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CommentUpdateRequest(
    @field:NotBlank(message = "댓글 내용은 필수입니다")
    @field:Size(max = 500, message = "댓글은 최대 500자까지 입력 가능합니다")
    val content: String
)
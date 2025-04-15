package com.syncband.backend.dto.request.community

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.util.*

class PostCreateRequest(
    @field:NotBlank(message = "제목은 필수 입력값입니다")
    @field:Size(min = 2, max = 200, message = "제목은 2자 이상 200자 이하여야 합니다")
    val title: String,
    
    @field:NotBlank(message = "내용은 필수 입력값입니다")
    @field:Size(min = 10, message = "내용은 최소 10자 이상이어야 합니다")
    val content: String,
    
    @field:NotBlank(message = "카테고리 ID는 필수 입력값입니다")
    val categoryId: Long,
    
    val tagIds: Set<Long> = emptySet()
)

class PostUpdateRequest(
    @field:NotBlank(message = "제목은 필수 입력값입니다")
    @field:Size(min = 2, max = 200, message = "제목은 2자 이상 200자 이하여야 합니다")
    val title: String,
    
    @field:NotBlank(message = "내용은 필수 입력값입니다")
    @field:Size(min = 10, message = "내용은 최소 10자 이상이어야 합니다")
    val content: String,
    
    @field:NotBlank(message = "카테고리 ID는 필수 입력값입니다")
    val categoryId: Long,
    
    val tagIds: Set<Long> = emptySet()
)

class PostSearchRequest(
    val keyword: String? = null,
    val categoryId: Long? = null,
    val tagIds: Set<Long>? = null,
    val userId: Long? = null,
    val page: Int = 0,
    val size: Int = 20,
    val sortBy: String = "createdAt",
    val sortDirection: String = "DESC"
)

class CommentCreateRequest(
    @field:NotBlank(message = "내용은 필수 입력값입니다")
    @field:Size(min = 1, max = 1000, message = "댓글은 1000자를 초과할 수 없습니다")
    val content: String,
    
    val parentCommentId: Long? = null
)

class CommentUpdateRequest(
    @field:NotBlank(message = "내용은 필수 입력값입니다")
    @field:Size(min = 1, max = 1000, message = "댓글은 1000자를 초과할 수 없습니다")
    val content: String
)
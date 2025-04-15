package com.syncband.backend.dto.request.learning

import com.syncband.backend.model.ContentType
import com.syncband.backend.model.DifficultyLevel
import com.syncband.backend.model.InstrumentType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

class LearningContentCreateRequest(
    @field:NotBlank(message = "제목은 필수 입력값입니다")
    @field:Size(min = 2, max = 200, message = "제목은 2자 이상 200자 이하여야 합니다")
    val title: String,
    
    @field:NotBlank(message = "내용은 필수 입력값입니다")
    val content: String,
    
    @field:NotBlank(message = "컨텐츠 유형은 필수 입력값입니다")
    val contentType: ContentType,
    
    @field:NotBlank(message = "난이도는 필수 입력값입니다")
    val difficultyLevel: DifficultyLevel,
    
    val instrumentType: InstrumentType? = null,
    
    val videoUrl: String? = null,
    
    val thumbnailUrl: String? = null,
    
    val tags: List<String>? = null,
    
    val isPublic: Boolean = true
)

class LearningContentUpdateRequest(
    @field:Size(min = 2, max = 200, message = "제목은 2자 이상 200자 이하여야 합니다")
    val title: String? = null,
    
    val content: String? = null,
    
    val contentType: ContentType? = null,
    
    val difficultyLevel: DifficultyLevel? = null,
    
    val instrumentType: InstrumentType? = null,
    
    val videoUrl: String? = null,
    
    val thumbnailUrl: String? = null,
    
    val tags: List<String>? = null,
    
    val isPublic: Boolean? = null
)

class LearningContentSearchRequest(
    val keyword: String? = null,
    
    val contentType: ContentType? = null,
    
    val difficultyLevel: DifficultyLevel? = null,
    
    val instrumentType: InstrumentType? = null,
    
    val tags: List<String>? = null,
    
    val userId: Long? = null,
    
    val includePrivate: Boolean = false,
    
    val page: Int = 0,
    
    val size: Int = 20,
    
    val sortBy: String = "createdAt",
    
    val sortDirection: String = "DESC"
)
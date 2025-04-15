package com.syncband.backend.dto.response.community

data class CategoryResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val postCount: Int,
    val displayOrder: Int,
    val isActive: Boolean
)

data class CategoryListResponse(
    val categories: List<CategoryResponse>
)
package com.syncband.backend.dto.request.community

data class PostSearchRequest(
    val keyword: String? = null,
    val categoryId: Long? = null,
    val tagId: Long? = null,
    val userId: Long? = null,
    val page: Int = 0,
    val size: Int = 20,
    val sort: String = "createdAt,desc",
    val sortBy: String? = "createdAt",
    val sortDirection: String? = "DESC"
)
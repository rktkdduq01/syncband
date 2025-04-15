package com.syncband.backend.dto.response.community

data class TagResponse(
    val id: Long,
    val name: String,
    val postCount: Int
)

data class TagListResponse(
    val tags: List<TagResponse>
)
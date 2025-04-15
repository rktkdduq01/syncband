package com.syncband.backend.dto.response.user

import java.time.LocalDateTime

data class UserProfileResponse(
    val id: Long,
    val username: String,
    val email: String,
    val profileImageUrl: String?,
    val bio: String?,
    val createdAt: LocalDateTime,
    val lastActiveAt: LocalDateTime?,
    val followersCount: Int,
    val followingCount: Int,
    val isFollowingByCurrentUser: Boolean
)

data class UserSummaryResponse(
    val id: Long,
    val username: String,
    val profileImageUrl: String?,
    val isFollowingByCurrentUser: Boolean
)

data class UserListResponse(
    val users: List<UserSummaryResponse>,
    val totalCount: Long,
    val page: Int,
    val size: Int,
    val totalPages: Int
)

data class UserFollowResponse(
    val userId: Long,
    val targetUserId: Long,
    val followed: Boolean,
    val timestamp: LocalDateTime
)

data class UserStatsResponse(
    val userId: Long,
    val postCount: Int,
    val trackCount: Int,
    val mixProjectCount: Int,
    val followersCount: Int,
    val followingCount: Int
)

data class UserActivityResponse(
    val userId: Long,
    val recentPosts: List<UserActivityItemResponse>,
    val recentTracks: List<UserActivityItemResponse>,
    val recentMixProjects: List<UserActivityItemResponse>
)

data class UserActivityItemResponse(
    val id: Long,
    val type: String,
    val title: String,
    val createdAt: LocalDateTime
)
// src/main/kotlin/com/syncband/backend/service/UserService.kt
package com.syncband.backend.service

import com.syncband.backend.dto.UserProfileResponse
import com.syncband.backend.dto.UserProfileUpdateRequest
import com.syncband.backend.exception.ResourceNotFoundException
import com.syncband.backend.model.User
import com.syncband.backend.repository.UserRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.time.LocalDateTime
import java.util.UUID

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) : UserDetailsService {
    // 프로필 이미지 저장 경로
    private val profileImageDir: Path = Paths.get("uploads/profile-images")

    init {
        // 업로드 디렉토리 생성
        Files.createDirectories(profileImageDir)
    }

    @Transactional(readOnly = true)
    fun getUserById(userId: Long): User {
        return userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User not found with id: $userId") }
    }

    @Transactional(readOnly = true)
    fun getUserProfile(userId: Long): UserProfileResponse {
        val user = getUserById(userId)
        return mapToUserProfileResponse(user)
    }

    @Transactional
    fun updateUserProfile(userId: Long, request: UserProfileUpdateRequest): UserProfileResponse {
        val user = getUserById(userId)

        // 프로필 정보 업데이트
        request.fullName?.let { user.fullName = it }
        request.bio?.let { user.bio = it }
        user.updatedAt = LocalDateTime.now()

        val updatedUser = userRepository.save(user)
        return mapToUserProfileResponse(updatedUser)
    }

    @Transactional
    fun changePassword(userId: Long, currentPassword: String, newPassword: String): Boolean {
        val user = getUserById(userId)

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(currentPassword, user.password)) {
            return false
        }

        // 새 비밀번호 설정
        user.password = passwordEncoder.encode(newPassword)
        user.updatedAt = LocalDateTime.now()
        
        userRepository.save(user)
        return true
    }

    @Transactional
    fun uploadProfileImage(userId: Long, file: MultipartFile): UserProfileResponse {
        val user = getUserById(userId)

        // 기존 프로필 이미지가 있으면 삭제
        user.profileImageUrl?.let {
            val oldFileName = it.substringAfterLast("/")
            val oldFilePath = profileImageDir.resolve(oldFileName)
            Files.deleteIfExists(oldFilePath)
        }

        // 새 프로필 이미지 저장
        val fileName = "${UUID.randomUUID()}_${file.originalFilename}"
        val filePath = profileImageDir.resolve(fileName)
        Files.copy(file.inputStream, filePath)

        // 프로필 이미지 URL 업데이트
        user.profileImageUrl = "/api/users/images/$fileName"
        user.updatedAt = LocalDateTime.now()

        val updatedUser = userRepository.save(user)
        return mapToUserProfileResponse(updatedUser)
    }

    // 사용자 엔티티를 UserProfileResponse DTO로 매핑하는 유틸리티 메서드
    private fun mapToUserProfileResponse(user: User): UserProfileResponse {
        return UserProfileResponse(
            id = user.id,
            username = user.username,
            email = user.email,
            fullName = user.fullName,
            profileImageUrl = user.profileImageUrl,
            bio = user.bio,
            role = user.role.name,
            createdAt = user.createdAt,
            updatedAt = user.updatedAt
        )
    }

    fun findByEmail(email: String): User {
        return userRepository.findByEmail(email)
            .orElseThrow { UsernameNotFoundException("사용자를 찾을 수 없습니다: $email") }
    }

    fun existsByEmail(email: String): Boolean {
        return userRepository.existsByEmail(email)
    }

    fun saveUser(user: User): User {
        return userRepository.save(user)
    }

    override fun loadUserByUsername(username: String): UserDetails {
        val user = findByEmail(username)

        return org.springframework.security.core.userdetails.User.builder()
            .username(user.email)
            .password(user.password)
            .authorities(SimpleGrantedAuthority("USER"))
            .build()
    }
}
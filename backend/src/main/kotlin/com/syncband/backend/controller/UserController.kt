package com.syncband.backend.controller

import com.syncband.backend.dto.PasswordChangeRequest
import com.syncband.backend.dto.UserProfileResponse
import com.syncband.backend.dto.UserProfileUpdateRequest
import com.syncband.backend.exception.InvalidRequestException
import com.syncband.backend.service.UserService
import jakarta.validation.Valid
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Path
import java.nio.file.Paths

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {

    private val profileImageDir: Path = Paths.get("uploads/profile-images")

    @GetMapping("/profile")
    fun getUserProfile(
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<UserProfileResponse> {
        val userId = extractUserId(userDetails)
        val userProfile = userService.getUserProfile(userId)
        return ResponseEntity.ok(userProfile)
    }

    @GetMapping("/{userId}/profile")
    fun getOtherUserProfile(
        @PathVariable userId: Long
    ): ResponseEntity<UserProfileResponse> {
        val userProfile = userService.getUserProfile(userId)
        return ResponseEntity.ok(userProfile)
    }

    @PutMapping("/profile")
    fun updateUserProfile(
        @AuthenticationPrincipal userDetails: UserDetails,
        @Valid @RequestBody request: UserProfileUpdateRequest
    ): ResponseEntity<UserProfileResponse> {
        val userId = extractUserId(userDetails)
        val updatedProfile = userService.updateUserProfile(userId, request)
        return ResponseEntity.ok(updatedProfile)
    }

    @PostMapping("/change-password")
    fun changePassword(
        @AuthenticationPrincipal userDetails: UserDetails,
        @Valid @RequestBody request: PasswordChangeRequest
    ): ResponseEntity<Map<String, String>> {
        val userId = extractUserId(userDetails)
        
        // 비밀번호 확인
        if (request.newPassword != request.confirmPassword) {
            throw InvalidRequestException("새 비밀번호와 확인이 일치하지 않습니다")
        }
        
        val success = userService.changePassword(userId, request.currentPassword, request.newPassword)
        
        return if (success) {
            ResponseEntity.ok(mapOf("message" to "비밀번호가 성공적으로 변경되었습니다"))
        } else {
            ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf("message" to "현재 비밀번호가 올바르지 않습니다"))
        }
    }

    @PostMapping("/profile-image")
    fun uploadProfileImage(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestParam("image") file: MultipartFile
    ): ResponseEntity<UserProfileResponse> {
        val userId = extractUserId(userDetails)
        val updatedProfile = userService.uploadProfileImage(userId, file)
        return ResponseEntity.ok(updatedProfile)
    }

    @GetMapping("/images/{fileName:.+}")
    fun getProfileImage(@PathVariable fileName: String): ResponseEntity<Resource> {
        val file = profileImageDir.resolve(fileName)
        val resource = UrlResource(file.toUri())

        if (resource.exists() && resource.isReadable) {
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"${resource.filename}\"")
                .contentType(MediaType.IMAGE_JPEG) // 이미지 타입에 맞게 설정
                .body(resource)
        } else {
            return ResponseEntity.notFound().build()
        }
    }

    // Spring Security에서 저장된 사용자 ID를 추출하는 유틸리티 메서드
    private fun extractUserId(userDetails: UserDetails): Long {
        // 실제 구현에서는 UserDetails 구현 클래스에서 사용자 ID를 가져와야 함
        // 아래 코드는 예시로, 실제로는 프로젝트 구현에 맞게 수정필요
        return userDetails.username.toLong()
    }
}
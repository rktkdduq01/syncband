package com.syncband.backend.controller

import com.syncband.backend.dto.MixingRequest
import com.syncband.backend.dto.MixingResponse
import com.syncband.backend.service.MixingService
import org.springframework.core.io.InputStreamResource
import org.springframework.core.io.Resource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*
import java.io.FileInputStream

@RestController
@RequestMapping("/api/mixes")
class MixingController(
    private val mixingService: MixingService
) {

    @PostMapping
    fun mixTracks(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestBody request: MixingRequest
    ): ResponseEntity<MixingResponse> {
        val userId = extractUserId(userDetails)
        val mixingResponse = mixingService.mixTracks(userId, request)
        return ResponseEntity.ok(mixingResponse)
    }

    @GetMapping("/files/{fileName:.+}")
    fun downloadMixFile(
        @PathVariable fileName: String
    ): ResponseEntity<Resource> {
        val file = mixingService.getMixFile(fileName)
        val resource = InputStreamResource(FileInputStream(file))

        val headers = HttpHeaders()
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"${file.name}\"")

        return ResponseEntity.ok()
            .headers(headers)
            .contentLength(file.length())
            .contentType(MediaType.parseMediaType("audio/wav"))
            .body(resource)
    }

    // Spring Security에서 저장된 사용자 ID를 추출하는 유틸리티 메서드
    private fun extractUserId(userDetails: UserDetails): Long {
        // 실제 구현에서는 UserDetails 구현 클래스에서 사용자 ID를 가져와야 함
        // 아래 코드는 예시로, 실제로는 프로젝트 구현에 맞게 수정필요
        return userDetails.username.toLong()
    }
}
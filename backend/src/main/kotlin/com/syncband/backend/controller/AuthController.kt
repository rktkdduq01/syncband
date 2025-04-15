// src/main/kotlin/com/syncband/backend/controller/AuthController.kt
package com.syncband.backend.controller

import com.syncband.backend.dto.LoginRequest
import com.syncband.backend.dto.LoginResponse
import com.syncband.backend.dto.RegisterRequest
import com.syncband.backend.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<Map<String, String>> {
        val user = authService.register(request)
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(mapOf("message" to "User registered successfully", "username" to user.username))
    }

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {
        val loginResponse = authService.login(request)
        return ResponseEntity.ok(loginResponse)
    }
}
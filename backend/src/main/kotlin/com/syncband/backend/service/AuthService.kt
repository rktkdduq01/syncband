package com.syncband.backend.service

import com.syncband.backend.dto.LoginRequest
import com.syncband.backend.dto.LoginResponse
import com.syncband.backend.dto.RegisterRequest
import com.syncband.backend.exception.InvalidRequestException
import com.syncband.backend.exception.ResourceNotFoundException
import com.syncband.backend.exception.UserAlreadyExistsException
import com.syncband.backend.model.User
import com.syncband.backend.model.UserRole
import com.syncband.backend.repository.UserRepository
import com.syncband.backend.security.JwtUtil
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtUtil: JwtUtil,
    private val authenticationManager: AuthenticationManager
) {

    @Transactional
    fun register(request: RegisterRequest): User {
        // 사용자명 중복 확인
        if (userRepository.existsByUsername(request.username)) {
            throw UserAlreadyExistsException("Username ${request.username} is already taken")
        }

        // 이메일 중복 확인
        if (userRepository.existsByEmail(request.email)) {
            throw UserAlreadyExistsException("Email ${request.email} is already registered")
        }

        // 비밀번호 암호화 및 사용자 생성
        val encodedPassword = passwordEncoder.encode(request.password)
        
        val user = User(
            username = request.username,
            password = encodedPassword,
            email = request.email,
            fullName = request.fullName,
            role = UserRole.USER
        )

        return userRepository.save(user)
    }

    @Transactional
    fun login(request: LoginRequest): LoginResponse {
        try {
            val authentication: Authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(request.username, request.password)
            )
            
            SecurityContextHolder.getContext().authentication = authentication
            
            val userDetails = authentication.principal as UserDetails
            val jwtToken = jwtUtil.generateToken(userDetails)
            
            val user = userRepository.findByUsername(userDetails.username)
                .orElseThrow { ResourceNotFoundException("User not found with username: ${userDetails.username}") }
            
            return LoginResponse(
                token = jwtToken,
                userId = user.id,
                username = user.username,
                email = user.email,
                fullName = user.fullName,
                role = user.role.name
            )
        } catch (e: Exception) {
            throw InvalidRequestException("Invalid username or password")
        }
    }
}
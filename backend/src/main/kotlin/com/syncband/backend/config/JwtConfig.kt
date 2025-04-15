package com.syncband.backend.config

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.security.Key
import java.util.Date

@Component
class JwtConfig {
    
    @Value("\${jwt.secret:syncband_default_secret_key_for_json_web_token_please_change_in_production}")
    private val secretKey: String = ""
    
    @Value("\${jwt.expiration:86400000}") // 24시간 (밀리초 단위)
    private val expirationTime: Long = 0
    
    private val key: Key by lazy {
        Keys.hmacShaKeyFor(secretKey.toByteArray())
    }
    
    // JWT 토큰 생성
    fun generateToken(username: String): String {
        val now = Date()
        val expiration = Date(now.time + expirationTime)
        
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(now)
            .setExpiration(expiration)
            .signWith(key, SignatureAlgorithm.HS256)
            .compact()
    }
    
    // 토큰 유효성 검증
    fun validateToken(token: String): Boolean {
        return try {
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
            true
        } catch (e: Exception) {
            false
        }
    }
    
    // 토큰에서 사용자 이름 추출
    fun getUsernameFromToken(token: String): String {
        val claims: Claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .body
        return claims.subject
    }
}
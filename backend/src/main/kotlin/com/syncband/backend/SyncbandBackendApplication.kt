package com.syncband.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary
import org.springframework.security.core.userdetails.UserDetailsService
import com.syncband.backend.security.UserDetailsServiceImpl

@SpringBootApplication
class SyncbandBackendApplication {
    
    // UserDetailsServiceImpl을 기본 UserDetailsService 구현체로 지정
    @Bean
    @Primary
    fun primaryUserDetailsService(userDetailsServiceImpl: UserDetailsServiceImpl): UserDetailsService {
        return userDetailsServiceImpl
    }
    
    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            runApplication<SyncbandBackendApplication>(*args)
        }
    }
}
package com.syncband.backend.config

import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer

@Configuration
class WebSocketSecurityConfig : AbstractSecurityWebSocketMessageBrokerConfigurer() {

    override fun configureInbound(messages: MessageSecurityMetadataSourceRegistry) {
        messages
            // 웹소켓 연결 및 메시지 전송을 인증된 사용자만 가능하도록 설정
            .simpDestMatchers("/ws/**").authenticated()
            .simpSubscribeDestMatchers("/topic/**", "/queue/**").authenticated()
            .simpMessageDestMatchers("/app/**").authenticated()
            .anyMessage().authenticated()
    }

    // CSRF 보호 비활성화 (JWT 기반 인증 사용)
    override fun sameOriginDisabled(): Boolean {
        return true
    }
}
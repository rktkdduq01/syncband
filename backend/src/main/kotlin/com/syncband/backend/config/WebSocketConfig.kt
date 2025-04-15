package com.syncband.backend.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer

@Configuration
@EnableWebSocketMessageBroker
class WebSocketConfig : WebSocketMessageBrokerConfigurer {

    @Value("\${websocket.allowed-origins:*}")
    private lateinit var allowedOrigins: String

    @Value("\${websocket.endpoint:/ws}")
    private lateinit var endpoint: String

    @Value("\${websocket.application-destination-prefixes:/app}")
    private lateinit var applicationDestinationPrefixes: String

    @Value("\${websocket.simple-broker:/topic, /queue}")
    private lateinit var simpleBroker: String

    override fun configureMessageBroker(registry: MessageBrokerRegistry) {
        registry.enableSimpleBroker(*simpleBroker.split(",").map { it.trim() }.toTypedArray())
        registry.setApplicationDestinationPrefixes(applicationDestinationPrefixes)
        registry.setUserDestinationPrefix("/user")
    }

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        registry.addEndpoint(endpoint)
            .setAllowedOrigins(allowedOrigins)
            .withSockJS()
    }
}
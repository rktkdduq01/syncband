package com.syncband.backend.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/health")
class HealthCheckController {

    @GetMapping
    fun healthCheck(): ResponseEntity<Map<String, Any>> {
        val response = mapOf(
            "status" to "UP",
            "timestamp" to LocalDateTime.now(),
            "service" to "SyncBand Backend",
            "version" to "1.0.0"
        )
        return ResponseEntity.ok(response)
    }
}
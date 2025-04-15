package com.syncband.backend.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/projects")
class MixProjectController {

    // 프로젝트 생성
    @PostMapping
    fun createProject(@RequestBody projectRequest: Map<String, Any>): ResponseEntity<Map<String, Any>> {
        // 프로젝트 생성 로직
        val project = mapOf<String, Any>(
            "id" to "1",
            "name" to (projectRequest["name"] ?: "Untitled Project"),
            "createdAt" to System.currentTimeMillis()
        )
        
        return ResponseEntity(project, HttpStatus.CREATED)
    }
    
    // 프로젝트 조회
    @GetMapping("/{id}")
    fun getProject(@PathVariable id: String): ResponseEntity<Map<String, Any>> {
        // 프로젝트 조회 로직
        val project = mapOf<String, Any>(
            "id" to id,
            "name" to "My Mix Project",
            "tracks" to listOf(
                mapOf("id" to "1", "name" to "Vocal Track"),
                mapOf("id" to "2", "name" to "Guitar Track")
            ),
            "createdAt" to 1678900000000
        )
        
        return ResponseEntity(project, HttpStatus.OK)
    }
    
    // 모든 프로젝트 목록 조회
    @GetMapping
    fun getAllProjects(): ResponseEntity<List<Map<String, Any>>> {
        // 모든 프로젝트 조회 로직
        val projects = listOf(
            mapOf<String, Any>("id" to "1", "name" to "Rock Band Mix"),
            mapOf<String, Any>("id" to "2", "name" to "Jazz Ensemble")
        )
        
        return ResponseEntity(projects, HttpStatus.OK)
    }
    
    // 프로젝트 업데이트
    @PutMapping("/{id}")
    fun updateProject(@PathVariable id: String, @RequestBody updates: Map<String, Any>): ResponseEntity<Map<String, Any>> {
        // 프로젝트 업데이트 로직
        val updatedProject = mapOf<String, Any>(
            "id" to id,
            "name" to (updates["name"] ?: "Untitled Project"),
            "updated" to true
        )
        
        return ResponseEntity(updatedProject, HttpStatus.OK)
    }
    
    // 프로젝트 삭제
    @DeleteMapping("/{id}")
    fun deleteProject(@PathVariable id: String): ResponseEntity<Map<String, String>> {
        // 프로젝트 삭제 로직
        
        return ResponseEntity(
            mapOf("message" to "프로젝트가 성공적으로 삭제되었습니다", "id" to id),
            HttpStatus.OK
        )
    }
}
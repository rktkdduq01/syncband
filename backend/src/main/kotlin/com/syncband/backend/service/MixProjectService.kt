package com.syncband.backend.service

import com.syncband.backend.exception.ResourceNotFoundException
import com.syncband.backend.model.MixProject
import com.syncband.backend.repository.MixProjectRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class MixProjectService(
    private val mixProjectRepository: MixProjectRepository
) {
    // 새 프로젝트 생성
    fun createProject(name: String, description: String?, userId: Long): MixProject {
        val project = MixProject(
            name = name,
            description = description,
            userId = userId,
            bpm = 120,
            isPublic = false
        )
        
        return mixProjectRepository.save(project)
    }
    
    // 프로젝트 조회
    fun getProject(id: Long): MixProject {
        return mixProjectRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("ID가 ${id}인 프로젝트를 찾을 수 없습니다") }
    }
    
    // 사용자의 모든 프로젝트 조회
    fun getUserProjects(userId: Long): List<MixProject> {
        return mixProjectRepository.findByUserId(userId)
    }
    
    // 프로젝트 업데이트
    fun updateProject(id: Long, name: String?, description: String?, bpm: Int?, isPublic: Boolean?): MixProject {
        val project = getProject(id)
        
        name?.let { project.name = it }
        description?.let { project.description = it }
        bpm?.let { project.bpm = it }
        isPublic?.let { project.isPublic = it }
        project.updatedAt = LocalDateTime.now()
        
        return mixProjectRepository.save(project)
    }
    
    // 프로젝트 삭제
    fun deleteProject(id: Long) {
        val project = getProject(id)
        mixProjectRepository.delete(project)
    }
    
    // 공개 프로젝트 조회
    fun getPublicProjects(): List<MixProject> {
        return mixProjectRepository.findByIsPublicTrue()
    }
    
    // 최근 업데이트된 프로젝트 조회
    fun getRecentProjects(userId: Long): List<MixProject> {
        return mixProjectRepository.findTop10ByUserIdOrderByUpdatedAtDesc(userId)
    }
}
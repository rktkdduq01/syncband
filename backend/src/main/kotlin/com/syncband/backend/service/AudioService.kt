package com.syncband.backend.service

import com.syncband.backend.exception.FileProcessingException
import com.syncband.backend.exception.ResourceNotFoundException
import com.syncband.backend.model.AudioTrack
import com.syncband.backend.model.MixProject
import com.syncband.backend.repository.AudioTrackRepository
import com.syncband.backend.repository.MixProjectRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.time.LocalDateTime
import java.util.UUID

@Service
class AudioService(
    private val audioTrackRepository: AudioTrackRepository,
    private val mixProjectRepository: MixProjectRepository
) {
    
    @Value("\${file.upload-dir:uploads/audio}")
    private val uploadDir: String = "uploads/audio"
    
    // 오디오 파일 업로드
    fun uploadAudio(file: MultipartFile, projectId: Long): AudioTrack {
        try {
            // 프로젝트 조회
            val project = mixProjectRepository.findById(projectId)
                .orElseThrow { ResourceNotFoundException("ID가 ${projectId}인 프로젝트를 찾을 수 없습니다") }
                
            // 디렉토리 생성
            val directory = File(uploadDir)
            if (!directory.exists()) {
                directory.mkdirs()
            }
            
            // 파일명 생성 (중복 방지를 위해 UUID 사용)
            val filename = UUID.randomUUID().toString() + "_" + file.originalFilename?.replace("\\s+".toRegex(), "_")
            val targetPath = Paths.get(uploadDir, filename)
            
            // 파일 저장
            Files.copy(file.inputStream, targetPath)
            
            // 오디오 트랙 엔티티 생성 및 저장
            val audioTrack = AudioTrack(
                name = file.originalFilename ?: "Unknown",
                filePath = targetPath.toString(),
                fileSize = file.size,
                project = project
            )
            
            return audioTrackRepository.save(audioTrack)
        } catch (e: IOException) {
            throw FileProcessingException("오디오 파일 저장 중 오류가 발생했습니다: ${e.message}", e)
        }
    }
    
    // 오디오 트랙 조회
    fun getAudioTrack(id: Long): AudioTrack {
        return audioTrackRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("ID가 ${id}인 오디오 트랙을 찾을 수 없습니다") }
    }
    
    // 프로젝트의 모든 오디오 트랙 조회
    fun getAudioTracksByProject(projectId: Long): List<AudioTrack> {
        return audioTrackRepository.findByProjectId(projectId)
    }
    
    // 오디오 트랙 삭제
    fun deleteAudioTrack(id: Long) {
        val audioTrack = getAudioTrack(id)
        
        // 파일 시스템에서 파일 삭제
        try {
            val file = Path.of(audioTrack.filePath)
            Files.deleteIfExists(file)
        } catch (e: IOException) {
            throw FileProcessingException("오디오 파일 삭제 중 오류가 발생했습니다: ${e.message}", e)
        }
        
        // 데이터베이스에서 레코드 삭제
        audioTrackRepository.delete(audioTrack)
    }
    
    // 오디오 트랙 업데이트
    fun updateAudioTrack(id: Long, name: String?, volume: Float?, muted: Boolean?): AudioTrack {
        val audioTrack = getAudioTrack(id)
        
        name?.let { audioTrack.name = it }
        volume?.let { audioTrack.volume = it }
        muted?.let { audioTrack.muted = it }
        audioTrack.updatedAt = LocalDateTime.now()
        
        return audioTrackRepository.save(audioTrack)
    }
}
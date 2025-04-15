package com.syncband.backend.service

import com.syncband.backend.dto.MixingRequest
import com.syncband.backend.dto.MixingResponse
import com.syncband.backend.exception.ResourceNotFoundException
import com.syncband.backend.model.User
import com.syncband.backend.repository.TrackRepository
import com.syncband.backend.repository.UserRepository
import com.syncband.backend.util.AudioUtils
import com.syncband.backend.util.AudioMetadata
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.File
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.UUID

@Service
class MixingService(
    private val trackRepository: TrackRepository,
    private val userRepository: UserRepository
) {
    private val logger = LoggerFactory.getLogger(MixingService::class.java)
    private val mixingDir: Path = Paths.get("uploads/mixes")

    init {
        // 믹싱 결과물 저장 디렉토리 생성
        Files.createDirectories(mixingDir)
    }

    /**
     * 여러 트랙을 믹싱하여 하나의 트랙으로 만들기
     */
    @Transactional
    fun mixTracks(userId: Long, request: MixingRequest): MixingResponse {
        logger.info("트랙 믹싱 시작: 사용자 ID=$userId, 트랙 개수=${request.trackSettings.size}")
        
        // 사용자 정보 조회
        val user = userRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("User not found with id: $userId") }
        
        // 트랙 ID 목록 추출
        val trackIds = request.trackSettings.map { it.trackId }
        
        // 트랙 파일 가져오기
        val trackFiles = trackIds.map { trackId ->
            val track = trackRepository.findById(trackId)
                .orElseThrow { ResourceNotFoundException("Track not found with id: $trackId") }
            
            // 파일 URL에서 파일 이름 추출
            val fileName = track.fileUrl.substringAfterLast("/")
            val trackPath = Paths.get("uploads/tracks/$fileName").toFile()
            
            if (!trackPath.exists()) {
                throw ResourceNotFoundException("Track file not found: $fileName")
            }
            
            trackPath
        }
        
        // 믹싱 결과물 파일 생성
        val timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"))
        val outputFileName = "${UUID.randomUUID()}_mix_${timestamp}.wav"
        val outputFile = mixingDir.resolve(outputFileName).toFile()
        
        // 트랙 믹싱 및 볼륨 조절
        mixTracksWithVolumeAdjustment(trackFiles, request.trackSettings.map { it.volume }, outputFile)
        
        // 메타데이터 추출
        val metadata = AudioUtils.extractAudioMetadata(outputFile)
        
        return MixingResponse(
            mixId = UUID.randomUUID().toString(),
            fileUrl = "/api/mixes/files/$outputFileName",
            fileName = outputFileName,
            createdAt = LocalDateTime.now(),
            duration = metadata.duration,
            sampleRate = metadata.sampleRate,
            channels = metadata.channels,
            trackCount = trackIds.size
        )
    }
    
    /**
     * 여러 트랙을 순차적으로 믹싱하고 각 트랙의 볼륨 조절
     */
    private fun mixTracksWithVolumeAdjustment(
        trackFiles: List<File>,
        volumes: List<Double>,
        outputFile: File
    ) {
        if (trackFiles.isEmpty()) {
            throw IllegalArgumentException("믹싱할 트랙이 없습니다")
        }
        
        // 첫 번째 트랙의 볼륨 조절
        val firstTrackWithVolume = adjustVolumeForTrack(trackFiles[0], volumes[0])
        
        if (trackFiles.size == 1) {
            // 트랙이 하나면 볼륨 조절만 하고 종료
            firstTrackWithVolume.copyTo(outputFile, overwrite = true)
            firstTrackWithVolume.delete() // 임시 파일 삭제
            return
        }
        
        // 첫 번째 트랙으로 믹스 초기화
        var currentMix = firstTrackWithVolume
        
        // 나머지 트랙들 믹싱
        for (i in 1 until trackFiles.size) {
            val volumeAdjustedTrack = adjustVolumeForTrack(trackFiles[i], volumes[i])
            
            // 임시 믹싱 파일
            val tempMixFile = File.createTempFile("temp_mix_", ".wav")
            
            // 현재 믹스와 새 트랙 믹싱
            AudioUtils.mixAudioTracks(currentMix, volumeAdjustedTrack, tempMixFile)
            
            // 임시 파일들 정리
            currentMix.delete()
            volumeAdjustedTrack.delete()
            
            // 현재 믹스 업데이트
            currentMix = tempMixFile
        }
        
        // 최종 결과물 복사
        currentMix.copyTo(outputFile, overwrite = true)
        currentMix.delete() // 마지막 임시 파일 삭제
    }
    
    /**
     * 트랙의 볼륨 조절
     */
    private fun adjustVolumeForTrack(trackFile: File, volume: Double): File {
        val tempFile = File.createTempFile("volume_adjusted_", ".wav")
        return AudioUtils.adjustVolume(trackFile, tempFile, volume)
    }
    
    /**
     * 믹싱 결과 파일 가져오기
     */
    fun getMixFile(fileName: String): File {
        val file = mixingDir.resolve(fileName).toFile()
        if (!file.exists()) {
            throw ResourceNotFoundException("Mix file not found: $fileName")
        }
        return file
    }
}
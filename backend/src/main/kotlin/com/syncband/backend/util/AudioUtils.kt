package com.syncband.backend.util

import org.slf4j.LoggerFactory
import java.io.ByteArrayInputStream
import java.io.File
import java.nio.ByteBuffer
import java.nio.ByteOrder
import javax.sound.sampled.AudioFileFormat
import javax.sound.sampled.AudioFormat
import javax.sound.sampled.AudioInputStream
import javax.sound.sampled.AudioSystem

/**
 * 오디오 데이터 처리 유틸리티 클래스
 */
object AudioUtils {
    private val logger = LoggerFactory.getLogger(AudioUtils::class.java)
    
    /**
     * 오디오 파일의 메타데이터를 추출
     */
    fun extractAudioMetadata(file: File): AudioMetadata {
        try {
            val audioFile = AudioSystem.getAudioFileFormat(file)
            val format = audioFile.format
            val frameLength = AudioSystem.getAudioFileFormat(file).frameLength
            val durationInSeconds = frameLength / format.frameRate
            
            return AudioMetadata(
                sampleRate = format.sampleRate,
                channels = format.channels,
                bitsPerSample = format.sampleSizeInBits,
                duration = durationInSeconds,
                encoding = format.encoding.toString(),
                fileType = audioFile.type.toString(),
                frameSize = format.frameSize,
                frameRate = format.frameRate,
                bigEndian = format.isBigEndian
            )
        } catch (e: Exception) {
            logger.error("오디오 메타데이터 추출 중 오류 발생", e)
            throw IllegalArgumentException("지원되지 않는 오디오 형식입니다: ${e.message}")
        }
    }
    
    /**
     * 두 오디오 트랙 믹싱
     */
    fun mixAudioTracks(track1: File, track2: File, outputFile: File): File {
        try {
            val audioIn1 = AudioSystem.getAudioInputStream(track1)
            val audioIn2 = AudioSystem.getAudioInputStream(track2)
            
            // 두 트랙 형식이 동일한지 확인
            if (audioIn1.format != audioIn2.format) {
                throw IllegalArgumentException("두 트랙의 오디오 형식이 일치해야 합니다")
            }
            
            val format = audioIn1.format
            val mixedByteArray = mixRawAudio(audioIn1, audioIn2, format)
            
            // 결과를 저장
            val mixedStream = AudioInputStream(
                ByteArrayInputStream(mixedByteArray),
                format,
                mixedByteArray.size.toLong() / format.frameSize
            )
            
            AudioSystem.write(mixedStream, AudioFileFormat.Type.WAVE, outputFile)
            
            audioIn1.close()
            audioIn2.close()
            mixedStream.close()
            
            return outputFile
        } catch (e: Exception) {
            logger.error("오디오 믹싱 중 오류 발생", e)
            throw RuntimeException("오디오 믹싱에 실패했습니다: ${e.message}")
        }
    }
    
    /**
     * 로우 오디오 데이터 믹싱
     */
    private fun mixRawAudio(audioIn1: AudioInputStream, audioIn2: AudioInputStream, format: AudioFormat): ByteArray {
        val bytesPerFrame = format.frameSize
        val buffer1 = ByteArray(bytesPerFrame)
        val buffer2 = ByteArray(bytesPerFrame)
        val output = mutableListOf<Byte>()
        
        val byteOrder = if (format.isBigEndian) ByteOrder.BIG_ENDIAN else ByteOrder.LITTLE_ENDIAN
        
        while (true) {
            val bytesRead1 = audioIn1.read(buffer1, 0, bytesPerFrame)
            val bytesRead2 = audioIn2.read(buffer2, 0, bytesPerFrame)
            
            if (bytesRead1 < 0 && bytesRead2 < 0) break
            
            // 한 트랙이 끝났으면 다른 트랙을 그대로 복사
            if (bytesRead1 < 0) {
                output.addAll(buffer2.take(bytesRead2))
                continue
            }
            if (bytesRead2 < 0) {
                output.addAll(buffer1.take(bytesRead1))
                continue
            }
            
            // 16비트 PCM 오디오 믹싱 (다른 형식은 필요한 경우 추가)
            if (format.sampleSizeInBits == 16) {
                val mixedBuffer = ByteArray(bytesPerFrame)
                for (i in 0 until bytesPerFrame / 2) {
                    val sample1 = ByteBuffer.wrap(buffer1, i * 2, 2).order(byteOrder).short.toInt()
                    val sample2 = ByteBuffer.wrap(buffer2, i * 2, 2).order(byteOrder).short.toInt()
                    
                    // 두 샘플의 평균 (더 정교한 믹싱 알고리즘 적용 가능)
                    val mixed = ((sample1 + sample2) / 2).toShort()
                    val byteBuffer = ByteBuffer.allocate(2).order(byteOrder).putShort(mixed)
                    
                    mixedBuffer[i * 2] = byteBuffer.get(0)
                    mixedBuffer[i * 2 + 1] = byteBuffer.get(1)
                }
                output.addAll(mixedBuffer.toList())
            }
        }
        
        return output.toByteArray()
    }
    
    /**
     * 오디오 볼륨 조정
     */
    fun adjustVolume(audioFile: File, outputFile: File, volumeFactor: Double): File {
        try {
            val audioIn = AudioSystem.getAudioInputStream(audioFile)
            val format = audioIn.format
            val bytesPerFrame = format.frameSize
            val byteOrder = if (format.isBigEndian) ByteOrder.BIG_ENDIAN else ByteOrder.LITTLE_ENDIAN
            
            val inputBytes = audioIn.readAllBytes()
            val outputBytes = ByteArray(inputBytes.size)
            
            if (format.sampleSizeInBits == 16) {
                for (i in 0 until inputBytes.size / 2) {
                    val sample = ByteBuffer.wrap(inputBytes, i * 2, 2).order(byteOrder).short.toInt()
                    val adjustedSample = (sample * volumeFactor).toInt().coerceIn(Short.MIN_VALUE.toInt(), Short.MAX_VALUE.toInt())
                    val byteBuffer = ByteBuffer.allocate(2).order(byteOrder).putShort(adjustedSample.toShort())
                    
                    outputBytes[i * 2] = byteBuffer.get(0)
                    outputBytes[i * 2 + 1] = byteBuffer.get(1)
                }
            }
            
            val adjustedStream = AudioInputStream(
                ByteArrayInputStream(outputBytes),
                format,
                outputBytes.size.toLong() / bytesPerFrame
            )
            
            AudioSystem.write(adjustedStream, AudioFileFormat.Type.WAVE, outputFile)
            
            audioIn.close()
            adjustedStream.close()
            
            return outputFile
        } catch (e: Exception) {
            logger.error("볼륨 조정 중 오류 발생", e)
            throw RuntimeException("볼륨 조정에 실패했습니다: ${e.message}")
        }
    }
}

/**
 * 오디오 메타데이터 정보를 담는 데이터 클래스
 */
data class AudioMetadata(
    val sampleRate: Float,
    val channels: Int,
    val bitsPerSample: Int,
    val duration: Float,
    val encoding: String,
    val fileType: String,
    val frameSize: Int,
    val frameRate: Float,
    val bigEndian: Boolean
)
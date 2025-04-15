package com.syncband.backend.service

import com.syncband.backend.exception.FileProcessingException
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.util.UUID
import jakarta.annotation.PostConstruct

@Service
class StorageService {
    
    @Value("\${file.storage-dir:uploads}")
    private val storageDir: String = "uploads"
    
    private lateinit var rootLocation: Path
    
    @PostConstruct
    fun init() {
        try {
            rootLocation = Paths.get(storageDir)
            Files.createDirectories(rootLocation)
        } catch (e: IOException) {
            throw FileProcessingException("저장소 초기화 실패", e)
        }
    }
    
    fun store(file: MultipartFile, subdirectory: String = ""): String {
        try {
            if (file.isEmpty) {
                throw FileProcessingException("빈 파일을 저장할 수 없습니다")
            }
            
            val targetDir = if (subdirectory.isNotEmpty()) {
                val subPath = rootLocation.resolve(subdirectory)
                Files.createDirectories(subPath)
                subPath
            } else {
                rootLocation
            }
            
            val filename = UUID.randomUUID().toString() + "_" + 
                           file.originalFilename?.replace("\\s+".toRegex(), "_")
            
            val targetPath = targetDir.resolve(filename)
            
            Files.copy(file.inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING)
            
            return targetPath.toString()
        } catch (e: IOException) {
            throw FileProcessingException("파일 저장 실패", e)
        }
    }
    
    fun load(filename: String, subdirectory: String = ""): Path {
        val targetDir = if (subdirectory.isNotEmpty()) {
            rootLocation.resolve(subdirectory)
        } else {
            rootLocation
        }
        return targetDir.resolve(filename)
    }
    
    fun delete(filepath: String): Boolean {
        try {
            val path = Paths.get(filepath)
            return Files.deleteIfExists(path)
        } catch (e: IOException) {
            throw FileProcessingException("파일 삭제 실패", e)
        }
    }
}
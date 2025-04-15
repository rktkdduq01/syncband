package com.syncband.backend.config

import com.syncband.backend.exception.FileStorageException
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.util.StringUtils
import org.springframework.web.multipart.MultipartFile
import java.io.IOException
import java.net.MalformedURLException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.util.*

@Configuration
class FileStorageConfig {

    @Value("\${file.upload-dir:uploads}")
    private val uploadDir: String = "uploads"

    @Bean
    fun fileStorageService() = FileStorageService(uploadDir)
}

// 빈으로 등록되는 서비스 클래스
class FileStorageService(private val uploadDir: String) {

    private val fileStorageLocation: Path = Paths.get(uploadDir).toAbsolutePath().normalize()

    init {
        try {
            Files.createDirectories(fileStorageLocation)
            // 트랙과 프로필 이미지 디렉토리 생성
            Files.createDirectories(Paths.get("$uploadDir/tracks"))
            Files.createDirectories(Paths.get("$uploadDir/profile-images"))
        } catch (ex: Exception) {
            throw FileStorageException("Could not create the directory where the uploaded files will be stored.", ex)
        }
    }

    /**
     * 파일을 저장하고 생성된 파일명을 반환합니다.
     * 현재는 컨트롤러에서 직접 사용되지 않지만 향후 기능 확장을 위해 준비되었습니다.
     */
    fun storeFile(file: MultipartFile, directory: String): String {
        // 원본 파일명 정리
        val originalFilename = StringUtils.cleanPath(file.originalFilename ?: "unknown_file")

        try {
            // 파일명에 잘못된 문자가 있는지 확인
            if (originalFilename.contains("..")) {
                throw FileStorageException("파일명에 잘못된 경로 문자가 포함되어 있습니다: $originalFilename", ex)
            }

            // 파일 충돌 방지를 위한 UUID 추가
            val fileExtension = originalFilename.substringAfterLast('.', "")
            val uuidFilename = UUID.randomUUID().toString() +
                    (if (fileExtension.isNotEmpty()) ".$fileExtension" else "")

            // 저장 디렉토리 확인
            val targetLocation = when (directory) {
                "tracks" -> Paths.get("$uploadDir/tracks")
                "profile-images" -> Paths.get("$uploadDir/profile-images")
                else -> fileStorageLocation
            }

            // 파일 저장
            val targetPath = targetLocation.resolve(uuidFilename)
            Files.copy(file.inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING)

            return uuidFilename
        } catch (ex: IOException) {
            throw FileStorageException("파일 저장 실패: $originalFilename", ex)
        }
    }

    object ex : IOException() {

    }

    /**
     * 파일명으로 리소스를 로드합니다.
     * 현재는 컨트롤러에서 직접 사용되지 않지만 향후 파일 다운로드 기능 구현에 필요합니다.
     */
    fun loadFileAsResource(fileName: String, directory: String): Resource {
        try {
            val targetDir = when (directory) {
                "tracks" -> Paths.get("$uploadDir/tracks")
                "profile-images" -> Paths.get("$uploadDir/profile-images")
                else -> fileStorageLocation
            }

            val filePath = targetDir.resolve(fileName).normalize()
            val resource = UrlResource(filePath.toUri())

            if (resource.exists()) {
                return resource
            } else {
                throw FileStorageException("파일을 찾을 수 없습니다: $fileName", ex)
            }
        } catch (ex: MalformedURLException) {
            throw FileStorageException("파일을 찾을 수 없습니다: $fileName", ex)
        }
    }
}
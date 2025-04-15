package com.syncband.backend.repository

import com.syncband.backend.model.Tag
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface TagRepository : JpaRepository<Tag, Long> {
    
    // 태그 이름으로 조회
    fun findByName(name: String): Optional<Tag>
    
    // 태그 이름으로 시작하는 태그 조회 (자동완성)
    fun findByNameStartingWithIgnoreCase(prefix: String): List<Tag>
    
    // 인기 태그 목록 (가장 많이 사용된 태그)
    @Query("SELECT t FROM Tag t JOIN t.learningContents lc GROUP BY t ORDER BY COUNT(lc) DESC")
    fun findPopularTags(limit: Int): List<Tag>
    
    // 특정 콘텐츠 ID에 연결된 모든 태그 조회
    @Query("SELECT t FROM Tag t JOIN t.learningContents lc WHERE lc.id = :contentId")
    fun findTagsByContentId(@Param("contentId") contentId: Long): List<Tag>
    
    // 태그 이름에 키워드가 포함된 태그 검색
    fun findByNameContainingIgnoreCase(keyword: String): List<Tag>
}
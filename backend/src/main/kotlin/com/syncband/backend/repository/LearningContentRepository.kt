package com.syncband.backend.repository

import com.syncband.backend.model.ContentType
import com.syncband.backend.model.DifficultyLevel
import com.syncband.backend.model.InstrumentType
import com.syncband.backend.model.LearningContent
import com.syncband.backend.model.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface LearningContentRepository : JpaRepository<LearningContent, Long> {
    
    // 콘텐츠 타입별 조회
    fun findByContentType(contentType: ContentType, pageable: Pageable): Page<LearningContent>
    
    // 특정 악기 타입별 콘텐츠 조회
    fun findByInstrumentType(instrumentType: InstrumentType, pageable: Pageable): Page<LearningContent>
    
    // 난이도별 콘텐츠 조회
    fun findByDifficultyLevel(difficultyLevel: DifficultyLevel, pageable: Pageable): Page<LearningContent>
    
    // 제목이나 설명에 특정 키워드가 포함된 콘텐츠 검색
    @Query("SELECT lc FROM LearningContent lc WHERE LOWER(lc.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(lc.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    fun searchByKeyword(@Param("keyword") keyword: String, pageable: Pageable): Page<LearningContent>
    
    // 특정 태그를 가진 콘텐츠 조회
    @Query("SELECT lc FROM LearningContent lc JOIN lc.tags t WHERE t.name = :tagName")
    fun findByTagName(@Param("tagName") tagName: String, pageable: Pageable): Page<LearningContent>
    
    // 특정 사용자가 작성한 콘텐츠 조회
    fun findByCreator(creator: User, pageable: Pageable): Page<LearningContent>
    
    // 인기 콘텐츠 조회 (조회수 기준)
    fun findAllByOrderByViewCountDesc(pageable: Pageable): Page<LearningContent>
    
    // 인기 콘텐츠 조회 (좋아요 기준)
    fun findAllByOrderByLikeCountDesc(pageable: Pageable): Page<LearningContent>
    
    // 최신 콘텐츠 조회
    fun findAllByOrderByCreatedAtDesc(pageable: Pageable): Page<LearningContent>
}
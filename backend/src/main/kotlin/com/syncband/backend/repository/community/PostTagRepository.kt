package com.syncband.backend.repository.community

import com.syncband.backend.model.community.PostTag
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface PostTagRepository : JpaRepository<PostTag, Long> {
    
    fun findByName(name: String): PostTag?
    
    fun findByNameIn(names: Collection<String>): List<PostTag>
    
    fun existsByName(name: String): Boolean
    
    @Query("SELECT t FROM PostTag t JOIN t.posts p GROUP BY t ORDER BY COUNT(p) DESC")
    fun findTopTags(limit: Int): List<PostTag>
}
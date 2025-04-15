package com.syncband.backend.repository.community

import com.syncband.backend.model.community.Category
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CategoryRepository : JpaRepository<Category, Long> {
    
    fun findByName(name: String): Category?
    
    // @Query 대신 JPA 메서드 이름 규칙으로 변경
    fun findByIsActiveTrueOrderByDisplayOrderAsc(): List<Category>
    
    fun existsByName(name: String): Boolean
}
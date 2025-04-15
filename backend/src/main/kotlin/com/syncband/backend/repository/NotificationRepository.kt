package com.syncband.backend.repository

import com.syncband.backend.model.Notification
import com.syncband.backend.model.User
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface NotificationRepository : JpaRepository<Notification, Long> {
    fun findByUserOrderByCreatedAtDesc(user: User): List<Notification>
    
    fun findByUserAndIsReadOrderByCreatedAtDesc(user: User, isRead: Boolean): List<Notification>
    
    fun findByUserOrderByCreatedAtDesc(user: User, pageable: Pageable): Page<Notification>
    
    fun countByUserAndIsRead(user: User, isRead: Boolean): Long
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user = :user AND n.isRead = false")
    fun markAllAsRead(user: User): Int
    
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.createdAt < :beforeDate")
    fun deleteOldNotifications(beforeDate: LocalDateTime): Int
}
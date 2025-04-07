package grp4.histoapp.services

import grp4.histoapp.domain.entity.HistoCommentEntity

interface HistoCommentService {
    fun getCommentsForImage(sopInstanceUID: String): List<HistoCommentEntity>
    fun addCommentToImage(sopInstanceUID: String, context: String): HistoCommentEntity
    fun updateComment(commentId: Long, newContext: String): HistoCommentEntity
    fun deleteComment(commentId: Long)
    fun getAllCommentsWithImageSopUIDs(): List<Map<String, Any?>>
}
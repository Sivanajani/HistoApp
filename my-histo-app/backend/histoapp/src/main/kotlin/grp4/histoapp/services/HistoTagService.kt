package grp4.histoapp.services

import grp4.histoapp.domain.entity.HistoTagEntity

interface HistoTagService {
    fun createAndAssignTag(tagName: String, sopInstanceUID: String): HistoTagEntity
    fun removeTagFromImage(tagId: Long, sopInstanceUID: String): HistoTagEntity
    fun getTagsForImage(sopInstanceUID: String): List<HistoTagEntity>
    fun getAllTagsWithImageSopUIDs(): List<Map<String, Any>>
}
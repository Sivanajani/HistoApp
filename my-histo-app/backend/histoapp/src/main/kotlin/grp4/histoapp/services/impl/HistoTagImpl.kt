package grp4.histoapp.services.impl

import grp4.histoapp.domain.entity.HistoTagEntity
import grp4.histoapp.repositories.HistoOrthancRepository
import grp4.histoapp.repositories.HistotagRepository
import grp4.histoapp.services.HistoTagService
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Transactional
@Service
class HistoTagImpl(
    private val histoTagRepository: HistotagRepository,
    private val histoOrthancRepository: HistoOrthancRepository
) : HistoTagService {


    override fun createAndAssignTag(tagName: String, sopInstanceUID: String): HistoTagEntity {
        val image =
            histoOrthancRepository.findByMainDicomTag_SopInstanceUid(sopInstanceUID)//findByMainDicomTag_SopInstanceUid hilft uns aus dem Rep. um die sopuid zufinden
                ?: throw Exception("Image not found")

        val existingTag =
            histoTagRepository.findByName(tagName) //Wenn es genau gleich geschrieben = gleiches Tag -> kann man ausbauen je nach Wunsch

        if (existingTag != null) {
            if (existingTag.images.contains(image)) {
                throw Exception("Tag with this name already assigned to this image.")
            } else {
                existingTag.images.add(image)
                return histoTagRepository.save(existingTag)
            }
        }

        val newTag = HistoTagEntity(
            id = 0,
            name = tagName,
            //date = LocalDate.now(),
            images = mutableListOf(image)
        )
        // println("TAG ERSTELLT" )
        return histoTagRepository.save(newTag)
    }

    //Tag weg
    override fun removeTagFromImage(tagId: Long, sopInstanceUID: String): HistoTagEntity {
        val tag = histoTagRepository.findById(tagId).orElseThrow { Exception("Tag not found") }
        val image = histoOrthancRepository.findByMainDicomTag_SopInstanceUid(sopInstanceUID)

        if (!tag.images.contains(image)) {
            throw Exception("Tag is not assigned to this image.")
        }

        tag.images.remove(image)
        return histoTagRepository.save(tag)
    }

    //Die Tags zu dem Image finden, manytoone-verknüpfung -> tags
    override fun getTagsForImage(sopInstanceUID: String): List<HistoTagEntity> {
        val image = histoOrthancRepository.findByMainDicomTag_SopInstanceUid(sopInstanceUID)
            ?: throw Exception("Image not found")
        //println("TAGS GEFUNDEN")
        return image.tags
    }

    //Zum Filtern brauchen wir die dazugehörigen images ->sprich die sopuids -> alle zu dem Tag
    override fun getAllTagsWithImageSopUIDs(): List<Map<String, Any>> {
        return histoTagRepository.findAll().map { tag ->
            mapOf(
                "id" to tag.id,
                "name" to tag.name,
                "images" to tag.images.mapNotNull { it.mainDicomTag.sopInstanceUid }
            )
        }
    }

}


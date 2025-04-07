package grp4.histoapp.services.impl


import grp4.histoapp.domain.entity.HistoCommentEntity
import grp4.histoapp.repositories.HistoCommentRepository
import grp4.histoapp.repositories.HistoOrthancRepository
import grp4.histoapp.services.HistoCommentService
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

// Sehr ähnlich wie Tag -> viel da Rauskopiert hehe
@Transactional
@Service
class HistoCommentImpl(
    private val histoCommentRepository: HistoCommentRepository,
    private val histoOrthancRepository: HistoOrthancRepository
) : HistoCommentService {

    override fun getCommentsForImage(sopInstanceUID: String): List<HistoCommentEntity> {
        val image = histoOrthancRepository.findByMainDicomTag_SopInstanceUid(sopInstanceUID)
            ?: throw Exception("Image not found")
        return image.comments
    }

    override fun addCommentToImage(sopInstanceUID: String, context: String): HistoCommentEntity {
        val image = histoOrthancRepository.findByMainDicomTag_SopInstanceUid(sopInstanceUID)
            ?: throw Exception("Image not found")

        val comment = HistoCommentEntity(id = 0, context = context, imagesk = image)
        image.comments.add(comment)
        return histoCommentRepository.save(comment)
    }

    override fun updateComment(commentId: Long, newContext: String): HistoCommentEntity {
        val comment = histoCommentRepository.findById(commentId).orElseThrow { Exception("Comment not found") }
        val updatedComment = comment.copy(context = newContext)
        return histoCommentRepository.save(updatedComment)
    }

    override fun deleteComment(commentId: Long) {
        if (!histoCommentRepository.existsById(commentId)) {
            throw Exception("Comment not found")
        }
        histoCommentRepository.deleteById(commentId)
    }

    override fun getAllCommentsWithImageSopUIDs(): List<Map<String, Any?>> {
        return histoCommentRepository.findAll().map { comment ->
            mapOf(
                "id" to comment.id,
                "context" to comment.context,
                "sopInstanceUID" to comment.imagesk?.mainDicomTag?.sopInstanceUid
            )
        }
    }

}




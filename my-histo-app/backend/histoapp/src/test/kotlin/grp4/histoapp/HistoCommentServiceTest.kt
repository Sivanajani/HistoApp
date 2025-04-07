package grp4.histoapp.services

import grp4.histoapp.domain.entity.HistoCommentEntity
import grp4.histoapp.repositories.HistoCommentRepository
import grp4.histoapp.repositories.HistoOrthancRepository
import grp4.histoapp.services.impl.HistoCommentImpl
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.Mockito.*

class HistoCommentServiceTest {

    private val histoCommentRepository: HistoCommentRepository = mock(HistoCommentRepository::class.java)
    private val histoOrthancRepository: HistoOrthancRepository = mock(HistoOrthancRepository::class.java)
    private val histoCommentService = HistoCommentImpl(histoCommentRepository, histoOrthancRepository)

    @Test
    fun `should update comment successfully`() {

        val commentId = 1L //L wird benötigt für Long int wäre nur 1
        val oldComment = "comment1"
        val newComment = "comment2"

        val existingComment = HistoCommentEntity(
            id = commentId,
            context = oldComment,
            imagesk = null
        )
        //Funktuon dazu
        val updatedComment = existingComment.copy(context = newComment)

        `when`(histoCommentRepository.findById(commentId)).thenReturn(java.util.Optional.of(existingComment))
        `when`(histoCommentRepository.save(updatedComment)).thenReturn(updatedComment)

        //Comment wird geupdated "simuleirt"
        val result = histoCommentService.updateComment(commentId, newComment)

        // Wie sieht das Resultat aus?
        assertEquals(newComment, result.context)
        verify(histoCommentRepository).findById(commentId)
        verify(histoCommentRepository).save(updatedComment)
    }
}
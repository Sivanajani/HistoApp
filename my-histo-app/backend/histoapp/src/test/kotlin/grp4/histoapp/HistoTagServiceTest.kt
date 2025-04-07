package grp4.histoapp.services

import grp4.histoapp.domain.entity.HistoOrthancEntity
import grp4.histoapp.domain.entity.HistoTagEntity
import grp4.histoapp.domain.entity.MainDicomTagsEntity
import grp4.histoapp.repositories.HistoOrthancRepository
import grp4.histoapp.repositories.HistotagRepository
import grp4.histoapp.services.impl.HistoTagImpl
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`

class HistoTagServiceTest {

    private val histoTagRepository: HistotagRepository =
        mock(HistotagRepository::class.java) //mock fake klasse wie kopie von
    private val histoOrthancRepository: HistoOrthancRepository = mock(HistoOrthancRepository::class.java)
    private val histoTagService = HistoTagImpl(histoTagRepository, histoOrthancRepository)

    @Test
    fun `same tag same image`() {

        val sopInstanceUID = "1.2.826.0.1.3680043.8.498.55976593423668567562176185402651537062"
        val tagName = "TestTag"

        val mockImage = HistoOrthancEntity(
            fileSize = 12345,
            fileUuid = "1",
            id = "1",
            indexInSeries = 1,
            mainDicomTag = MainDicomTagsEntity(
                imageComments = "Comment1",
                instanceNumber = "1",
                sopInstanceUid = sopInstanceUID
            ),
            parentSeries = "1",
            type = "1"
        )

        val mockTag = HistoTagEntity(
            id = 1,
            name = tagName,
            images = mutableListOf(mockImage)
        )

        `when`(histoOrthancRepository.findByMainDicomTag_SopInstanceUid(sopInstanceUID)).thenReturn(mockImage)
        `when`(histoTagRepository.findByName(tagName)).thenReturn(mockTag)

        val exception = assertThrows(Exception::class.java) {
            histoTagService.createAndAssignTag(tagName, sopInstanceUID)
        }

        assert(exception.message == "Tag with this name already assigned to this image.")
    }
}
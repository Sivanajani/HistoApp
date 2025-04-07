package grp4.histoapp.services.impl

import grp4.histoapp.repositories.MetaDataRepository
import grp4.histoapp.services.MetaDataService
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Transactional
@Service
class MetaDataImpl(private val histoImageRepository: MetaDataRepository) : MetaDataService {
    /* Waren so die Anfangsschritte, als es noch HistoImage geheissen hat :)
    private val username = "orthanc"
    private val password = "orthanc"
    private val restTemplate = RestTemplate()
    private val orthancBaseUrl = "https://v000564.fhnw.ch/orthanc"

    override fun create(metaDataEntity: MetaDataEntity): MetaDataEntity {
        return histoImageRepository.save(metaDataEntity)
    }

    override fun list(): List<MetaDataEntity> {
        return histoImageRepository.findAll()
    }

    override fun get(id: Long): MetaDataEntity? {
        return histoImageRepository.findByIdOrNull(id)
    }

    override fun getDescr(id: Long, description: String?): String? {
        TODO("Not yet implemented")
    }

    override fun getMetadata(sopInstanceUID: String): MetaDataEntity {
        TODO("Not yet implemented")
    }

*/
}

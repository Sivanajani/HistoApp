package grp4.histoapp.services.impl

import grp4.histoapp.repositories.HistoOrthancRepository
import grp4.histoapp.services.HistoOrthancService
import jakarta.transaction.Transactional
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder

//Das hier (die Klasse) war wieder viel und schlimm
@Transactional
@Service
class HistoOrthancImpl(private val histoOrthancRepository: HistoOrthancRepository) : HistoOrthancService {
    private val username = "orthanc"
    private val password = "orthanc"
    private val restTemplate = RestTemplate()
    private val orthancBaseUrl = "https://v000564.fhnw.ch/orthanc" //"http://localhost:8042"

    //Description -> Rep. Funktion sucht mit der SOPUID
    override fun getDescr(sopInstanceUID: String): String? {
        val entity = histoOrthancRepository.findByMainDicomTag_SopInstanceUid(sopInstanceUID)
        return entity?.metaData?.getDescription()
    }

    //1x BIlD!
    override fun getIm(sopInstanceUID: String): String? {
        //header wird definiert
        // authorisierung mit passwort und usernamen für orrthanc -> sonst 401 Fehler
        val headers = org.springframework.http.HttpHeaders().apply {
            setBasicAuth(username, password)
            accept = listOf(MediaType.APPLICATION_JSON)
        }
        val entity = HttpEntity<String>(headers)
        //URI wird hier "zusammengebaut" -> build und toUriString verwandelt es in einen String
        val uriInstances = UriComponentsBuilder.fromHttpUrl("$orthancBaseUrl/instances?expand")
            .build()
            .toUriString()
        // Führt die Anfrage aus -> Map ist String : any => speichert also so wie es kommt (wie JSON z.B.)
        val responseInstances = restTemplate.exchange(uriInstances, HttpMethod.GET, entity, List::class.java)
        //die verschiedenen DicomTags werden hier aufgenommen
        val instances = responseInstances.body as? List<Map<String, Any>>

        val orthancID = instances?.find {
            val dicomtags = it["MainDicomTags"] as? Map<*, *>
            dicomtags?.get("SOPInstanceUID") == sopInstanceUID
        }?.get("ID") as? String
        val uriImages = UriComponentsBuilder.fromHttpUrl("$orthancBaseUrl/instances/$orthancID/rendered")
            .build()
            .toUriString()
        val imageHeaders = org.springframework.http.HttpHeaders().apply {
            setBasicAuth(username, password)
            accept = listOf(MediaType.IMAGE_JPEG, MediaType.IMAGE_PNG)
        }
        val imageEntity = HttpEntity<String>(imageHeaders)
        /* val imageResponse: ResponseEntity<ByteArray> =
             restTemplate.exchange(uriImages, HttpMethod.GET, imageEntity, ByteArray::class.java) Hatten wir für die Bilder gebraucht als ByteArray -> Umgestellt auf Link*/
        return "/instances/$orthancID/rendered"
    }


    // GIBT ALLE IDs zurück aus dem Orthanc -> wäre auch möglich aus DB, jedoch kann können im Orthanc mehr Bilder sein als die DB hat (sollte aber nicht)
    override fun getAllSOPUIDs(): List<String>? {
        val uri = UriComponentsBuilder
            .fromHttpUrl("$orthancBaseUrl/instances")
            .queryParam("expand", true)
            .build()
            .toUriString()

        return try {
            val headers = org.springframework.http.HttpHeaders().apply {
                setBasicAuth(username, password)
                accept = listOf(MediaType.APPLICATION_JSON)
            }
            val entity = HttpEntity<String>(headers)
            val response: ResponseEntity<List<*>> = restTemplate.exchange(uri, HttpMethod.GET, entity, List::class.java)
            val instances = response.body as? List<Map<String, Any>>
            instances?.mapNotNull {
                val dicomTags = it["MainDicomTags"] as? Map<*, *>
                dicomTags?.get("SOPInstanceUID") as? String
            }

        } catch (e: Exception) {
            println("Fehler: ${e.message}")
            null
        }
    }

    // GIBT ALLE BILDer zurück
    override fun getAllImages(sopInstanceUID: List<String>): List<String> {
        val headers = org.springframework.http.HttpHeaders().apply {
            setBasicAuth(username, password)
            accept = listOf(MediaType.APPLICATION_JSON)
        }
        val entity = HttpEntity<String>(headers)

        val uriInstances = UriComponentsBuilder.fromHttpUrl("$orthancBaseUrl/instances?expand")
            .build()
            .toUriString()

        val responseInstances = restTemplate.exchange(uriInstances, HttpMethod.GET, entity, List::class.java)
        val instances = responseInstances.body as? List<Map<String, Any>> ?: return emptyList()


        val sopUIDtoID = instances.mapNotNull { instanceData ->
            val id = instanceData["ID"] as? String
            val mainDicomTags = instanceData["MainDicomTags"] as? Map<*, *>
            val sopUID = mainDicomTags?.get("SOPInstanceUID") as? String
            if (sopUID in sopInstanceUID) sopUID to id else null
        }.toMap()

        return sopInstanceUID.mapNotNull { sopUID ->
            sopUIDtoID[sopUID]?.let { orthancId ->
                "/instances/$orthancId/preview" //preview -> schnelleres Laden (haben wir uns zumindest erhofft)
            }
        }
    }

    //LABELS FÜR FRONTEND
    override fun getLabelsMetaData(sopInstanceUIDs: List<String>): List<Long?> {
        return histoOrthancRepository.findAll()
            .filter { it.mainDicomTag.sopInstanceUid in sopInstanceUIDs }
            .map { it.metaData?.getLabel() }
    }


}
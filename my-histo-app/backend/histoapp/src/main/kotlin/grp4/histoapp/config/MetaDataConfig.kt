package grp4.histoapp.config

import grp4.histoapp.domain.entity.HistoOrthancEntity
import grp4.histoapp.domain.entity.MainDicomTagsEntity
import grp4.histoapp.domain.entity.MetaDataEntity
import grp4.histoapp.repositories.HistoOrthancRepository
import grp4.histoapp.repositories.MetaDataRepository
import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate
import org.w3c.dom.Element
import java.io.FileNotFoundException
import java.io.InputStream
import javax.xml.parsers.DocumentBuilderFactory

//Das war schlimm einer der schlimmsten Sachen -> bitte nicht ändern
@Configuration // Wird geladen wenn spring boot startet -> Orthanc muss vorher schon an sein -> sonst keine Orthanc Daten -> Lessons learned 🐊
class MetaDataConfig(
    private val metaDataRepository: MetaDataRepository,
    private val histoOrthancRepository: HistoOrthancRepository
) {
    private val username = "orthanc"
    private val password = "orthanc"
    private val restTemplate = RestTemplate()

    @Bean //-> Spring weiss so ich brauche das hier für Config <3
    fun initializeMetaData() = ApplicationRunner {
        //Sonst finden sich die xmls nicht im .jar für den Server -> Lessons learned
        val allImageMetadataInputStream = javaClass.classLoader.getResourceAsStream("data/allImageMetadata.xml")
            ?: throw FileNotFoundException("allImageMetadata.xml not found in resources")

        val colorsInputStream = javaClass.classLoader.getResourceAsStream("data/colors.xml")
            ?: throw FileNotFoundException("colors.xml not found in resources")

        val allImageMetadata = parseXmlMetaDataFile(allImageMetadataInputStream)
        val colorsData = parseXmlColorFile(colorsInputStream)
        //
        //Mapping
        val filenameToLabelMap = colorsData.associate {
            it["filename"] to it["label"]?.takeIf { it.isNotBlank() }?.toLongOrNull()
        }
        //   println(filenameToLabelMap)
        // print(filenameToLabelMap)
        val orthancInstances = try {
            val uri = "https://v000564.fhnw.ch/orthanc/instances?expand"
            val headers = HttpHeaders().apply {
                setBasicAuth(username, password)
                accept = listOf(MediaType.APPLICATION_JSON)
            }
            val entity = HttpEntity<String>(headers)

            val response = restTemplate.exchange(uri, HttpMethod.GET, entity, List::class.java)
            response.body as? List<Map<String, Any>> ?: emptyList()
        } catch (e: RestClientException) {
            emptyList()
        }
        //MetaDataEntitiy wird erstellt -> und gemapped
        val metaDataEntities = allImageMetadata.map { image ->
            val label = filenameToLabelMap[image["src"]]
            MetaDataEntity(
                src = image["src"],
                description = image["description"],
                originalURL = image["originalURL"],
                magnification = image["magnification"]?.toFloatOrNull() ?: 0f,
                label = label,
                uid = image["uid"]?.toLongOrNull() ?: 0L
            )
        }
        //println(metaDataEntities.toString())
        metaDataRepository.saveAll(metaDataEntities)

        val histoOrthancEntities = mutableListOf<HistoOrthancEntity>()

        orthancInstances.forEach {
            val fileSize = (it["FileSize"] as? Number)?.toLong()
            val fileUuid = it["FileUuid"] as? String ?: ""
            val id = it["ID"] as? String ?: ""
            val indexInSeries = (it["IndexInSeries"] as? Number)?.toLong()
            val parentSeries = it["ParentSeries"] as? String ?: ""
            val type = it["Type"] as? String ?: ""
            val mainDicomTags = it["MainDicomTags"] as? Map<String, String>

            if (fileSize != null && fileUuid != null && id != null && indexInSeries != null &&
                parentSeries != null && type != null && mainDicomTags != null
            ) {
                val mainDicomTagEntity = MainDicomTagsEntity(
                    imageComments = mainDicomTags["ImageComments"] ?: "",
                    instanceNumber = mainDicomTags["InstanceNumber"] ?: "",
                    sopInstanceUid = mainDicomTags["SOPInstanceUID"] ?: ""
                )
                //Da wir mit den uids die InstanceNumber gesetzt haben und nicht Random musste ich leider 0000000000 vornedran tuhen, sonst hat es nicht richtig gemapped
                val matchingMeta = metaDataEntities.find {
                    "0000000000" + it.uid.toString() == mainDicomTagEntity.instanceNumber
                }

                val entity = HistoOrthancEntity(
                    fileSize = fileSize,
                    fileUuid = fileUuid,
                    id = id,
                    indexInSeries = indexInSeries,
                    mainDicomTag = mainDicomTagEntity,
                    parentSeries = parentSeries,
                    type = type,
                    metaData = matchingMeta
                )
                histoOrthancEntities.add(entity)
            }
        }

        histoOrthancRepository.saveAll(histoOrthancEntities)
        println("Metadata FERTIG.")
    }

    // EInlesen XML color
    private fun parseXmlColorFile(inputStream: InputStream): List<Map<String, String>> {
        val document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(inputStream)
        document.documentElement.normalize()

        val nodeList = document.getElementsByTagName("image")
        val result = mutableListOf<Map<String, String>>()

        for (i in 0 until nodeList.length) {
            val node = nodeList.item(i)
            if (node is Element) {
                val map = mutableMapOf<String, String>()
                map["filename"] = node.getElementsByTagName("filename").item(0)?.textContent ?: ""
                map["label"] = node.getElementsByTagName("label").item(0)?.textContent ?: ""
                result.add(map)
            }
        }
        return result
    }

    //EInlesen XML Metadaten
    private fun parseXmlMetaDataFile(inputStream: InputStream): List<Map<String, String>> {
        val document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(inputStream)
        document.documentElement.normalize()

        val nodeList = document.getElementsByTagName("image")
        val result = mutableListOf<Map<String, String>>()

        for (i in 0 until nodeList.length) {
            val node = nodeList.item(i)
            if (node is Element) {
                val map = mutableMapOf<String, String>()
                map["src"] = node.getAttribute("src")
                map["description"] = node.getElementsByTagName("description").item(0)?.textContent ?: ""
                map["originalURL"] = node.getElementsByTagName("originalURL").item(0)?.textContent ?: ""
                map["magnification"] = node.getElementsByTagName("magnification").item(0)?.textContent ?: ""
                map["uid"] = node.getElementsByTagName("uid").item(0)?.textContent ?: ""
                result.add(map)
            }
        }
        return result
    }
}

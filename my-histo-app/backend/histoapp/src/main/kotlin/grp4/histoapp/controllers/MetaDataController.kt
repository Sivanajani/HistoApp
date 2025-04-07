package grp4.histoapp.controllers
/* WURDE NICHT GEBRAUCHT -> Wurde jedoch auskommentiert, da man nie weiss, wann man in einem Projekt einen anderen Pfad wieder einschlägt*/

/*
import grp4.histoapp.domain.entity.MetaDataEntity
import grp4.histoapp.services.MetaDataService
import jakarta.transaction.Transactional
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
//Hier ist es ähnlich wie beim HistoCommentController -> nur neues wird kommentiert
@CrossOrigin(origins = ["https://v000564.fhnw.ch"])
@RestController
@RequestMapping(path = ["/v1/histoimage"])
@Transactional
class MetaDataController(private val metaDataService: MetaDataService) {
    @PostMapping
    fun createHistoImage(@RequestBody metaDataEntity: MetaDataEntity): MetaDataEntity {
        return metaDataService.create(metaDataEntity)
    }
    @GetMapping
    fun getHistoImage(): List<MetaDataEntity> {
        return metaDataService.list()
    }

    /*@GetMapping(path = ["/{id}"])
    fun readHistoImageDes(@PathVariable("id") id: Long, histoDes: String?): ResponseEntity<String> {
        val foundImage = histoImageService.getDescr(id,histoDes)
        return ResponseEntity(foundImage,HttpStatus.OK)
    }*/
    @GetMapping(path = ["/{sopInstanceUID}"])
    fun getHistoImageData(@PathVariable sopInstanceUID: String): ResponseEntity<MetaDataEntity> {
        val histoImage = metaDataService.getMetadata(sopInstanceUID)
        return ResponseEntity.ok(histoImage)
    }
}*/
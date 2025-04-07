package grp4.histoapp.controllers

import grp4.histoapp.domain.entity.HistoTagEntity
import grp4.histoapp.services.HistoTagService
import grp4.histoapp.services.MetaDataService
import jakarta.transaction.Transactional
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

//Hier ist es ähnlich wie beim HistoCommentController -> nur neues wird kommentiert
@CrossOrigin(origins = ["https://v000564.fhnw.ch"])
@RestController
@RequestMapping(path = ["/v1/histotag"])
@Transactional
class HistoTagController(private val histoTagService: HistoTagService, private val metaDataService: MetaDataService) {
    //Tag wird hinzugefügt falls die Angaben vom body nicht leer sind
    @PostMapping("/add")
    fun tagImage(@RequestBody body: Map<String, String>): ResponseEntity<Unit> {
        val name = body["name"]
        val sopInstanceUID = body["sopInstanceUID"]

        if (name == null || sopInstanceUID == null) {
            return ResponseEntity.badRequest().build()
        }

        histoTagService.createAndAssignTag(name, sopInstanceUID)
        return ResponseEntity(HttpStatus.CREATED)
    }

    //Tag und Bild mapping wird gelöscht -> Tag bleibt bestehen in der DB
    @DeleteMapping("/remove/{tagId}/{sopInstanceUID}")
    fun untagImage(
        @PathVariable tagId: Long,
        @PathVariable sopInstanceUID: String
    ): ResponseEntity<Unit> {
        histoTagService.removeTagFromImage(tagId, sopInstanceUID)
        return ResponseEntity(HttpStatus.NO_CONTENT)
    }

    //Tags werden für das Image geholt (DB) -> sopuid des Images
    @GetMapping("/tagsforimage/{sopInstanceUID}")
    fun getTagsForImage(@PathVariable sopInstanceUID: String): List<HistoTagEntity> {
        return histoTagService.getTagsForImage(sopInstanceUID)
    }

    //Nachträglich fürs frontend leichter zu filtern nach Tags -> hier werden die Tags mitgegeben mit den SOPUIDS der Bilder, falls sie eine Verbindung haben
    @GetMapping("/alltags")
    fun getAllTagsWithImages(): ResponseEntity<List<Map<String, Any>>> {
        val tags = histoTagService.getAllTagsWithImageSopUIDs()
        return ResponseEntity.ok(tags)
    }

}

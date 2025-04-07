package grp4.histoapp.controllers

import grp4.histoapp.services.HistoOrthancService
import jakarta.transaction.Transactional
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

//Hier ist es ähnlich wie beim HistoCommentController -> nur neues wird kommentiert
@CrossOrigin(origins = ["https://v000564.fhnw.ch"])
@RestController
@RequestMapping(path = ["/v1"])
@Transactional
class HistoOrthancController(private val histoOrthancService: HistoOrthancService) {

    //GET für die sopuids
    @GetMapping("/sopuids")
    fun getAllSOPUIDs(): List<String>? {
        return histoOrthancService.getAllSOPUIDs()
    }

    //Die Liste der SOPuids wird hier eingegben und zurück kommt dann ne Liste
    @PostMapping(
        "/images",
        consumes = [MediaType.APPLICATION_JSON_VALUE],
        produces = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun getImages(@RequestBody sopuids: List<String>): List<String>? {
        return histoOrthancService.getAllImages(sopuids)
    }

    //Holt ein einzelnes Bild -> wichtig für Detailansicht
    @GetMapping("/images/{sopInstanceUID}", produces = [MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE])
    fun getImage(@PathVariable sopInstanceUID: String): String? {
        return histoOrthancService.getIm(sopInstanceUID)
    }

    //Holt die Description aus der Datenbank -> wichtig für Detailansicht
    @GetMapping("/description/{sopInstanceUID}")
    fun getDescription(@PathVariable sopInstanceUID: String): String? {
        return histoOrthancService.getDescr(sopInstanceUID)
    }

    //Nachträglich erstellt fürs Frontend: Labels werden aus der DB dem frontend mit den sopuids mitgegeben -> Filter nach Farbe
    @PostMapping("/colors")
    fun getLabels(@RequestBody sopInstanceUIDs: List<String>): List<Long?> {
        return histoOrthancService.getLabelsMetaData(sopInstanceUIDs)
    }


}
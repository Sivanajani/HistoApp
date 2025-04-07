package grp4.histoapp.controllers

import grp4.histoapp.domain.entity.HistoCommentEntity
import grp4.histoapp.services.HistoCommentService
import jakarta.transaction.Transactional
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@CrossOrigin(origins = ["https://v000564.fhnw.ch"]) //CORS vermeiden so mit dem
@RestController
@RequestMapping("/v1/comments")
@Transactional // keine "überschneidungen"
class HistoCommentController(
    private val histoCommentService: HistoCommentService //Service, um die Methoden/Funktionen aufzurufen
) {
    //Get für ein Bild (sopuid) -> die Kommentare als Liste dazu
    @GetMapping("/{sopInstanceUID}")
    fun getComments(@PathVariable sopInstanceUID: String): ResponseEntity<List<HistoCommentEntity>> {
        val comments = histoCommentService.getCommentsForImage(sopInstanceUID)
        return ResponseEntity.ok(comments)
    }

    //Erstellen von Kommentaren
    @PostMapping("/add/{sopInstanceUID}")
    fun addComment(
        @PathVariable sopInstanceUID: String,
        @RequestBody body: Map<String, String> //Body wird erwartet
    ): ResponseEntity<HistoCommentEntity> //KOmmentarentity wird erstellt(anhand vom body)
    {
        val context = body["context"] ?: throw IllegalArgumentException("Missing 'context'")
        val createdComment = histoCommentService.addCommentToImage(sopInstanceUID, context)
        return ResponseEntity.ok(createdComment)
    }

    // überarbeiten von kommentaren ähnlich wie erstellen, ausser da interessiert uns eher die ID des kommentars
    @PutMapping("/update/{commentId}")
    fun updateComment(
        @PathVariable commentId: Long,
        @RequestBody body: Map<String, String>
    ): ResponseEntity<HistoCommentEntity> {
        val newContext = body["context"] ?: throw IllegalArgumentException("Missing 'context'")
        val updated = histoCommentService.updateComment(commentId, newContext)
        return ResponseEntity.ok(updated)
    }

    // kommentar ->weg
    @DeleteMapping("/remove/{commentId}")
    fun deleteComment(@PathVariable commentId: Long): ResponseEntity<Void> {
        histoCommentService.deleteComment(commentId)
        return ResponseEntity.noContent().build()
    }

    // wurde nachträglich hinzugefügt -> leichter fürs Frontend so die Kommentare den Bildern zuzuorndnen
    @GetMapping("/allcomments")
    fun getAllTagsWithImages(): ResponseEntity<List<Map<String, Any?>>> {
        val comments = histoCommentService.getAllCommentsWithImageSopUIDs()
        return ResponseEntity.ok(comments)
    }
}

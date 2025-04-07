package grp4.histoapp.domain.entity

import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*
import kotlinx.serialization.Serializable

@Entity
@Serializable //Objekt ->JSON und zmgekehrt -> Encode und Decode -> JSON
data class HistoCommentEntity(
    @Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
    )
    val id: Long,
    val context: String?,
//Viele Kommentare zu einem Bild möglich
    @ManyToOne
    @JoinColumn(name = "histoorthanc_id")
    @JsonBackReference //Nur auf eigene Gefahr entfernen -> unendliches zeigen aufeinadner....
    var imagesk: HistoOrthancEntity? = null
)

package grp4.histoapp.domain.entity

import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*
import kotlinx.serialization.Serializable

@Entity
@Serializable
data class HistoTagEntity(
    @Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "histotag_id_seq"
    ) //Sequence würde sowieso automatisch bei AUTO von postgres genutzt werden
    val id: Long,
    //val date: LocalDate, Datum Probiert -> hatte keine Nerven mehr dafür
    val name: String,
    //Viele tags möglich zu vielen bildern -> PERSIST -> Falls neues Tag zu einem Bild, welches noch nicht in OrthancEntitiy ist (kann passieren) wird es trotzdem gespeichert.
    //MERGE -> Wenn Tag update -> Orthancentity auch -> hier weniger wichtig -> ist wohl beim Testen und ausprobieren irgendwann enstanden und wurde behalten :)
    @ManyToMany(cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    @JoinTable(
        name = "histoorthanc_histotag",
        joinColumns = [JoinColumn(name = "histotag_id")],
        inverseJoinColumns = [JoinColumn(name = "histoorthanc_id")]
    )
    @JsonBackReference
    val images: MutableList<HistoOrthancEntity> = mutableListOf()
)

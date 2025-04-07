package grp4.histoapp.domain.entity

import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
@Entity
data class HistoOrthancEntity(
//Die Infos aus Orthanc werden hier gespeichert zum Bild
    @SerialName("FileSize") // kann man so mappen für das was wir dann rauslesen aus Orthanc
    val fileSize: Long,
    @SerialName("FileUuid")
    val fileUuid: String?,

    @SerialName("ID")
    val id: String,
    @SerialName("IndexInSeries")
    val indexInSeries: Long,

    @SerialName("MainDicomTags")
    //Alle sachen die "OrhancInfos" hat, kann auch mainDicomTag -> wird z.B. HistoOrthancEntity gelöscht wird die dazugehörige MainDicomTagsEntity mitgelöscht.
    //da sind die SOPinstanceUIDS drinnen
    @OneToOne(cascade = [CascadeType.ALL])
    val mainDicomTag: MainDicomTagsEntity,

    @SerialName("ParentSeries")
    val parentSeries: String,

    @SerialName("Type")
    val type: String,

    @OneToOne()
    var metaData: MetaDataEntity? = null
) {
    //Wird von DB generiert wird nicht von Konstruktor gesetzt
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var uid: Long? = null

    //wird später befüllt und nicht schon im vorfeld
    @ManyToMany(mappedBy = "images", cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    @JsonManagedReference
    val tags: MutableList<HistoTagEntity> = mutableListOf()

    //hier auch später befüllt -> darum nicht im Konstruktor
    @OneToMany(mappedBy = "imagesk", cascade = [CascadeType.ALL], orphanRemoval = true)
    @JsonManagedReference
    val comments: MutableList<HistoCommentEntity> = mutableListOf()
}
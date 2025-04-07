package grp4.histoapp.domain.entity

import jakarta.persistence.Entity
import jakarta.persistence.Id
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
@Entity
data class MainDicomTagsEntity(
    @SerialName("ImageComments")
    val imageComments: String? = null, //optional -> kann leer sein
    @SerialName("InstanceNumber")
    val instanceNumber: String?,
    @SerialName("SOPInstanceUID")
    @Id
    val sopInstanceUid: String,
)


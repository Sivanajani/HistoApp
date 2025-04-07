package grp4.histoapp.domain.entity

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import kotlinx.serialization.Serializable

@Entity
@Table(name = "MetaData")
@Serializable
//XML-Metadaten hier
class MetaDataEntity(
    private var src: String?,
    private var description: String?,
    private var originalURL: String?,
    private var magnification: Float,
    private var label: Long?,
    @Id
    var uid: Long,

    ) {
    //Funktionen um an die privaten Sachen ranzukommen
    fun getDescription(): String? = description
    fun getLabel(): Long? = label
}

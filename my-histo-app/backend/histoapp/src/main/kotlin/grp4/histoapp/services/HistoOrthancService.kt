package grp4.histoapp.services

//import grp4.histoapp.domain.entity.HistoOrthancEntity

interface HistoOrthancService {
    fun getDescr(sopInstanceUID: String): String?
    fun getIm(sopInstanceUID: String): String?
    fun getAllSOPUIDs(): List<String>?
    fun getAllImages(sopInstanceUID: List<String>): List<String>?
    fun getLabelsMetaData(sopInstanceUIDs: List<String>): List<Long?>

}
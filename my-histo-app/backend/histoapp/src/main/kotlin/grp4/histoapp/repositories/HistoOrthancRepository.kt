package grp4.histoapp.repositories

import grp4.histoapp.domain.entity.HistoOrthancEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface HistoOrthancRepository : JpaRepository<HistoOrthancEntity, Long> {
    //FUNKTIONSNAME GAAANZ WICHTIG -> findBy -> maindicomtag_sopinstanceuid -> sucht die sopuid in HistoOrthancEntity
    fun findByMainDicomTag_SopInstanceUid(sopInstanceUid: String): HistoOrthancEntity?
}
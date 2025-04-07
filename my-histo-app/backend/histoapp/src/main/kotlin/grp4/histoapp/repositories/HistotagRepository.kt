package grp4.histoapp.repositories

import grp4.histoapp.domain.entity.HistoTagEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface HistotagRepository : JpaRepository<HistoTagEntity, Long> {
    //QUERY Würde so aussehen:
    //SELECT * FROM histotag WHERE name = {name};
    fun findByName(name: String): HistoTagEntity?
}
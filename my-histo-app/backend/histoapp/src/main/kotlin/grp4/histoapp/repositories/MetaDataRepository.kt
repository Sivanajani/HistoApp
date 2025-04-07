package grp4.histoapp.repositories

import grp4.histoapp.domain.entity.MetaDataEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MetaDataRepository : JpaRepository<MetaDataEntity, Long> {
}
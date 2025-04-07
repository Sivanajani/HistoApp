package grp4.histoapp.repositories

import grp4.histoapp.domain.entity.HistoCommentEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface HistoCommentRepository : JpaRepository<HistoCommentEntity, Long> {
}
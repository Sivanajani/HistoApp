package grp4.histoapp.services.impl

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

//Versuch fürs loggen
@Service
class SecurityLogService {
    private val logger = LoggerFactory.getLogger("SecurityLogger")

    fun logLogin(username: String) {
        logger.info("Benutzer '$username' hat sich erfolgreich eingeloggt.")
    }

    fun logLogout(username: String) {
        logger.info("Benutzer '$username' hat sich ausgeloggt.")
    }
}

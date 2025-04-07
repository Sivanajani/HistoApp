/*
KeycloakService.ts stellt die zentrale Schnittstelle zur Authentifizierung mit Keycloak bereit.
Funktionen:
- Initialisierung von Keycloak mit Realm-, URL- und Client-Angaben
- Automatischer Login beim Laden der App (login-required)
- Regelmässige Token-Erneuerung im Hintergrund (alle 60 Sekunden)
- Zugriff auf das aktuelle Token oder die Keycloak-Instanz von überall aus

Dieses Modul kapselt die komplette Authentifizierungslogik für die React-Anwendung.
*/
import Keycloak from "keycloak-js";

// Keycloak-Instanz mit Konfigurationsdaten initialisieren
const keycloak = new Keycloak({
  url: "https://v000557.fhnw.ch/",
  realm: "FHNW-LST-MI",
  clientId: "g4-app",
});

// Initialisiert Keycloak und erzwingt Login bei Aufruf
export const initKeycloak = (): Promise<boolean> => {
  return keycloak
    .init({
      onLoad: "login-required", // Benutzer muss eingeloggt sein
      checkLoginIframe: false,
    })
    .then((authenticated) => {
      if (authenticated) {
        // Regelmässige Token-Erneuerung alle 60 Sekunden
        setInterval(() => {
          keycloak
            .updateToken(30)
            .catch(() => {
              keycloak.logout({ redirectUri: window.location.origin });
            });
        }, 60000);
      }

      return authenticated;
    });
};

// Gibt das aktuelle Token zurück
export const getToken = (): string | undefined => {
  return keycloak.token;
};

// Gibt die Keycloak-Instanz zurück
export const getKeycloakInstance = () => keycloak;

export default keycloak;

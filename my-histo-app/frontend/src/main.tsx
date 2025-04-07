/*
main.tsx ist der Einstiegspunkt der React-Anwendung im Browser.

Funktionen:
- Initialisiert Keycloak zur Authentifizierung des Benutzers
- Rendert die App nur, wenn die Authentifizierung erfolgreich war
- Verwendet StrictMode für zusätzliche Fehlerprüfungen während der Entwicklung

Bei fehlgeschlagener Authentifizierung wird eine einfache Fehlermeldung angezeigt.
*/
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { initKeycloak } from "./keycloak/KeycloakService";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

// Warten, bis Keycloak initialisiert und Benutzer authentifiziert ist
initKeycloak().then((authenticated) => {
  if (authenticated) {
    // Wenn Authentifizierung erfolgreich war, App rendern
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } else {
    console.error("Authentication failed – App wird nicht geladen");

    // Bei fehlgeschlagener Authentifizierung eine Fehlermeldung anzeigen
    root.render(
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        Zugriff verweigert – bitte neu laden oder wenden Sie sich an den Admin.
      </div>
    );
  }
});

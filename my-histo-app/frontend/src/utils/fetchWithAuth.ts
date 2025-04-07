/*
fetchWithAuth.ts ist ein Hilfsmodul für autorisierte API-Aufrufe.
Funktionen:
- Ergänzt jeden Fetch-Request mit dem aktuellen Bearer-Token von Keycloak
- Ermöglicht geschützte API-Zugriffe ohne wiederholte manuelle Header-Erstellung
- Kann überall im Projekt verwendet werden, um auf gesicherte Endpunkte zuzugreifen

Wird z. B. verwendet für: Bilddaten, Tags, Kommentare, etc.
*/
import keycloak from "../keycloak/KeycloakService";

// Führt einen API-Aufruf mit Authorization-Header (Bearer-Token) aus
export const fetchWithAuth = async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> => {
  const token = keycloak.token;

  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
};

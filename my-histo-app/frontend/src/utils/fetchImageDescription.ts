/*
fetchImageDescription.ts stellt eine Funktion bereit, um die Beschreibung eines DICOM-Bildes vom Backend zu laden.
Funktionen:
- Holt die Beschreibung per API-Call basierend auf der SOPInstanceUID
- Nutzt einen lokalen Cache (Map), um doppelte API-Aufrufe zu vermeiden
- Normalisiert die Rückgabe (entfernt ^-Zeichen, behandelt fehlende oder ungültige Antworten)
- Gibt im Fehlerfall eine sinnvolle Ersatzmeldung zurück

Diese Funktion wird in der Bilddetailansicht und zur Filterung nach Beschreibung verwendet.
*/
import { fetchWithAuth } from "./fetchWithAuth";

// Basis-URL der API
const API_URL = "https://v000564.fhnw.ch/api";

// Lokaler Cache zur Zwischenspeicherung bereits geladener Beschreibungen
const descriptionCache = new Map<string, string>();

// Holt die Beschreibung für ein Bild anhand seiner SOPInstanceUID
export const fetchImageDescription = async (
  sopUid: string
): Promise<string> => {
  // Wenn bereits im Cache, direkt zurückgeben
  if (descriptionCache.has(sopUid)) {
    return descriptionCache.get(sopUid)!;
  }

  try {
    // API-Aufruf mit Authentifizierung
    const response = await fetchWithAuth(
      `${API_URL}/v1/description/${encodeURIComponent(sopUid)}`
    );
    const text = await response.text();

    // Wenn keine Beschreibung vorhanden ist
    if (!text) {
      descriptionCache.set(sopUid, "Keine Beschreibung vorhanden");
      return "Keine Beschreibung vorhanden";
    }

    try {
      // Versuche JSON zu parsen (Standardformat vom DICOM-Backend)
      const data = JSON.parse(text);
      const raw =
        data?.MainDicomTags?.ImageComments ?? "Keine Beschreibung verfügbar";
      const desc = raw.replace(/\^/g, " ").trim();
      descriptionCache.set(sopUid, desc);
      return desc;
    } catch {
      // Fallback: Kein valides JSON, aber evtl. reiner Text mit ^
      const fallback = text.replace(/\^/g, " ").trim();
      descriptionCache.set(sopUid, fallback);
      return fallback;
    }
  } catch (error) {
    // Fehler beim Abrufen – z. B. Netzwerkfehler oder 500er-Fehler
    console.error("Fehler beim Abrufen der Bildbeschreibung:", error);
    descriptionCache.set(sopUid, "Fehler beim Laden");
    return "Fehler beim Laden";
  }
};

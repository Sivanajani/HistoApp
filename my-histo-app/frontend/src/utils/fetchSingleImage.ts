/*
fetchSingleImage.ts enthält eine Funktion zum Laden eines einzelnen Bildpfads vom Backend.
Funktionen:
- Ruft den Pfad (z. B. Base64 oder URL) eines einzelnen DICOM-Bildes anhand seiner UID ab
- Nutzt eine autorisierte Anfrage (fetchWithAuth)
- Gibt den Bildpfad als Text zurück
- Löst bei Fehlern eine Exception aus, die vom aufrufenden Code behandelt werden kann
*/
import { fetchWithAuth } from "./fetchWithAuth";

// Basis-URL der API
const API_URL = "https://v000564.fhnw.ch/api";

// Lädt den Pfad (z. B. base64 oder URL) eines Einzelbildes anhand seiner UID
export const fetchSingleImage = async (uid: string): Promise<string> => {
  const response = await fetchWithAuth(`${API_URL}/v1/images/${uid}`);
  if (!response.ok) throw new Error("Fehler beim Laden des Einzelbilds");
  return await response.text();
};

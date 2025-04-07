# My-Histo-App

Eine webbasierte Anwendung zur Anzeige, Filterung und Verwaltung medizinischer Bilder mit Tagging-, Kommentar- und Download-Funktion.

## Authentifizierung

Die Anwendung nutzt **Keycloak** zur Benutzer-Authentifizierung. Nur eingeloggte Benutzer können auf die App zugreifen.

- Realm: `FHNW-LST-MI`
- Client: `g4-app`
- Login wird beim Start automatisch erzwungen.

## Hauptfunktionen

- **Filtern nach Tags** (inkl. AND/OR-Verknüpfung)
- **Kommentare & Bildbeschreibungen** durchsuchen
- **Farbbasierte Filterung** 
- **ZIP-Download ausgewählter Bilder**
- **Mehrsprachige Oberfläche** (DE / FR / EN)
- **Dark-/Light-Mode** umschaltbar

## Bildanzeige

Bilder werden direkt aus einem DICOM-kompatiblen Backend geladen (`https://v000564.fhnw.ch/orthanc/...`).

### Detailansicht

- Zoom durch Klick auf das Bild
- Tag-Hinzufügung/-Löschung
- Kommentar CRUD (Erstellen, Bearbeiten, Löschen)

## Setup & Start

### Voraussetzungen

- Node.js (empfohlen: ≥ 18)
- Zugriff auf Keycloak + Bild-Backend (PACS-Server: Orthanc)

### Lokale Entwicklung starten

```bash
npm install
npm run dev

# Testprotokoll – My-Histo-App

**Projekt:** MIP  
**Gruppe:** 04  
**Datum:** 03.04.2025  
**Version:** 1  
**Tester:** Mergime Rama und Sivanajani Sivakumar  


## Ziel des Tests

Ziel war die Sicherstellung der **technischen Funktionalität**, **visuellen Korrektheit** und **logischen Konsistenz** von Backend, Datenbank, Serverkommunikation und Frontendfunktionen.

---

## Automatisierte Tests (JUnit)

### 1. **BspTest – Hello LOVE**

| Test-ID | Beschreibung                  | Ergebnis     |
|---------|-------------------------------|--------------|
| T001    | Testet eine einfache Zeichenkette. | ✅ Erfolgreich |

### 2. **HistoappApplicationTests – contextLoads()**

| Test-ID | Beschreibung                  | Ergebnis     |
|---------|-------------------------------|--------------|
| T002    | Prüft, ob der Spring-Kontext geladen werden kann | ✅ Erfolgreich |

### 3. **HistoCommentServiceTest – Kommentar aktualisieren**

| Test-ID | Beschreibung                     | Ergebnis     |
|---------|----------------------------------|--------------|
| T003    | Kommentar per Service aktualisieren und speichern | ✅ Erfolgreich |

### 4. **HistoTagServiceTest – Tag bereits vorhanden**

| Test-ID | Beschreibung                                | Ergebnis     |
|---------|---------------------------------------------|--------------|
| T004    | Prüft Exception, wenn Tag bereits dem Bild zugewiesen ist | ✅ Erfolgreich |

---

## Manuelle Tests – Frontendfunktionalitäten

Alle UI-Elemente wurden im **Dark Mode** und **Light Mode** manuell getestet. Sowie in allen drei Sprachen (EN, FR, DE)

### 🌙 Dark Mode / ☀️ Light Mode

- UI-Darstellung geprüft
- Farbkontraste, Sichtbarkeit, Funktion

### Sprachen

- Rechtschreibung wurde gerprüft
- Übersetzung wurde geprüft

### Einzelne Filter-Funktionen

| Funktion                                  | Dark Mode | Light Mode | Ergebnis     |
|------------------------------------------|-----------|------------|--------------|
| Tags filtern                                | ✅         | ✅       | Erfolgreich  |
| Kommentare filtern                            | ✅         | ✅   | Erfolgreich  |
| Beschreibung filtern                        | ✅         | ✅          | Erfolgreich  |
| Kombination aller Filter                      | ✅         | ✅        | Erfolgreich  |
| Colorfilter                                  | ✅         | ✅    | Erfolgreich  |
| Sprache umschalten (DE/EN/FR)                  | ✅         | ✅          | Erfolgreich  |

### Detailansicht (Bildansicht)

| Aktion                                  | Ergebnis     |
|-----------------------------------------|--------------|
| Tag hinzufügen                          | ✅ Erfolgreich |
| Tag löschen                             | ✅ Erfolgreich |
| Kommentar hinzufügen                    | ✅ Erfolgreich |
| Kommentar bearbeiten                    | ✅ Erfolgreich |
| Kommentar löschen                       | ✅ Erfolgreich |
| Bild gross anzeigen                    | ✅ Erfolgreich |
| Sprache umschalten (DE/EN/FR)    | ✅ Erfolgreich  |
| In Tag/Nacht umschalten   | ✅ Erfolgreich  |

### Bilder herunterladen
| Aktion                                  | Ergebnis     |
|-----------------------------------------|--------------|
| Checkboxen erscheinen lassen            | ✅ Erfolgreich |
| Bilder auswählen                        | ✅ Erfolgreich |
| Bilder herunterladen                    | ✅ Erfolgreich |
| Alle Bilder auswählen                   | ✅ Erfolgreich |
| Alle Bilder entwählen                   | ✅ Erfolgreich |

---

## Manuelle Backend- & Serverprüfungen

### Server- und API-Tests

- **GET-Requests** wurden in der Anwendung ausgelöst
- Mit `console.log` im Frontend überprüft, ob Anfragen gesendet wurden
- Spring Boot Logs kontrolliert, ob die Anfragen verarbeitet wurden
- Alle Endpunkte haben erwartete Antworten geliefert

### SQL- & Datenbanktests

- Direkt auf dem Server mit SQL-Tools getestet
- Tabellen wurden erstellt und geprüft
- Korrekte ID-Vergabe und Beziehungen überprüft
- Änderungen wurden von der Anwendung korrekt übernommen

| Überprüfungsbereich          | Ergebnis     |
|------------------------------|--------------|
| GET-Anfragen empfangen    | ✅ Erfolgreich |
| console.log-Ausgaben sichtbar | ✅ Erfolgreich |
| Logs im Backend ohne Fehler   | ✅ Erfolgreich |
| SQL-Abfragen erfolgreich | ✅ Erfolgreich |
| Tabellen vorhanden   | ✅ Erfolgreich |
| Daten korrekt gespeichert/abgerufen    | ✅ Erfolgreich |


## Verfügbarkeit und Linktests

Im Rahmen der manuellen Backend-/Serverüberprüfung wurden zusätzlich die extern erreichbaren Dienste getestet, um sicherzustellen, dass die Reverse-Proxy-Konfiguration korrekt funktioniert und alle Services stabil und sicher laufen.

| URL                                          | Ergebnis      | Bemerkung                              |
|----------------------------------------------|---------------|----------------------------------------|
| https://v000564.fhnw.ch/prometheus/          | ✅ Erfolgreich | Wichtig: **Slash am Ende notwendig**   |
| https://v000564.fhnw.ch/orthanc              | ✅ Erfolgreich | Orthanc Web-Oberfläche funktioniert    |
| https://v000564.fhnw.ch/grafana              | ✅ Erfolgreich | Grafana-Dashboard lädt einwandfrei     |
| https://v000564.fhnw.ch                      | ✅ Erfolgreich | Webapplikation lädt     |

---

### Hinweise

- **Prometheus** benötigt zwingend den `/` am Ende der URL, da sonst eine Fehlermeldung oder Redirect-Problem auftreten kann.
- Alle Services wurden im Browser geöffnet und auf Ladeverhalten, Authentifizierung und Funktion getestet.

## Keycloak-Authentifizierung

Die Keycloak-Integration wurde erfolgreich getestet. Dabei wurde geprüft, ob der Login-Prozess korrekt funktioniert, ein Token generiert wird und dieser im Frontend verarbeitet werden kann.

### Durchgeführte Tests

- Benutzer-Login über Keycloak durchgeführt
- Token erfolgreich empfangen und in der Konsole (`console.log`) ausgegeben
- Logout erfolgreich getestet

### Ergebnis

| Testbereich              | Ergebnis       |
|--------------------------|----------------|
| Login                    | ✅ Erfolgreich  |
| Token in Konsole sichtbar | ✅ Ja           |
| Logout                   | ✅ Erfolgreich  |

---



## Zusammenfassung

| Bereich Getestet          | Ergebnis     |
|------------------------------|--------------|
| Automatisierte Unit-Tests    | ✅ Erfolgreich |
| Frontend manuell | ✅ Alle Erfolgreich |
| Backend & Server Manuell   | ✅ Erfolgreich |
| Verfügbarkeit und Linktests   | ✅ Erfolgreich |
| Keycloak-Authentifizierung   | ✅ Erfolgreich |


## Fazit & Empfehlung
Die Anwendung wurde umfassend getestet, sowohl durch automatisierte Unit-Tests als auch durch manuelle Validierung im Frontend und Backend. Alle Funktionen arbeiten korrekt und stabil. Keine schwerwiegenden Fehler festgestellt.

Die aktuelle Version ist bereit für den produktiven Einsatz oder die nächste Integrationsstufe

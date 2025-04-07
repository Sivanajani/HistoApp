# Use-Case-Priorisierung
**Autoren:** **Sutter Reto, Sivakumar Sivanajani**  
**Version:** 1.0 |  **Datum:** 27.02.2025  
**Basierend auf:** [User Stories](./User%20Stories.md) und [B-LS-MI 003 Medizininformatik Projekt](https://b-ls-mi-sip.pages.fhnw.ch/sip-docs/#das-projekt) 

## 1. Einleitung
Dieses Dokument beschreibt die wichtigsten Anwendungsfälle (Use Cases) für das MIP-System. Die Use Cases basieren auf den in den [User Stories](./User%20Stories.md) beschriebenen Szenarien und Anforderungen. Ziel ist es, einen klaren Überblick über typische Abläufe und Interaktionen im System zu geben und so die Entwicklung sowie Qualitätssicherung zu unterstützen.

## 2. Use Case Übersicht  

| Use Case                                     | Beschreibung                          | Beteiligte Akteure                          | Priorisierung |
|----------------------------------------------|---------------------------------------|---------------------------------------------|--------------|
| **UC-02: Anzeige der Bildübersicht** | Visualisierung aller Bilder mittels Thumbnails im Dashboard. | Nutzer, Administrator | Hoch |
| **UC-08: Detailansicht eines Bildes** | Nutzer wählt in der Bildübersicht ein Bild aus für die Detailansicht mit allen zugehörigen Informationen. | Nutzer | Hoch |
| **UC-01: Anmeldung und Authentifizierung** | Benutzer meldet sich über OIDC (Keycloak) mit Username und Passwort an. | Nutzer, Administrator | Mittel |
| **UC-03: Bilder mit Tags versehen, bearbeiten oder entfernen** | Nutzer kann Bilder mit Tags versehen, bearbeiten und vorhandene Tags entfernen. | Nutzer | Mittel |
| **UC-04: Kommentierung von Bildern** | Nutzer kann Bilder mit Kommentaren versehen, Kommentare bearbeiten oder entfernen. | Nutzer | Mittel |
| **UC-05: Filterung nach Tags** | Nutzer kann die Bildübersicht gezielt nach Tags filtern, um relevante Bilder schnell zu finden. | Nutzer | Mittel |
| **UC-06: Filterung nach Kommentaren** | Nutzer kann die Bildübersicht nach Kommentaren durchsuchen, um zusätzliche Informationen zu finden. | Nutzer | Mittel |
| **UC-13: Anzeige von Nutzungsstatistiken** | Nutzer können sich eine Übersicht über die am häufigsten verwendeten Tags oder häufig gesuchte Begriffe anzeigen lassen. | Nutzer | Mittel |
| **UC-07: Filterung nach Farbanalyse** | Nutzer kann Bilder nach den fünf häufigsten Primärfarben sortieren und filtern. | Nutzer | Niedrig |
| **UC-09: Herunterladen von Histologiebildern** | Nutzer kann ausgewählte Histologiebilder herunterladen. | Nutzer | Niedrig |
| **UC-10: Sprachumschaltung** | Änderung der Anwendungssprache (z.B. Deutsch, Französisch). | Nutzer | Niedrig |
| **UC-11: Sicherheitsprotokoll & Änderungsverfolgung** | Administrator kann ein Protokoll aller Nutzeranmeldungen und Änderungen an Bilddaten einsehen. | Administrator | Niedrig |
| **UC-12: Nutzung des Nachtmodus** | Nutzer aktiviert den Nachtmodus für eine augenschonende Nutzung. | Nutzer | Niedrig |
| **UC-14: Betriebszustand** | Es kann der aktuelle Betriebszustand der Systeme eingesehen werden (Laufen alle Services ordnungsgemäss)| Administrator    | Niedrig


# Anforderungen sortiert
## Funktionell
* Einfachen, schnellen und ortsunabhängigen Zugriff auf Bilddaten (Fokus im Organisieren und Beschreiben der Bilder)
* Status des Systems (welcher Server läuft nicht) soll aus der Ferne via Web-Browser überwacht werden mit Open Source Tool 

* Der Zugriff auf die Applikation muss aber vom Internet aus möglich sein.

* GUI:
    * Übersicht über alle Bilder

    * Möglichkeit Einzelansicht/ Detailansicht

    * Bilder ganz einfach mit Tags und Kommentar versehen (beliebige neue Tags hinzufügen oder bestehende löschen können) 

    * Nach Tags und Kommentar filtern (Logik AND/OR)

    * Ein Nachtmodus

    * System auch auf französisch verfügbar

    * Bilder nach Farbtönen filtern (Histogramm) -> In so einer Sicht könnte man auf eine Farbe klicken und würde dann nur die entsprechenden Bilder sehen.

    * Überblick über Tags
 
## Nicht funktionell

* Zugriff auf die Funktionalität soll über einen browserbasiert Web-Client möglich

* Server-Betriebssystem soll GNU/Linux (Debian) sein

* PACS-Servers: was kommt in Frage ORTank, open Source?

* Backend: Spring Boot mit REST Services

* Organisation der Bilder leichtgewichtig und unkompliziert

* Bilder werden in einem PACS System gespeichert und sollen über das WADO-URI (WADO-RS wenn auch im DICOM Standard drinnen ist, auch möglich) Protokoll angesprochen werden

* robuste Software, die gut gewartet und weiterentwickelt werden kann

* Qualitätsmanagement (Logging/ Protokoll)

* Für den Build soll maven und als Containertechnologie Docker verwendet werden

* Server-Dienste sollen in unabhängigen Containern (Micro-Services Architektur) laufen

* Hochfahren der Infrastruktur muss automatisiert erfolgen

* Es soll gitlab.fhnw.ch eingesetzt werden und bei jedem Push soll der Build und die Tests automatisch ausgeführt werden (Continuous Integration mit Gitlab Runner)

* Kommentare von Bildern in einer Datenbank gespeichert

* Zugriffsrechte (Zugriff soll nur authentifizierten Benutzen, Authentifizierung: OIDC (OpenID Connect) mit dem Identity Provider `keycloak) 5-10 Benutzende




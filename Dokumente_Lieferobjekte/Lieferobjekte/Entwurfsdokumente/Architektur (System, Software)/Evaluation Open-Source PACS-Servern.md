# Evaluation von Open-Source PACS-Servern
**Datum:** 21.02.2025 

## 1. Einleitung  
Für die Speicherung, Verwaltung und Bereitstellung von medizinischen Bilddaten (DICOM) wurde die Auswahl eines **Open-Source PACS-Servers** analysiert. Drei relevante Optionen wurden in Betracht gezogen:  
- **Orthanc**  
- **DCM4CHEE**  
- **Conquest DICOM Server**  


## 2. Analyse der PACS-Server

### **2.1 Orthanc**
**Beschreibung:**  
Orthanc ist ein leichter, modularer PACS-Server mit einer modernen REST-API, die eine einfache Integration ermöglicht. Er eignet sich gut für kleine bis mittelgrosse Installationen.

**Vorteile:**  
- Leichtgewichtiger Server mit geringer Hardware-Anforderung
- Moderne REST-API für einfache Integration  
- Unterstützung von Plugins zur Erweiterung der Funktionen  
- Gute Dokumentation und aktive Community  
- Plattformunabhängig (läuft unter Windows, Linux und macOS)  
- Unterstützt DICOMweb für Web-Clients  

**Nachteile:**  
- Weniger leistungsfähig für grosse Installationen (Skalierung begrenzt)  
- Keine integrierte HL7-Unterstützung (muss mit Plugins nachgerüstet werden)  
- Eingeschränkte Workflow-Funktionen im Vergleich zu DCM4CHEE  

**Website:** [https://www.orthanc-server.com/](https://www.orthanc-server.com/)  

---

### **2.2 DCM4CHEE**
**Beschreibung:**  
DCM4CHEE ist ein leistungsfähiges PACS, das speziell für grössere Installationen entwickelt wurde. Es bietet umfangreiche HL7- und RIS-Funktionen sowie Workflows für Krankenhäuser.  

**Vorteile:**  
- Unterstützung für grosse Bildmengen und komplexe Workflows  
- Integrierte HL7-Schnittstelle für Krankenhauskommunikation  
- Erweiterbare Architektur mit vielen Konfigurationsmöglichkeiten  
- Unterstützung für verteilte Speicherlösungen  

**Nachteile:**  
- Sehr komplexe Einrichtung und Konfiguration  
- Höhere Hardware-Anforderungen als Orthanc  
- Steile Lernkurve und aufwendige Wartung  
- Weniger benutzerfreundlich für kleinere Projekte  

**Website:** [https://www.dcm4che.org/](https://www.dcm4che.org/)  

---

### **2.3 Conquest DICOM Server**
**Beschreibung:**  
Conquest ist ein einfacher, leichtgewichtiger DICOM-Server, der für kleine bis mittlere PACS-Lösungen geeignet ist.  

**Vorteile:**  
- Sehr ressourcenschonend (niedrige Hardware-Anforderungen)  
- Einfache Installation und Nutzung
- Unterstützt DICOM und HL7 (eingeschränkt)  
- Kann mit SQL-Datenbanken kombiniert werden  

**Nachteile:**  
- Begrenzte Skalierbarkeit, nicht für grosse Bildmengen geeignet  
- Keine moderne API (z. B. keine REST-Schnittstelle)  
- Geringere Community und weniger regelmässige Updates  

**Website:** [https://github.com/marcelvanherk/Conquest-DICOM-Server](https://github.com/marcelvanherk/Conquest-DICOM-Server)  


## 3. Entscheidung für **Orthanc**  

Nach der Analyse der verschiedenen Open-Source PACS-Server wurde entschieden, **Orthanc** zu verwenden, da es die beste Kombination aus **Benutzerfreundlichkeit, Erweiterbarkeit und API-Unterstützung** bietet. Es ist ideal für unser Projekt geeignet, da es leicht integrierbar und gut dokumentiert ist. 

### **Gründe für die Entscheidung:**  
✔ **Einfache Installation & Integration:** Dank der REST-API kann Orthanc leicht in bestehende Systeme integriert werden.  
✔ **Gute Dokumentation & Community-Support:** Aktive Entwicklergemeinschaft und viele Erweiterungsmöglichkeiten.  
✔ **DICOMweb-Unterstützung:** Ermöglicht die Nutzung Web-Technologien.  
✔ **Erweiterbar mit Plugins:** Falls später mehr Funktionalitäten benötigt werden, kann Orthanc flexibel angepasst werden.  

### 3.1. Vergleichstabelle der PACS-Server

| PACS-Server         | Einfachheit der Einrichtung | Skalierbarkeit | API-Unterstützung | HL7-Integration | Community-Support | Geeignet für grosse Installationen? |
|---------------------|-----------------------------|----------------|--------------------|-----------------|--------------------|----------------------------------|
| **Orthanc**         | ⭐⭐⭐⭐☆ (Sehr einfach) | ⭐⭐⭐☆☆ (Mittel) | ✅ REST-API, DICOMweb  | ❌ Nur mit Plugin  | ⭐⭐⭐⭐☆ (Sehr gut)   | ❌ Nein |
| **DCM4CHEE**        | ⭐⭐☆☆☆ (Komplex)        | ⭐⭐⭐⭐⭐ (Sehr hoch) | ✅ DICOM-API       | ✅ Ja             | ⭐⭐⭐☆☆ (Gut)        | ✅ Ja |
| **Conquest DICOM**  | ⭐⭐⭐⭐⭐ (Sehr einfach)| ⭐⭐☆☆☆ (Begrenzt) | ❌ Keine moderne API | ✅ Eingeschränkt  | ⭐⭐☆☆☆ (Begrenzt)   | ❌ Nein |

---

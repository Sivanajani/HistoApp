# Informationen zum DicomConverter

## Allgemeinen Infos
Der DicomConverter wurde mit Hilfe von Python realisiert. Das Ziel ist es, einen Ordenr mit JPEG's mit Hilfe dieses Pythonscripts in einem Zielordner als Dicomefiles abzuspeichern. Aus dem Metadaten.xml werden noch Metadaten für die jeweiligen Bilder extrahiert.

## Interpreter
Für das Testen des Converters wurde VisualStudiocode verwendet mit dem Pythoninterpreter Python 3.9.18.
(Visual Studio Code: cmd+shift+P)

Bei Bedarf noch die Bibliothek herunterladen: 
```bash
pip install pydicom
```

## Ablauf
1. zu konvertierende JPEG Files in Ordner input_jpegs laden (oder Pfad im Script anpassen)
2. aktuelle *allImageMetadata.xml* in Ordner dicomConverter laden (oder Pfad im Script anpassen)
3. Python Skript *DicomConverter_neu.py* starten

-> Die neuen Dicomdateien werden im Ordner output_dicoms gespeichert (oder Pfad im Script anpassen)


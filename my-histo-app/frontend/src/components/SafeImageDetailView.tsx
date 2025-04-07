/*
SafeImageDetailView.tsx ist ein sicherer Wrapper für die Bild-Detailansicht.
Sie übernimmt:
- das Laden eines Einzelbildes anhand der ID aus der URL
- das gleichzeitige Laden von Bildpfad und Beschreibung via Promise.all
- das Setzen von Fehler- oder Ladezuständen
- die Weitergabe des geladenen Bildobjekts an die Komponente ImageDetailView

Die Komponente stellt sicher, dass das Bild korrekt geladen ist, bevor es angezeigt wird.
*/
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ImageDetailView from "./ImageDetailView";
import { fetchImageDescription } from "../utils/fetchImageDescription";
import { fetchSingleImage } from "../utils/fetchSingleImage";

const SafeImageDetailView = () => {
  const { id } = useParams<{ id: string }>();

  // Lokaler Zustand für das Bild
  const [image, setImage] = useState<{
    id: string;
    src: string;
    description: string;
    comments: string[];
  } | null>(null);

  // Fehlerzustand, falls etwas schiefläuft
  const [error, setError] = useState<string | null>(null);

  // useEffect lädt das Bild bei Komponentenstart oder wenn sich die ID ändert
  useEffect(() => {
    const loadImage = async () => {
      if (!id) return;

      try {
        // Bilddaten und Beschreibung gleichzeitig laden
        const [srcPath, description] = await Promise.all([
          fetchSingleImage(id),
          fetchImageDescription(id),
        ]);

        // Bildzustand setzen (Kommentare werden leer übergeben)
        setImage({
          id,
          src: `https://v000564.fhnw.ch/orthanc${srcPath}`,
          description,
          comments: [],
        });
      } catch (err) {
        console.error("Fehler beim Laden des Einzelbildes:", err);
        setError("Bild konnte nicht geladen werden.");
      }
    };

    loadImage();
  }, [id]);

  // Wenn ein Fehler aufgetreten ist, zeige eine Fehlermeldung
  if (error) {
    return <Typography variant="h6">{error}</Typography>;
  }

  // Wenn das Bild noch nicht geladen ist, zeige eine Ladeanzeige
  if (!image) {
    return <Typography variant="h6">Lade Bild ...</Typography>;
  }

// Wenn alles erfolgreich geladen wurde, zeige die Detailansicht
  return <ImageDetailView key={image.id} image={image} />;
};

export default SafeImageDetailView;

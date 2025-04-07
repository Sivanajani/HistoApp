/*
useAppState.ts stellt einen globalen Zustand für die Anwendung bereit.
Funktionen:
- Laden aller Bilddaten inkl. Kommentar- und Farblabelinformationen
- Filterung nach Kommentarinhalten, Farblabels und Tags (inkl. AND/OR-Logik)
- Verwaltung von Kommentaren (CRUD)
- Verwaltung von Tags (CRUD)
- Unterstützung für Zoom-Skalierung, Light/Dark Mode, Bildauswahl und Mehrsprachigkeit
- Verwendung von Caching (Ref) und Debouncing zur Performance-Optimierung
Dieses Hook dient als zentrales Steuerungsmodul für die gesamte App-Logik.
*/
import { useState, useEffect, useCallback, useRef } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import translations from "../translations";
import { useLanguageStore } from "../store/useLanguageStore";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { fetchImageDescription } from "../utils/fetchImageDescription"; 

// Bildtyp mit optionaler Beschreibung
interface ImageData {
  id: string;
  src: string;
  description?: string;
  comments: string[];
}

// Map von Bild-ID zu Farblabel 
interface ColorLabelMap {
  [uid: string]: number;
}

// Tag mit ID, Name und optionalen Bildern
interface Tag {
  id: number;
  name: string;
  images?: string[];
  count: number;
}

// Kommentarstruktur
interface Comment {
  id: number;
  context: string;
}

// API-Basis-URL
const API_URL = "https://v000564.fhnw.ch/api";

// Hilfsfunktion zum Laden der Bild-UIDs
const fetchSopUIDs = async (): Promise<string[]> => {
  const response = await fetchWithAuth(`${API_URL}/v1/sopuids`);
  if (!response.ok) throw new Error("Fehler beim Abrufen der SOP-UIDs");
  return await response.json();
};

// Hilfsfunktion zum Laden der Base64-kodierten Bilder
const fetchImagesByUIDs = async (uids: string[]): Promise<string[]> => {
  const response = await fetchWithAuth(`${API_URL}/v1/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(uids),
  });
  if (!response.ok) throw new Error("Fehler beim Abrufen der Bilder");
  return await response.json();
};

// zentrales App-State-Hook
export const useAppState = () => {
  // Zustand für Bilder, Rohbilder und Kommentare
  const [images, setImages] = useState<ImageData[]>([]);
  const [rawImages, setRawImages] = useState<ImageData[]>([]);
  const [comment, setComment] = useState<string>("");
  const [debouncedComment, setDebouncedComment] = useState(comment);
  const [descriptionMap, setDescriptionMap] = useState<{
    [id: string]: string;
  }>({}); 
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [colorLabels, setColorLabels] = useState<ColorLabelMap>({});
  const [selectedColorName, setSelectedColorName] = useState<string | null>(
    null
  );
  const [tags, setTags] = useState<Tag[]>([]);
  // Skalierungswert wird initial aus localStorage geladen
  const [scale, setScaleState] = useState<number>(() => {
    const saved = localStorage.getItem("scale");
    localStorage.removeItem("scale");
    return saved ? Number(saved) : 50;
  });
  const [error] = useState<string | null>(null);

  // Sprache wird aus einem zentralen Store bezogen
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const colorLabelsLoadedRef = useRef(false);
  const initializedRef = useRef(false);
  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const [useAndOperator, setUseAndOperator] = useState(false);
  const [commentsByImageId, setCommentsByImageId] = useState<{
    [imageId: string]: Comment[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);

   // Funktion zum Laden aller globalen Kommentare, gruppiert nach Bild-ID
  const loadAllComments = useCallback(async (): Promise<{
    [imageId: string]: string[];
  }> => {
    try {
      const res = await fetchWithAuth(`${API_URL}/v1/comments/allcomments`);
      if (!res.ok)
        throw new Error("Fehler beim Abrufen der globalen Kommentare");

      const allComments = await res.json();
      const grouped: { [imageId: string]: string[] } = {};

      allComments.forEach((comment: any) => {
        const uid = comment.sopInstanceUID;
        if (!uid) return;
        if (!grouped[uid]) grouped[uid] = [];
        grouped[uid].push(comment.context);
      });

      return grouped;
    } catch (error) {
      console.error("Fehler beim Laden der globalen Kommentare:", error);
      return {};
    }
  }, []);

  // Filtert eine Liste von Bildern anhand des (debounced) Kommentarinhalt oder Beschreibung 
  const filterByComment = (imageList: ImageData[]) => {
    if (!debouncedComment.trim()) return imageList;

    try {
      const searchTerms = debouncedComment
        .toLowerCase()
        .split(/[\u0000-\s,]+/)
        .map((term) => term.replace(/[^a-zA-Z0-9äöüÄÖÜß-]/g, ""))
        .filter((term) => term.length > 0);

      if (searchTerms.length === 0) return imageList;

      return imageList.filter((img) => {
        const desc = descriptionMap[img.id] || "";
        const comments = img.comments.join(" ").toLowerCase();

        return searchTerms.some(
          (term) => desc.toLowerCase().includes(term) || comments.includes(term)
        );
      });
    } catch (error) {
      console.error("Fehler beim Filtern nach Kommentaren:", error);
      return imageList;
    }
  };

  // Definition der Farben mit entsprechenden Labels und Farben
  const PRIMARY_COLORS = [
    { name: t.colors.Rot, label: 0, color: "#F44336" },
    { name: t.colors["Orange/Gelb"], label: 1, color: "#FFB74D" },
    { name: t.colors["Grün"], label: 2, color: "#66BB6A" },
    { name: t.colors["Türkis/Blau"], label: 3, color: "#4FC3F7" },
    { name: t.colors["Rosa/Magenta"], label: 4, color: "#E040FB" },
  ];

   // Funktion zum Abrufen von Kommentaren für ein spezifisches Bild
  const fetchComments = useCallback(async (imageId: string) => {
    try {
      const comments = await fetchCommentsForImage(imageId);
      setCommentsByImageId((prev) => ({ ...prev, [imageId]: comments }));
    } catch (err) {
      console.error("Fehler beim Laden der Kommentare:", err);
    }
  }, []);

  // Funktion zum Hinzufügen eines Kommentars zu einem Bild
  const addComment = async (imageId: string, context: string) => {
    try {
      const created = await addCommentToImage(imageId, context);
      setCommentsByImageId((prev) => ({
        ...prev,
        [imageId]: [...(prev[imageId] || []), created],
      }));
    } catch (err) {
      console.error("Fehler beim Hinzufügen des Kommentars:", err);
    }
  };

   // Funktion zum Aktualisieren eines Kommentars im globalen Zustand
  const updateCommentInStore = async (
    commentId: number,
    imageId: string,
    context: string
  ) => {
    try {
      const updated = await updateComment(commentId, context);
      setCommentsByImageId((prev) => ({
        ...prev,
        [imageId]: (prev[imageId] || []).map((c) =>
          c.id === updated.id ? updated : c
        ),
      }));
    } catch (err) {
      console.error("Fehler beim Aktualisieren des Kommentars:", err);
    }
  };

  // Funktion zum Löschen eines Kommentars aus dem globalen Zustand
  const deleteCommentFromStore = async (commentId: number, imageId: string) => {
    try {
      await deleteComment(commentId);
      setCommentsByImageId((prev) => ({
        ...prev,
        [imageId]: (prev[imageId] || []).filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      console.error("Fehler beim Löschen des Kommentars:", err);
    }
  };

  // Abruf von Kommentaren für ein einzelnes Bild über die API
  const fetchCommentsForImage = async (
    sopInstanceUID: string
  ): Promise<Comment[]> => {
    const res = await fetchWithAuth(`${API_URL}/v1/comments/${sopInstanceUID}`);
    if (!res.ok) throw new Error("Fehler beim Abrufen der Kommentare");
    return await res.json();
  };

  // API-Aufruf zum Hinzufügen eines Kommentars zu einem Bild
  const addCommentToImage = async (
    sopInstanceUID: string,
    context: string
  ): Promise<Comment> => {
    const res = await fetchWithAuth(
      `${API_URL}/v1/comments/add/${sopInstanceUID}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      }
    );
    if (!res.ok) throw new Error("Fehler beim Hinzufügen des Kommentars");
    return await res.json();
  };

  // API-Aufruf zum Aktualisieren eines Kommentars
  const updateComment = async (
    commentId: number,
    context: string
  ): Promise<Comment> => {
    const res = await fetchWithAuth(
      `${API_URL}/v1/comments/update/${commentId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      }
    );
    if (!res.ok) throw new Error("Fehler beim Aktualisieren des Kommentars");
    return await res.json();
  };

  // API-Aufruf zum Löschen eines Kommentars
  const deleteComment = async (commentId: number): Promise<void> => {
    const res = await fetchWithAuth(
      `${API_URL}/v1/comments/remove/${commentId}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) throw new Error("Fehler beim Löschen des Kommentars");
  };

  // Umschalten der Bildauswahl: Auswahl oder Deselektion eines Bildes
  const toggleImageSelection = (id: string) => {
    setSelectedImageIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Alle Bilder auswählen
  const selectAllImages = () => {
    setSelectedImageIds(images.map((img) => img.id));
  };

  // Alle Bildauswahlen aufheben
  const deselectAllImages = () => {
    setSelectedImageIds([]);
  };

  // Setzt den Skalierungswert und speichert ihn im localStorage
  const setScale = (value: number) => {
    setScaleState(value);
    localStorage.setItem("scale", value.toString());
  };

  // Funktion zum Laden aller Tags (mit Berechnung der Anzahl der zugeordneten Bilder)
  const loadAllTags = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${API_URL}/v1/histotag/alltags`);
      if (!res.ok) throw new Error("Fehler beim Abrufen der globalen Tags");

      const data = await res.json();
      const tagsWithCount = data.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        images: tag.images,
        count: tag.images?.length ?? 0,
      }));
      setTags(tagsWithCount);

      // Überprüft, ob alle Bild-IDs in den Tags auch in rawImages vorhanden sind
      tagsWithCount.forEach((tag: Tag) => {
        (tag.images || []).forEach((tagImgId) => {
          const exists = rawImages.some((img) => img.id === tagImgId);
          if (!exists) {
            console.warn(
              `Tag '${tag.name}' enthält Bild-ID ${tagImgId}, die nicht in rawImages ist`
            );
          }
        });
      });
    } catch (err) {
      console.error("Fehler beim Laden aller Tags:", err);
    }
  }, [rawImages]);

  // Handler für Änderungen an der Tag-Auswahl
  const handleTagChange = (event: SelectChangeEvent<string[]>) => {
    const selected = event.target.value as string[];
    setSelectedTagNames(selected);
  };

  // Filtert Bilder anhand der ausgewählten Tags, unterstützt AND- und OR-Operatoren
  const filterImagesBySelectedTags = (
    imageList: ImageData[],
    andOperator = false
  ) => {
    if (selectedTagNames.length === 0) return imageList;

    const filteredImages = imageList.filter((img) => {
      const tagNamesForImage = tags
        .filter((tag) => tag.images?.includes(img.id))
        .map((tag) => tag.name);

      return andOperator
        ? selectedTagNames.every((tag) => tagNamesForImage.includes(tag))
        : selectedTagNames.some((tag) => tagNamesForImage.includes(tag));
    });
    return filteredImages;
  };

  // Lädt Tags für ein spezifisches Bild
  const loadTags = async (sopInstanceUID: string): Promise<Tag[]> => {
    try {
      const response = await fetchWithAuth(
        `${API_URL}/v1/histotag/tagsforimage/${sopInstanceUID}`
      );
      if (!response.ok) throw new Error("Fehler beim Abrufen der Tags");
      const tagList = await response.json();
      return tagList.map((tag: any) => ({ id: tag.id, name: tag.name }));
    } catch (error) {
      console.error("Fehler beim Laden der Tags:", error);
      return [];
    }
  };

  // Fügt ein neues Tag zu einem Bild hinzu und aktualisiert die Tag-Liste
  const addNewTag = async (name: string, sopInstanceUID: string) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/v1/histotag/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sopInstanceUID }),
      });
      if (!response.ok) throw new Error("Fehler beim Hinzufügen des Tags");

      await loadAllTags(); 
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Tags:", error);
    }
  };

   // Löscht ein Tag anhand der Tag-ID und aktualisiert die Tag-Liste
  const deleteTagById = async (tagId: number, sopInstanceUID: string) => {
    try {
      const response = await fetchWithAuth(
        `${API_URL}/v1/histotag/remove/${tagId}/${sopInstanceUID}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Fehler beim Löschen des Tags");

      await loadAllTags(); 
    } catch (error) {
      console.error("Fehler beim Löschen des Tags:", error);
    }
  };

  // Sortiert Bilder anhand des Farblabels; nicht vorhandene Labels erhalten einen hohen Standardwert
  const sortImagesByColorLabel = (
    imageList: ImageData[],
    labels: ColorLabelMap
  ): ImageData[] => {
    return [...imageList].sort((a, b) => {
      const labelA = labels[a.id] ?? 999;
      const labelB = labels[b.id] ?? 999;
      return labelA - labelB;
    });
  };

  // Filtert Bilder anhand des ausgewählten Farbnamens
  const filterImagesBySelectedColorName = (colorName: string | null) => {
    if (!colorName) {
      const sorted = sortImagesByColorLabel(rawImages, colorLabels);
      setImages(sorted);
      return;
    }
    const colorEntry = PRIMARY_COLORS.find((c) => c.name === colorName);
    if (!colorEntry) return;

    const filtered = rawImages.filter(
      (img) => colorLabels[img.id] === colorEntry.label
    );
    setImages(filtered);
  };

  // Umschalten des Farbfilters; bei erneutem Klick wird der Filter aufgehoben
  const toggleColorFilter = (colorName: string) => {
    const newColor = selectedColorName === colorName ? null : colorName;
    setSelectedColorName(newColor);
    filterImagesBySelectedColorName(newColor);
  };

  // Umschalten der Tag-Auswahl: Fügt ein Tag hinzu oder entfernt es, falls bereits ausgewählt
  const toggleTagName = (tagName: string) => {
    setSelectedTagNames((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  // Effekt zum Laden der Farblabels vom Backend (einmalig, sobald rawImages vorhanden sind)
  useEffect(() => {
    const loadColorLabels = async () => {
      if (colorLabelsLoadedRef.current || rawImages.length === 0) return;
      colorLabelsLoadedRef.current = true;

      try {
        const sopUIDs = rawImages.map((img) => img.id);
        const res = await fetchWithAuth(`${API_URL}/v1/colors`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sopUIDs),
        });

        if (!res.ok) throw new Error("Fehler beim Abrufen der Farblabels");

        const labelList: (number | null)[] = await res.json();
        const labelMap: ColorLabelMap = {};
        sopUIDs.forEach((uid, index) => {
          const label = labelList[index];
          labelMap[uid] = typeof label === "number" ? label : -1;
        });

        setColorLabels(labelMap);
        const sorted = sortImagesByColorLabel(rawImages, labelMap);
        setImages(sorted);
      } catch (error) {
        console.error("Fehler beim Laden der Farblabels vom Backend:", error);
      }
    };

    loadColorLabels();
  }, [rawImages]);

  // Lädt Bilder und Kommentare beim ersten Render
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const loadImages = async () => {
      try {
        const uids = await fetchSopUIDs();
        const base64Images = await fetchImagesByUIDs(uids);
        const commentMap = await loadAllComments();

        const loadedImages: ImageData[] = uids.map((uid, index) => ({
          id: uid,
          src: `https://v000564.fhnw.ch/orthanc${base64Images[index]}?width=100&height=100&quality=3`,
          comments: commentMap[uid] || [],
        }));

        setRawImages(loadedImages);
      } catch (error) {
        console.error("Fehler beim Laden der Bilder:", error);
      }
    };

    loadImages();
  }, [loadAllComments]);

  // Effekt zum "Debouncen" des Kommentar-Inputs und Laden von Beschreibungen
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedComment(comment);
      // Wenn ein Kommentar eingegeben wurde, werden für alle Bilder Beschreibungen nachgeladen
      if (comment.trim()) {
        rawImages.forEach(async (img) => {
          if (!descriptionMap[img.id]) {
            const desc = await fetchImageDescription(img.id);
            setDescriptionMap((prev) => ({ ...prev, [img.id]: desc }));
          }
        });
      }
    }, 200);
    return () => clearTimeout(handler);
  }, [comment]);

  // Aktualisiert die Kommentare eines bestimmten Bildes im Zustand
  const updateComments = (imageId: string, newComments: string[]) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === imageId ? { ...img, comments: newComments } : img
      )
    );
  };

  // Kombiniert alle Filter- und Sortierfunktionen, um die angezeigten Bilder zu bestimmen
  const getFilteredImages = () => {
    let filtered = [...rawImages];

    if (selectedColorName) {
      const colorEntry = PRIMARY_COLORS.find(
        (c) => c.name === selectedColorName
      );
      if (colorEntry) {
        filtered = filtered.filter(
          (img) => colorLabels[img.id] === colorEntry.label
        );
      }
    }

    filtered = filterImagesBySelectedTags(filtered, useAndOperator);
    filtered = filterByComment(filtered);

    return sortImagesByColorLabel(filtered, colorLabels);
  };

  // Umschalten zwischen Light- und Dark-Mode
  const toggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  // Logout-Funktion 
  const logout = () => console.log("Benutzer wurde ausgeloggt");

  return {
    rawImages,
    images,
    updateComments,
    comment,
    setComment,
    mode,
    toggleMode,
    filterByComment,
    logout,
    scale,
    setScale,
    selectedColorName,
    setSelectedColorName,
    toggleColorFilter,
    tags,
    loadTags,
    addNewTag,
    deleteTagById,
    handleTagChange,
    error,
    selectedTagNames,
    toggleTagName,
    filterImagesBySelectedTags,
    selectedImageIds,
    toggleImageSelection,
    selectAllImages,
    deselectAllImages,
    commentsByImageId,
    fetchComments,
    addComment,
    updateComment: updateCommentInStore,
    deleteComment: deleteCommentFromStore,
    loadAllTags,
    useAndOperator,
    setUseAndOperator,
    getFilteredImages,
    isLoading,
    setIsLoading,
  };
};

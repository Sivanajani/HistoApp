/*
translations.ts enthält alle Sprachübersetzungen (DE, FR, EN) für die Benutzeroberfläche.
Funktionen:
- Wird verwendet, um Texte je nach gewählter Sprache dynamisch anzuzeigen
- Struktur ist ein einfaches Objekt mit Strings, verschachtelten Objekten und Funktionsausdrücken
- Wird in Verbindung mit useLanguageStore eingesetzt

Der Zugriff erfolgt z. B. über: translations[language].filterByTag
*/
const translations = {
  DE: {
    filterByTag: "Nach Tag filtern",
    filterByComment: "Nach Kommentar oder Bildbeschreibung suchen...",
    and: "UND",
    or: "ODER",
    imageLabel: (desc: string) => desc || "Keine Beschreibung verfügbar",
    languageButton: "DE",
    rowCount: "Bilder pro Zeile",
    sliderTooltip: "Ziehe den Regler, um die Bildgrösse anzupassen.",
    tagsLabel: "Tags:",
    newTagPlaceholder: "Neuer Tag",
    commentsTitle: "Kommentare",
    newCommentPlaceholder: "Neuer Kommentar",
    zoomTooltip: "Klicken zum Vergrössern",
    colorTooltip: "Farbe auswählen",
    activeColorTooltip: "Farbfilter aktiv:",
    colors: {
      Rot: "Rot",
      "Orange/Gelb": "Orange/Gelb",
      Grün: "Grün",
      "Türkis/Blau": "Türkis/Blau",
      "Rosa/Magenta": "Rosa/Magenta",
    },
    imageCount: {
      singular: "Bild geladen",
      plural: "Bilder geladen",
    },
    showCheckboxesButton: {
      show: "Bilder herunterladen (Checkboxen anzeigen)",
      hide: "Checkboxen ausblenden",
    },
    selectAll: "Alle auswählen",
    deselectAll: "Auswahl zurücksetzen",
    downloadZip: "ZIP herunterladen",
  },
  FR: {
    filterByTag: "Filtrer par tag",
    filterByComment: "Rechercher un commentaire ou une description d'image...",
    and: "ET",
    or: "OU",
    imageLabel: (desc: string) => desc || "Pas de description disponible",
    languageButton: "FR",
    rowCount: "Images par ligne",
    sliderTooltip:
      "Faites glisser le curseur pour ajuster la taille des images",
    tagsLabel: "Tags :",
    newTagPlaceholder: "Nouveau tag",
    commentsTitle: "Commentaires",
    newCommentPlaceholder: "Nouveau commentaire",
    zoomTooltip: "Cliquez pour agrandir",
    colorTooltip: "Choisir une couleur",
    activeColorTooltip: "Filtre de couleur actif :",
    colors: {
      Rot: "Rouge",
      "Orange/Gelb": "Orange/Jaune",
      Grün: "Vert",
      "Türkis/Blau": "Turquoise/Bleu",
      "Rosa/Magenta": "Rose/Magenta",
    },
    imageCount: {
      singular: "image chargée",
      plural: "images chargées",
    },
    showCheckboxesButton: {
      show: "Télécharger les images (afficher les cases)",
      hide: "Masquer les cases",
    },
    selectAll: "Tout sélectionner",
    deselectAll: "Réinitialiser la sélection",
    downloadZip: "Télécharger en ZIP",
  },

  EN: {
    filterByTag: "Filter by tag",
    filterByComment: "Search comment or image description...",
    and: "AND",
    or: "OR",
    imageLabel: (desc: string) => desc || "No description available",
    languageButton: "EN",
    rowCount: "Images per row",
    sliderTooltip: "Drag the slider to adjust image size.",
    tagsLabel: "Tags:",
    newTagPlaceholder: "New tag",
    commentsTitle: "Comments",
    newCommentPlaceholder: "New comment",
    zoomTooltip: "Click to zoom in",
    colorTooltip: "Select color",
    activeColorTooltip: "Color filter active:",
    colors: {
      Rot: "Red",
      "Orange/Gelb": "Orange/Yellow",
      Grün: "Green",
      "Türkis/Blau": "Turquoise/Blue",
      "Rosa/Magenta": "Pink/Magenta",
    },
    imageCount: {
      singular: "image loaded",
      plural: "images loaded",
    },
    showCheckboxesButton: {
      show: "Download images (show checkboxes)",
      hide: "Hide checkboxes",
    },
    selectAll: "Select all",
    deselectAll: "Reset selection",
    downloadZip: "Download ZIP",
  },
};

export default translations;

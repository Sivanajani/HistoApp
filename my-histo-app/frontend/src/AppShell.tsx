/*
AppShell.tsx ist die zentrale Layout-Komponente der Anwendung.
Funktionen:
- Verbindet Navbar, Filterbereich, Bildraster und Footer zu einer vollständigen App-Ansicht
- Steuert die Anzeige von Checkboxen und den ZIP-Download
- Bezieht Zustand über useAppState (Filter, Auswahl, Bilder, Tags usw.)
- Stellt Routing bereit (Startseite mit Bildübersicht, Detailansicht pro Bild)
- Verwaltet den aktuellen Theme-Modus (light/dark) und übergibt ihn an Layout und Navbar
*/
import { useAppState } from "./hooks/useAppState";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import FilterSection from "./components/FilterSection";
import ImageGrid from "./components/ImageGrid";
import Footer from "./components/Footer";
import SafeImageDetailView from "./components/SafeImageDetailView";
import { Routes, Route } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import translations from "./translations";
import { useLanguageStore } from "./store/useLanguageStore";
import { fetchWithAuth } from "./utils/fetchWithAuth";

// Props für AppShell (Dark-/Light-Modussteuerung)
interface AppShellProps {
  initialMode: "light" | "dark";
  setMode: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

const AppShell = ({ initialMode, setMode }: AppShellProps) => {
  const {
    comment,
    setComment,
    handleTagChange,
    logout,
    scale,
    setScale,
    selectedColorName,
    setSelectedColorName,
    toggleColorFilter,
    selectedImageIds,
    toggleImageSelection,
    selectAllImages,
    deselectAllImages,
    selectedTagNames,
    tags,
    loadAllTags,
    getFilteredImages,
    useAndOperator,
    setUseAndOperator,
  } = useAppState();

  const mode = initialMode;
  const toggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  const [showCheckboxes, setShowCheckboxes] = useState(false);

  const language = useLanguageStore((state) => state.language);
  const t = translations[language];

  useEffect(() => {
    loadAllTags();
  }, [loadAllTags]);

  // Bilder als ZIP herunterladen
  const downloadImagesAsZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("Histo-Bilder");

    const filteredImages = getFilteredImages();
    const selectedImages = filteredImages.filter((img) =>
      selectedImageIds.includes(img.id)
    );

    for (const img of selectedImages) {
      const response = await fetchWithAuth(img.src);
      const blob = await response.blob();
      const filename = `${img.id}.jpg`;
      folder?.file(filename, blob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "my-histo-bilder.zip");
  };

  return (
    <Layout mode={mode}>
      <Navbar toggleMode={toggleMode} mode={mode} logout={logout} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <FilterSection
                mode={mode}
                selectedTags={selectedTagNames}
                handleTagChange={handleTagChange}
                comment={comment}
                setComment={setComment}
                tags={tags}
                scale={scale}
                setScale={setScale}
                selectedColorName={selectedColorName}
                setSelectedColorName={setSelectedColorName}
                toggleColorFilter={toggleColorFilter}
                useAndOperator={useAndOperator}
                setUseAndOperator={setUseAndOperator}
              />
              {/* Umschalter für Checkboxen anzeigen/verstecken */}
              <Button
                variant="text"
                onClick={() => setShowCheckboxes((prev) => !prev)}
                sx={{
                  color: mode === "dark" ? "#fff" : undefined,
                  borderColor: mode === "dark" ? "#888" : undefined,
                }}
              >
                {showCheckboxes
                  ? t.showCheckboxesButton.hide
                  : t.showCheckboxesButton.show}
              </Button>

              {/* Buttons nur sichtbar, wenn Checkboxen aktiv sind */}
              {showCheckboxes && (
                <>
                  <Button
                    variant="outlined"
                    onClick={selectAllImages}
                    sx={{
                      color: mode === "dark" ? "#fff" : undefined,
                      borderColor: mode === "dark" ? "#888" : undefined,
                    }}
                  >
                    {t.selectAll}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={deselectAllImages}
                    sx={{
                      color: mode === "dark" ? "#fff" : undefined,
                      borderColor: mode === "dark" ? "#888" : undefined,
                    }}
                  >
                    {t.deselectAll}
                  </Button>

                  <Button
                    variant="contained"
                    onClick={downloadImagesAsZip}
                    disabled={selectedImageIds.length === 0}
                  >
                    {t.downloadZip}
                  </Button>
                </>
              )}

              {/* Anzeige der Bildanzahl (Singular/Plural) */}
              <Typography
                variant="body2"
                sx={{
                  px: 2,
                  pb: 1,
                  fontStyle: "italic",
                  color: mode === "dark" ? "#ccc" : "#444",
                }}
              >
                {getFilteredImages().length}{" "}
                {getFilteredImages().length === 1
                  ? t.imageCount?.singular || "Bild geladen"
                  : t.imageCount?.plural || "Bilder geladen"}
              </Typography>

              {/* Bildraster mit Filtern und Auswahl */}
              <ImageGrid
                imageList={getFilteredImages()}
                mode={mode}
                scale={scale}
                selectedImageIds={selectedImageIds}
                toggleImageSelection={toggleImageSelection}
                showCheckboxes={showCheckboxes}
              />
            </>
          }
        />
        {/* Detailansicht für Einzelbild */}
        <Route path="/image/:id" element={<SafeImageDetailView />} />
      </Routes>

      <Footer mode={mode} />
    </Layout>
  );
};

export default AppShell;

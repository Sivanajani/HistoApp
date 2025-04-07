/*
ImageGrid.tsx stellt eine Galerieansicht für eine Liste von Bildern dar.
Funktionen:
- Responsive Darstellung: Anzahl Spalten passt sich automatisch der Bildschirmbreite und Zoom-Skala an
- Tooltips mit Beschreibung: Bildbeschreibungen werden bei Mouseover asynchron geladen
- Bilder können per Klick selektiert und via Checkbox markiert werden
- Bei Klick auf ein Bild wird zur Detailansicht navigiert
- Checkbox-Grösse passt sich dynamisch der Skalierung an
Die Komponente ist memoisiert, um unnötige Re-Renders zu vermeiden.
*/
import { Grid, Card, CardMedia, Tooltip, Box, Checkbox } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState, memo } from "react";
import { fetchImageDescription } from "../utils/fetchImageDescription";

// Struktur eines einzelnen Bildobjekts
interface ImageData {
  id: string;
  src: string;
  description?: string;
  comments: string[];
}

// Props der Galerie-Komponente
interface ImageGridProps {
  imageList: ImageData[];
  mode: "light" | "dark";
  scale: number;
  selectedImageIds: string[];
  toggleImageSelection: (id: string) => void;
  showCheckboxes: boolean;
}

// Hauptkomponente
const ImageGrid = ({
  imageList,
  mode,
  scale,
  selectedImageIds,
  toggleImageSelection,
  showCheckboxes,
}: ImageGridProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [imagesPerRow, setImagesPerRow] = useState(5);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});

   // Anzahl Spalten je nach Bildschirmbreite und Zoomfaktor berechnen
  useEffect(() => {
    const updateGrid = () => {
      const screenWidth = window.innerWidth;
      const maxColumns = Math.floor(screenWidth / 50);
      const minColumns = Math.max(1, Math.floor(screenWidth / 240));
      const calculatedColumns = Math.round(
        maxColumns - (scale / 100) * (maxColumns - minColumns)
      );
      setImagesPerRow(calculatedColumns);
    };

    updateGrid();
    window.addEventListener("resize", updateGrid);

    return () => window.removeEventListener("resize", updateGrid);
  }, [scale]);

   // Bildhöhe in Abhängigkeit von Spaltenanzahl
  const imageHeight = Math.round((window.innerWidth / imagesPerRow) * 0.75);

  // Beschreibung asynchron beim Öffnen des Tooltips nachladen
  const handleTooltipOpen = async (id: string) => {
    if (!descriptions[id]) {
      const desc = await fetchImageDescription(id);
      setDescriptions((prev) => ({ ...prev, [id]: desc }));
    }
  };

  return (
    <Grid container spacing={1} columns={imagesPerRow} p={2}>
      {imageList.map((img, index) => {
        const isSelected = selectedImageIds.includes(img.id);

        return (
          <Grid item key={index} xs={1}>
            <Box position="relative">
              {showCheckboxes && (
                <Checkbox
                  checked={isSelected}
                  onChange={() => toggleImageSelection(img.id)}
                  sx={{
                    position: "absolute",
                    top: 6,
                    left: 6,
                    zIndex: 2,
                    backgroundColor: "white",
                    borderRadius: "2px",
                    padding: "1px",
                    "& .MuiSvgIcon-root": {
                      fontSize: `${scale * 0.2 + 10}px`, // 🎯 Dynamische Größe wie im alten Code
                    },
                  }}
                />
              )}

              {/* Bildkarte mit Tooltip */}
              <Tooltip
                title={descriptions[img.id] || "Beschreibung wird geladen..."}
                arrow
                onOpen={() => handleTooltipOpen(img.id)}
              >
                <Card
                  onClick={() => navigate(`/image/${img.id}`)}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "8px",
                    overflow: "hidden",
                    width: "100%",
                    height: imageHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: mode === "dark" ? "#333" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  <CardMedia
                    component="img"
                    src={img.src}
                    alt={`Bild ${img.id}`}
                    loading="lazy"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Card>
              </Tooltip>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default memo(ImageGrid);

/*
FilterSection.tsx beinhaltet eine vielseitige Filterleiste für eine Bild- oder Datengalerie.
Sie erlaubt:
- die kombinierte Filterung nach Tags, Kommentaren und Farben,
- das Umschalten zwischen AND/OR-Logik für die Tag-Filterung,
- die Einstellung eines Zoom- oder Skalierungswerts der Bilder per Slider.
Zudem wird die Benutzeroberfläche dynamisch an den Dark- oder Light-Mode angepasst
und unterstützt Mehrsprachigkeit über ein zentrales Übersetzungsobjekt.
*/
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  TextField,
  Typography,
  Switch,
  IconButton,
  Slider,
  Tooltip,
  Popover,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import translations from "../translations";
import { useLanguageStore } from "../store/useLanguageStore";
import { useState } from "react";

// Farbdefinitionen für das Farbauswahl-Popover
const PRIMARY_COLOR_LABELS = [
  { key: "Rot", label: 0, color: "#F44336" },
  { key: "Orange/Gelb", label: 1, color: "#FFB74D" },
  { key: "Grün", label: 2, color: "#66BB6A" },
  { key: "Türkis/Blau", label: 3, color: "#4FC3F7" },
  { key: "Rosa/Magenta", label: 4, color: "#E040FB" },
];

// Props-Definition für die Komponente
interface FilterSectionProps {
  mode: "light" | "dark";
  selectedTags: string[];
  handleTagChange: (event: any) => void;
  comment: string;
  setComment: (value: string) => void;
  tags: { id: number; name: string; count: number }[];
  scale: number;
  setScale: (value: number) => void;
  selectedColorName: string | null;
  setSelectedColorName: (color: string | null) => void;
  toggleColorFilter: (name: string) => void;
  useAndOperator: boolean;
  setUseAndOperator: (value: boolean) => void;
}

// Hauptkomponente
const FilterSection = ({
  mode,
  selectedTags,
  handleTagChange,
  comment,
  setComment,
  scale,
  setScale,
  selectedColorName,
  toggleColorFilter,
  useAndOperator,
  setUseAndOperator,
  tags,
}: FilterSectionProps) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Popover öffnen
  const handleOpenPalette = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Popover schliessen
  const handleClosePalette = () => {
    setAnchorEl(null);
  };

  // Übersetzung des Farbnamens (für Tooltip)
  const translatedColorName = (key: string) =>
    t.colors[key as keyof typeof t.colors] || key;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      p={2}
      width="100%"
      flexWrap="wrap"
    >
      {/* AND/OR-Schalter für Tag-Filter */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        flexShrink={0}
        gap={1}
      >
        <Typography>{t.or}</Typography>
        <Switch
          checked={useAndOperator}
          onChange={() => setUseAndOperator(!useAndOperator)}
          color="primary"
          sx={{
            "& .MuiSwitch-thumb": {
              backgroundColor: mode === "dark" ? "#fff" : undefined,
            },
            "& .MuiSwitch-track": {
              backgroundColor: mode === "dark" ? "#888" : undefined,
            },
          }}
        />
        <Typography>{t.and}</Typography>
      </Box>

      {/* Tag-Filter mit Mehrfachauswahl */}
      <Box display="flex" alignItems="center" gap={1} flex={1}>
        <FormControl sx={{ flex: 1, width: "100%" }}>
          <InputLabel sx={{ color: mode === "dark" ? "#fff" : "#000" }}>
            {t.filterByTag}
          </InputLabel>
          <Select
            multiple
            value={selectedTags || []}
            onChange={handleTagChange}
            input={<OutlinedInput label={t.filterByTag} />}
            renderValue={(selected) => selected.join(", ")}
            sx={{
              backgroundColor: mode === "dark" ? "#333" : "#fff",
              color: mode === "dark" ? "#fff" : "#000",
            }}
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.name}>
                <Checkbox checked={selectedTags.includes(tag.name)} />
                <ListItemText primary={`${tag.name} (${tag.count})`} />{" "}
                {/* ✅ count wird angezeigt */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Kommentarfeld zur Filterung nach Beschreibung und Kommentare*/}
      <TextField
        label={t.filterByComment}
        variant="outlined"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ flex: 1, width: "100%" }}
      />

      {/* Zoom-Slider zur Grössenanpassung */}
      <Tooltip title={t.sliderTooltip}>
        <Slider
          value={scale}
          min={0}
          max={100}
          step={5}
          onChange={(_, newValue) => setScale(newValue as number)}
          sx={{
            width: 100,
            ml: 1,
            color: mode === "dark" ? "#fff" : "primary.main",
          }}
        />
      </Tooltip>

      {/* Farbauswahl mit Popover-Button */}
      <Box display="flex" alignItems="center" gap={1}>
        <Tooltip
          title={
            selectedColorName
              ? `${t.activeColorTooltip} ${selectedColorName}`
              : t.colorTooltip
          }
        >
          <IconButton onClick={handleOpenPalette}>
            <PaletteIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        {/* Popover mit farbigen Auswahlbuttons für Farbfilterung*/}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClosePalette}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: 3,
            },
          }}
        >
          <Box display="flex" gap={1.5} p={2}>
            {PRIMARY_COLOR_LABELS.map(({ key, color }) => (
              <Tooltip key={key} title={translatedColorName(key)}>
                <IconButton
                  onClick={() => {
                    toggleColorFilter(translatedColorName(key));
                    handleClosePalette();
                  }}
                  sx={{
                    backgroundColor: color,
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border:
                      selectedColorName === translatedColorName(key)
                        ? "2px solid black"
                        : "none",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Popover>
      </Box>
    </Box>
  );
};

export default FilterSection;

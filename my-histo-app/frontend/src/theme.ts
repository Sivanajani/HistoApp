/*
theme.ts definiert die beiden MUI-Themes (Light und Dark) für die gesamte Anwendung.

Funktionen:
- Legt Farben für Primärfarbe, Hintergrund und Text fest
- Wird in App.tsx via ThemeProvider verwendet, um je nach Modus das passende Theme anzuwenden
*/
import { createTheme } from "@mui/material/styles";

// Helles Theme (Default)
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#555555" },
    background: { default: "#f5f5f5", paper: "#fff" },
    text: { primary: "#000" },
  },
});

// Dunkles Theme
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#222" },
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#fff" },
  },
});

/*
App.tsx ist der Einstiegspunkt der React-Anwendung.
Funktionen:
- Verwaltet global den Dark-/Light-Mode mit useState
- Wendet das entsprechende MUI-Theme via ThemeProvider an
- Aktiviert den globalen CSS-Reset (CssBaseline)
- Nutzt React Router für das Routing (BrowserRouter)
- Übergibt Theme-Informationen an das AppShell-Layout

Diese Komponente initialisiert die ganze App und kümmert sich um Theme und Routing.
*/
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import { darkTheme, lightTheme } from "./theme";
import AppShell from "./AppShell";
import { useState } from "react";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <AppShell initialMode={mode} setMode={setMode} />
      </Router>
    </ThemeProvider>
  );
}

export default App;

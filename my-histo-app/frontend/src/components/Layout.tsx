/*
Layout.tsx ist die übergeordnete Layout-Komponente der Anwendung.
Sie definiert:
- den Hintergrund je nach Light- oder Dark-Mode
- eine minimale Höhe von 100vh, damit der gesamte Bildschirm ausgefüllt wird
- die Positionierung der Kinderkomponenten via {children}
Diese Komponente bildet die Basis für Seitenstruktur und Styling.
*/
import { Box } from "@mui/material";

// Props: Kinderkomponenten und aktueller Modus (hell oder dunkel)
interface LayoutProps {
  children: React.ReactNode;
  mode: "light" | "dark";
}

// Hauptkomponente
const Layout = ({ children, mode }: LayoutProps) => {
  return (
    <Box
      sx={{
        bgcolor: mode === "dark" ? "#121212" : "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {children}
    </Box>
  );
};

export default Layout;

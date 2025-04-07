/*
Footer.tsx stellt den unteren Seitenrand der Anwendung dar.
Er zeigt zentriert ein Copyright mit dem aktuellen Jahr.
Das Layout passt sich abhängig vom Light/Dark-Mode farblich an.
*/
import { Box, Typography } from "@mui/material";

// Komponente Footer mit Light-/Dark-Mode-unterstützung
const Footer = ({ mode }: { mode: "light" | "dark" }) => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        textAlign: "center",
        padding: "10px",
        backgroundColor: mode === "dark" ? "#222" : "#f5f5f5",
        color: mode === "dark" ? "#fff" : "#000",
        position: "responsive",
        bottom: 0,
        left: 0,
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} My-Histo-App
      </Typography>
    </Box>
  );
};

export default Footer;

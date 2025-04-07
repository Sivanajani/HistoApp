/*
Navbar.tsx ist die Navigationsleiste der Anwendung.
Sie enthält:
- das App-Logo und den Titel ("My-Histo-App")
- einen Sprachumschalter (DE/FR/EN)
- einen Toggle für Light/Dark Mode
- ein Benutzer-Icon mit Logout-Funktion
Die Sprache und der Modus werden über zentrale Stores (Zustand) verwaltet.
Keycloak wird für Authentifizierung und Logout verwendet.
*/
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightlightIcon from "@mui/icons-material/Nightlight";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TranslateIcon from "@mui/icons-material/Translate";
import { useState, useCallback } from "react";
import { useLanguageStore } from "../store/useLanguageStore";
import keycloak from "../keycloak/KeycloakService";
import Logo from "../assets/LOGO.svg";

// Typdefinition für Sprachcodes
type LanguageCode = "DE" | "FR" | "EN";

// Props der Navbar-Komponente
interface NavbarProps {
  toggleMode: () => void;
  mode: "light" | "dark";
  logout: () => void;
}

// Hauptkomponente
const Navbar = ({ toggleMode, mode }: NavbarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [languageMenuAnchor, setLanguageMenuAnchor] =
    useState<null | HTMLElement>(null);

  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const menuOpen = Boolean(anchorEl);

  // Öffnen des Benutzer-Menüs
  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  // Schliessen des Benutzer-Menüs
  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // Sprachmenü öffnen
  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

   // Sprachmenü schliessen
  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  // Verfügbare Sprachen
  const availableLanguages: LanguageCode[] = ["DE", "FR", "EN"];

  // Logout via Keycloak
  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <AppBar position="static" color="primary" sx={{ width: "100vw" }}>
      <Toolbar>
        {/* Logo und Titel */}
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <img src={Logo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
          <Typography variant="h6">My-Histo-App</Typography>
        </Box>

        {/* Sprachwahl-Menü */}
        <IconButton
          sx={{ ml: 2 }}
          color="inherit"
          onClick={handleLanguageMenuOpen}
        >
          <TranslateIcon />
        </IconButton>
        <Menu
          anchorEl={languageMenuAnchor}
          open={Boolean(languageMenuAnchor)}
          onClose={handleLanguageMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {availableLanguages.map((lang) => (
            <MenuItem
              key={lang}
              selected={lang === language}
              onClick={() => {
                setLanguage(lang);
                handleLanguageMenuClose();
              }}
            >
              {lang}
            </MenuItem>
          ))}
        </Menu>

        {/* Light/Dark Mode Umschalter */}
        <IconButton sx={{ ml: 2 }} color="inherit" onClick={toggleMode}>
          {mode === "dark" ? (
            <WbSunnyIcon sx={{ color: "yellow" }} />
          ) : (
            <NightlightIcon />
          )}
        </IconButton>

        {/* Benutzer-Menü mit Logout */}
        <IconButton sx={{ ml: 2 }} color="inherit" onClick={handleMenuOpen}>
          <AccountCircleIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
          <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

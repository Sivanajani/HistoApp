/*
useLanguageStore.ts verwaltet die aktuell gewählte Sprache der Anwendung.
Dabei wird das Zustand-Management-Tool "zustand" verwendet.

Funktionen:
- Speichert den aktuellen Sprachcode (DE, FR, EN)
- Stellt eine Methode zur Verfügung, um die Sprache zu ändern (setLanguage)
- Wird in Komponenten verwendet, um Texte je nach gewählter Sprache anzuzeigen
*/
import { create } from "zustand";

// Typdefinition für zulässige Sprachcodes
export type LanguageCode = "DE" | "FR" | "EN";

// Zustandstyp für Sprache inklusive Setter-Funktion
interface LanguageState {
  language: LanguageCode; // Aktuell gewählte Sprache
  setLanguage: (lang: LanguageCode) => void;
}

// Store-Definition mit Initialwert "DE" (Deutsch)
export const useLanguageStore = create<LanguageState>((set) => ({
  language: "DE",
  setLanguage: (lang) => set({ language: lang }),
}));

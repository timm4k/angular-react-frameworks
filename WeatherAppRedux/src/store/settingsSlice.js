import { createSlice } from "@reduxjs/toolkit";

export const STORAGE_KEY = "weatherAppSettings";

export const initialState = {
  theme: {
    background: null,
    text: null,
  },
  favoriteCities: [],
};

function readStoredSettings() {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Failed to read settings", error);
    return null;
  }
}

function parseCities(stored) {
  if (Array.isArray(stored.favoriteCities)) {
    return stored.favoriteCities
      .filter((city) => typeof city === "string")
      .map((city) => city.trim())
      .filter(Boolean);
  }
  if (typeof stored.favoriteCity === "string" && stored.favoriteCity.trim()) {
    return [stored.favoriteCity.trim()];
  }
  return [];
}

export function loadSettings() {
  const stored = readStoredSettings();
  if (!stored || typeof stored !== "object") return initialState;

  const theme =
    stored.theme && typeof stored.theme === "object" ? stored.theme : {};
  return {
    theme: {
      background:
        typeof theme.background === "string" ? theme.background : null,
      text: typeof theme.text === "string" ? theme.text : null,
    },
    favoriteCities: parseCities(stored),
  };
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setBackground(state, action) {
      state.theme.background = action.payload;
    },
    setText(state, action) {
      state.theme.text = action.payload;
    },
    applyTheme(state, action) {
      state.theme.background = action.payload.background;
      state.theme.text = action.payload.text;
    },
    resetTheme(state) {
      state.theme = { background: null, text: null };
    },
    addFavoriteCity(state, action) {
      const city = action.payload.trim();
      if (!city) return;
      const exists = state.favoriteCities.some(
        (c) => c.toLowerCase() === city.toLowerCase(),
      );
      if (!exists) state.favoriteCities.push(city);
    },
    removeFavoriteCity(state, action) {
      state.favoriteCities = state.favoriteCities.filter(
        (c) => c.toLowerCase() !== action.payload.toLowerCase(),
      );
    },
  },
});

export const {
  setBackground,
  setText,
  applyTheme,
  resetTheme,
  addFavoriteCity,
  removeFavoriteCity,
} = settingsSlice.actions;

export const selectSettings = (state) => state.settings;

export default settingsSlice.reducer;

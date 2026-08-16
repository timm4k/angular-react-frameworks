import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./weatherSlice.js";
import settingsReducer, { loadSettings, STORAGE_KEY } from "./settingsSlice.js";

export function createAppStore() {
  const store = configureStore({
    reducer: {
      weather: weatherReducer,
      settings: settingsReducer,
    },
    preloadedState: {
      settings: loadSettings(),
    },
  });

  if (typeof localStorage !== "undefined") {
    store.subscribe(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(store.getState().settings),
        );
      } catch (error) {
        console.warn("Failed to persist settings", error);
      }
    });
  }

  return store;
}

export const store = createAppStore();

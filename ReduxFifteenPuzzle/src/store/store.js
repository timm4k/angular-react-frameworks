import { configureStore } from "@reduxjs/toolkit";
import puzzleSlice, { STORAGE_KEY } from "./puzzleSlice.js";

export const store = configureStore({
  reducer: {
    puzzle: puzzleSlice.reducer,
  },
});

store.subscribe(() => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(store.getState().puzzle.statistics),
  );
});

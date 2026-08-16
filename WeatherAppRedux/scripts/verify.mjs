import assert from "node:assert/strict";
import { configureStore } from "@reduxjs/toolkit";
import {
  formatLocalTime,
  isDaytime,
  localDateKey,
} from "../src/utils/weather.js";
import {
  normalizeForecast,
  normalizeWeather,
} from "../src/services/openWeather.js";
import weatherReducer, { fetchWeather } from "../src/store/weatherSlice.js";
import settingsReducer, {
  addFavoriteCity,
  loadSettings,
  removeFavoriteCity,
  setBackground,
  STORAGE_KEY,
} from "../src/store/settingsSlice.js";

let passed = 0;

async function check(name, fn) {
  await fn();
  passed += 1;
  console.log(`PASS ${name}`);
}

await check("formatLocalTime shifts by timezone offset", () => {
  assert.equal(formatLocalTime(6 * 3600 + 30 * 60, 0), "06:30");
  assert.equal(formatLocalTime(6 * 3600 + 30 * 60, 10800), "09:30");
  assert.equal(formatLocalTime(6 * 3600 + 30 * 60, -7200), "04:30");
  assert.equal(formatLocalTime(3 * 3600 + 5 * 60 + 59, -3600), "02:05");
});

await check("isDaytime respects sunrise/sunset boundaries", () => {
  assert.equal(isDaytime(12, 6, 18), true);
  assert.equal(isDaytime(6, 6, 18), true);
  assert.equal(isDaytime(18, 6, 18), false);
  assert.equal(isDaytime(5, 6, 18), false);
  assert.equal(isDaytime(20, 6, 18), false);
});

await check("localDateKey reflects the city timezone", () => {
  assert.equal(localDateKey(0, 0), "1970-01-01");
  assert.equal(localDateKey(2 * 3600 + 30 * 60, -3600), "1970-01-01");
  assert.equal(localDateKey(24 * 3600, 0), "1970-01-02");
  assert.equal(localDateKey(23 * 3600, 3600), "1970-01-02");
});

await check("normalizeWeather maps api fields", () => {
  const data = normalizeWeather({
    name: "Kyiv",
    sys: { country: "UA", sunrise: 100, sunset: 200 },
    main: { temp: 21.6, feels_like: 19.4, humidity: 62, pressure: 1013 },
    weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
    wind: { speed: 3.1 },
    timezone: 10800,
    dt: 1700000000,
  });
  assert.equal(data.city, "Kyiv");
  assert.equal(data.country, "UA");
  assert.equal(data.temperature, 22);
  assert.equal(data.feelsLike, 19);
  assert.equal(data.humidity, 62);
  assert.equal(data.pressure, 1013);
  assert.equal(data.windSpeed, 3.1);
  assert.equal(data.sunrise, 100);
  assert.equal(data.sunset, 200);
  assert.equal(data.icon, "01d");
});

await check("normalizeForecast maps forecast fields", () => {
  const data = normalizeForecast({
    city: { name: "Kyiv", country: "UA", timezone: 10800 },
    list: [
      {
        dt: 0,
        main: { temp: 20.5, temp_min: 18, temp_max: 22 },
        weather: [{ main: "Clouds", icon: "03d" }],
      },
      {
        dt: 10800,
        main: { temp: 23, temp_min: 19, temp_max: 24 },
        weather: [{ main: "Clear", icon: "01d" }],
      },
    ],
  });
  assert.equal(data.city, "Kyiv");
  assert.equal(data.timezone, 10800);
  assert.equal(data.list.length, 2);
  assert.equal(data.list[0].temperature, 21);
  assert.equal(data.list[1].min, 19);
  assert.equal(data.list[1].icon, "01d");
});

await check(
  "weather reducer reports missing-key error without api key",
  async () => {
    const store = configureStore({ reducer: { weather: weatherReducer } });
    await store.dispatch(fetchWeather({ city: "Kyiv" }));
    const { status, error } = store.getState().weather;
    assert.equal(status, "error");
    assert.equal(error.code, "missing-key");
  },
);

await check("loadSettings falls back to defaults without storage", () => {
  const loaded = loadSettings();
  assert.equal(loaded.theme.background, null);
  assert.equal(loaded.theme.text, null);
  assert.deepEqual(loaded.favoriteCities, []);
});

await check("favorite cities add, dedupe and remove case-insensitively", () => {
  const store = configureStore({ reducer: { settings: settingsReducer } });
  store.dispatch(addFavoriteCity("Kyiv"));
  store.dispatch(addFavoriteCity("kyiv"));
  store.dispatch(addFavoriteCity(" Lviv "));
  assert.deepEqual(store.getState().settings.favoriteCities, ["Kyiv", "Lviv"]);
  store.dispatch(removeFavoriteCity("KYIV"));
  assert.deepEqual(store.getState().settings.favoriteCities, ["Lviv"]);
});

await check("loadSettings migrates old single-favorite format", () => {
  globalThis.localStorage = {
    getItem: () => JSON.stringify({ favoriteCity: "Odessa" }),
    setItem: () => {},
    removeItem: () => {},
  };
  const loaded = loadSettings();
  assert.deepEqual(loaded.favoriteCities, ["Odessa"]);
});

await check("store persists and restores settings", async () => {
  const memory = new Map();
  globalThis.localStorage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => memory.set(key, String(value)),
    removeItem: (key) => memory.delete(key),
  };
  const { createAppStore } = await import("../src/store/store.js");

  const first = createAppStore();
  first.dispatch(setBackground("#ff0000"));
  first.dispatch(addFavoriteCity("Kyiv"));
  first.dispatch(addFavoriteCity("Lviv"));
  const stored = JSON.parse(memory.get(STORAGE_KEY));
  assert.equal(stored.theme.background, "#ff0000");
  assert.deepEqual(stored.favoriteCities, ["Kyiv", "Lviv"]);

  const second = createAppStore();
  assert.equal(second.getState().settings.theme.background, "#ff0000");
  assert.deepEqual(second.getState().settings.favoriteCities, ["Kyiv", "Lviv"]);
});

console.log(`\nAll ${passed} checks passed`);

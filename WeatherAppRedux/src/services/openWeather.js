export class WeatherError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "WeatherError";
    this.code = code;
  }
}

const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const ICON_URL = "https://openweathermap.org/img/wn/";

export function iconUrl(code) {
  return `${ICON_URL}${code}@2x.png`;
}

function getApiKey() {
  const key = import.meta.env?.VITE_OPENWEATHER_API_KEY;
  if (!key) {
    throw new WeatherError(
      `OpenWeather API key is missing.
Open openweathermap.org/api, sign up for free, and copy your key from the API Keys tab.
Create a .env file in the project folder with VITE_OPENWEATHER_API_KEY=your-key and restart the dev server.
A newly created key activates within about 10 minutes`,
      "missing-key",
    );
  }
  return key;
}

function buildUrl(endpoint, city, country, key) {
  const place =
    encodeURIComponent(city) +
    (country ? `,${encodeURIComponent(country)}` : "");
  return `${endpoint}?q=${place}&units=metric&appid=${key}`;
}

async function requestJson(url) {
  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new WeatherError("Network error. Check your connection", "network");
  }
  if (response.status === 401) {
    throw new WeatherError("Invalid API key", "unauthorized");
  }
  if (response.status === 404) {
    throw new WeatherError(
      "Place not found. Check the city or country",
      "not-found",
    );
  }
  if (!response.ok) {
    throw new WeatherError(
      `Weather request failed (${response.status})`,
      "request-failed",
    );
  }
  return response.json();
}

export async function getWeather({ city, country }) {
  const key = getApiKey();
  const url = buildUrl(CURRENT_URL, city, country, key);
  return normalizeWeather(await requestJson(url));
}

export async function getForecast({ city, country }) {
  const key = getApiKey();
  const url = buildUrl(FORECAST_URL, city, country, key);
  return normalizeForecast(await requestJson(url));
}

export function normalizeWeather(data) {
  return {
    city: data.name,
    country: data.sys?.country ?? "",
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    condition: data.weather?.[0]?.main ?? "Unknown",
    description: data.weather?.[0]?.description ?? "",
    icon: data.weather?.[0]?.icon ?? "",
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    sunrise: data.sys?.sunrise ?? 0,
    sunset: data.sys?.sunset ?? 0,
    timezone: data.timezone ?? 0,
    timestamp: data.dt ?? 0,
  };
}

export function normalizeForecast(data) {
  return {
    city: data.city?.name ?? "",
    country: data.city?.country ?? "",
    timezone: data.city?.timezone ?? 0,
    list: (data.list ?? []).map((item) => ({
      timestamp: item.dt ?? 0,
      temperature: Math.round(item.main?.temp ?? 0),
      min: Math.round(item.main?.temp_min ?? 0),
      max: Math.round(item.main?.temp_max ?? 0),
      condition: item.weather?.[0]?.main ?? "Unknown",
      icon: item.weather?.[0]?.icon ?? "",
    })),
  };
}

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSettings } from "./store/settingsSlice.js";
import CityForm from "./components/CityForm.jsx";
import WeatherCard from "./components/WeatherCard.jsx";
import Forecast from "./components/Forecast.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import styles from "./styles/App.module.css";

export default function App() {
  const settings = useSelector(selectSettings);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme.background) {
      root.style.setProperty("--bg", settings.theme.background);
    } else {
      root.style.removeProperty("--bg");
    }
    if (settings.theme.text) {
      root.style.setProperty("--text", settings.theme.text);
    } else {
      root.style.removeProperty("--text");
    }
  }, [settings.theme.background, settings.theme.text]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Weather</h1>
        <p className={styles.subtitle}>
          Current conditions, sunrise and sunset
        </p>
      </header>
      <CityForm />
      <div className={styles.columns}>
        <div className={styles.main}>
          <WeatherCard />
          <Forecast />
        </div>
        <SettingsPanel />
      </div>
    </div>
  );
}

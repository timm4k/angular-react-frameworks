import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather } from "../store/weatherSlice.js";
import {
  addFavoriteCity,
  applyTheme,
  removeFavoriteCity,
  resetTheme,
  selectSettings,
  setBackground,
  setText,
} from "../store/settingsSlice.js";
import { PALETTES } from "../utils/palettes.js";
import { resolveCssToken } from "../utils/theme.js";
import styles from "../styles/SettingsPanel.module.css";

export default function SettingsPanel() {
  const dispatch = useDispatch();
  const { theme, favoriteCities } = useSelector(selectSettings);
  const [draft, setDraft] = useState("");

  const background = theme.background ?? resolveCssToken("--bg");
  const text = theme.text ?? resolveCssToken("--text");
  const isDefaultTheme = !theme.background && !theme.text;

  const handlePreset = (palette) => {
    dispatch(
      applyTheme({ background: palette.background, text: palette.text }),
    );
  };

  const handleAddFavorite = (event) => {
    event.preventDefault();
    const city = draft.trim();
    if (!city) return;
    dispatch(addFavoriteCity(city));
    setDraft("");
  };

  const loadCity = (city) => dispatch(fetchWeather({ city }));

  const isActivePalette = (palette) =>
    palette.background === background && palette.text === text;

  return (
    <div className={`panel ${styles.panel}`}>
      <h2 className={styles.title}>Settings</h2>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Color scheme</h3>
        <div className={styles.swatches}>
          {PALETTES.map((palette) => (
            <button
              key={palette.label}
              type="button"
              className={`${styles.swatch} ${isActivePalette(palette) ? styles.swatchActive : ""}`}
              style={{ background: palette.background }}
              title={palette.label}
              aria-label={`Use ${palette.label} colors`}
              onClick={() => handlePreset(palette)}
            />
          ))}
        </div>
        <div className={styles.colorRow}>
          <label htmlFor="background-color">Background</label>
          <input
            id="background-color"
            type="color"
            className={styles.colorInput}
            value={background}
            onChange={(event) => dispatch(setBackground(event.target.value))}
          />
        </div>
        <div className={styles.colorRow}>
          <label htmlFor="text-color">Text color</label>
          <input
            id="text-color"
            type="color"
            className={styles.colorInput}
            value={text}
            onChange={(event) => dispatch(setText(event.target.value))}
          />
        </div>
        <button
          type="button"
          className="buttonGhost"
          onClick={() => dispatch(resetTheme())}
          disabled={isDefaultTheme}
        >
          Reset colors
        </button>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Favorite cities</h3>
        <form className={styles.addRow} onSubmit={handleAddFavorite}>
          <input
            className={`input ${styles.addInput}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="City"
            aria-label="Favorite city"
          />
          <button type="submit" className="button">
            Add
          </button>
        </form>
        {favoriteCities.length > 0 ? (
          <ul className={styles.cityList}>
            {favoriteCities.map((city) => (
              <li key={city} className={styles.cityItem}>
                <button
                  type="button"
                  className={styles.cityButton}
                  onClick={() => loadCity(city)}
                >
                  {city}
                </button>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => dispatch(removeFavoriteCity(city))}
                  aria-label={`Remove ${city}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.hint}>Add cities to load them with one click</p>
        )}
        <p className={styles.hint}>
          Settings are saved automatically in this browser
        </p>
      </section>
    </div>
  );
}

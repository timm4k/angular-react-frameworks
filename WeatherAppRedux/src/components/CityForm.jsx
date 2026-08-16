import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather } from "../store/weatherSlice.js";
import styles from "../styles/CityForm.module.css";

export default function CityForm() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.weather.status);
  const favoriteCities = useSelector((state) => state.settings.favoriteCities);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [fieldError, setFieldError] = useState("");
  const didAutoLoad = useRef(false);
  const loading = status === "loading";

  useEffect(() => {
    const first = favoriteCities[0];
    if (!didAutoLoad.current && first) {
      didAutoLoad.current = true;
      dispatch(fetchWeather({ city: first }));
    }
  }, [favoriteCities, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setFieldError("Enter a city");
      return;
    }
    setFieldError("");
    dispatch(fetchWeather({ city: trimmedCity, country: country.trim() }));
  };

  return (
    <form className={`panel ${styles.form}`} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="city">
          City
        </label>
        <input
          id="city"
          className="input"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="e.g. Kyiv"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="country">
          Country (optional)
        </label>
        <input
          id="country"
          className="input"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          placeholder="e.g. Ukraine or UA"
          disabled={loading}
        />
      </div>
      <button className="button" type="submit" disabled={loading}>
        {loading ? "Checking..." : "Check weather"}
      </button>
      {fieldError && <p className={styles.error}>{fieldError}</p>}
    </form>
  );
}

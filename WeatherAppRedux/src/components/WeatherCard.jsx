import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { iconUrl } from "../services/openWeather.js";
import { formatLocalTime, isDaytime } from "../utils/weather.js";
import { SunIcon, MoonIcon } from "./icons.jsx";
import styles from "../styles/WeatherCard.module.css";

export default function WeatherCard() {
  const { current, status, error } = useSelector((state) => state.weather);
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(
      () => setNow(Math.floor(Date.now() / 1000)),
      30_000,
    );
    return () => clearInterval(timer);
  }, []);

  if (status === "idle") {
    return (
      <div className={`panel ${styles.statePanel}`}>
        <p>Pick a city to see today's weather</p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className={`panel ${styles.statePanel}`}>
        <div className={styles.spinner} aria-hidden="true" />
        <p>Loading weather...</p>
      </div>
    );
  }

  if (status === "error") {
    const lines = (error?.message ?? "Something went wrong").split("\n");
    return (
      <div className={`panel ${styles.statePanel}`}>
        {lines.map((line, index) => (
          <p
            key={index}
            className={index === 0 ? styles.errorTitle : styles.errorText}
          >
            {line}
          </p>
        ))}
      </div>
    );
  }

  if (!current) return null;

  const day = isDaytime(now, current.sunrise, current.sunset);

  return (
    <div className="panel">
      <div className={styles.top}>
        <div>
          <h2 className={styles.city}>
            {current.city}
            {current.country ? `, ${current.country}` : ""}
          </h2>
          <p className={styles.localTime}>
            Local time {formatLocalTime(now, current.timezone)}
          </p>
        </div>
        <span
          className={`${styles.badge} ${day ? styles.badgeDay : styles.badgeNight}`}
        >
          {day ? "Daytime" : "Nighttime"}
        </span>
      </div>

      <div className={styles.now}>
        {current.icon && (
          <img
            className={styles.icon}
            src={iconUrl(current.icon)}
            alt={current.description}
            width={80}
            height={80}
          />
        )}
        <div>
          <div className={styles.temp}>{current.temperature}°</div>
          <div className={styles.desc}>{current.description}</div>
        </div>
        <div className={day ? styles.daypart : styles.daypartNight}>
          {day ? <SunIcon /> : <MoonIcon />}
        </div>
      </div>

      <div className={styles.metrics}>
        <Metric label="Feels like" value={`${current.feelsLike}°`} />
        <Metric label="Humidity" value={`${current.humidity}%`} />
        <Metric label="Pressure" value={`${current.pressure} hPa`} />
        <Metric label="Wind" value={`${current.windSpeed} m/s`} />
      </div>

      <div className={styles.horizon}>
        <div className={styles.horizonCard}>
          <span className={styles.horizonIconSun}>
            <SunIcon size={20} />
          </span>
          <span>
            Sunrise{" "}
            <strong>
              {formatLocalTime(current.sunrise, current.timezone)}
            </strong>
          </span>
        </div>
        <div className={styles.horizonCard}>
          <span className={styles.horizonIconMoon}>
            <MoonIcon size={20} />
          </span>
          <span>
            Sunset{" "}
            <strong>{formatLocalTime(current.sunset, current.timezone)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className={styles.metric}>
      <span className={styles.metricLabel}>{label}</span>
      <span className={styles.metricValue}>{value}</span>
    </div>
  );
}

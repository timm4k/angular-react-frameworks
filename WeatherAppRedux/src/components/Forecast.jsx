import { useState } from "react";
import { useSelector } from "react-redux";
import { iconUrl } from "../services/openWeather.js";
import {
  formatLocalTime,
  localDateKey,
  localDateParts,
} from "../utils/weather.js";
import styles from "../styles/Forecast.module.css";

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MIN_BAR_HEIGHT = 15;
const MAX_BAR_HEIGHT = 100;
const BAR_RANGE = MAX_BAR_HEIGHT - MIN_BAR_HEIGHT;
const NOON_HOUR = 12;
const DAYS_TO_SHOW = 5;

export default function Forecast() {
  const forecast = useSelector((state) => state.weather.forecast);
  const current = useSelector((state) => state.weather.current);
  const [selectedDay, setSelectedDay] = useState(null);
  if (!forecast || forecast.list.length === 0) return null;

  const timezone = forecast.timezone;
  const now = Math.floor(Date.now() / 1000);
  const todayKey = localDateKey(now, timezone);

  const groups = new Map();
  for (const point of forecast.list) {
    const key = localDateKey(point.timestamp, timezone);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(point);
  }

  const todayPoints = groups.get(todayKey) ?? [];
  const todayChart =
    todayPoints.length > 0
      ? todayPoints
      : current
        ? [
            {
              timestamp: current.timestamp,
              temperature: current.temperature,
              icon: current.icon,
              condition: current.condition,
              isNow: true,
            },
          ]
        : [];
  const dayKeys = [...groups.keys()].filter((key) => key !== todayKey).sort();
  const days = dayKeys
    .slice(0, DAYS_TO_SHOW)
    .map((key) => summarizeDay(groups.get(key), timezone));

  const toggleDay = (key) =>
    setSelectedDay((current) => (current === key ? null : key));
  const selectedSummary = days.find((day) => day.key === selectedDay);

  return (
    <section className="panel">
      <h2 className={styles.title}>Forecast</h2>

      {todayChart.length > 0 && (
        <>
          <h3 className={styles.sectionTitle}>Today</h3>
          <PointsChart points={todayChart} timezone={timezone} />
        </>
      )}

      {days.length > 0 && (
        <>
          <h3 className={styles.sectionTitle}>Next {days.length} days</h3>
          <div className={styles.days}>
            {days.map((day) => {
              const open = selectedDay === day.key;
              return (
                <button
                  key={day.key}
                  type="button"
                  className={`${styles.day} ${open ? styles.dayActive : ""}`}
                  onClick={() => toggleDay(day.key)}
                  aria-expanded={open}
                >
                  <span className={styles.dayName}>{day.weekday}</span>
                  <span className={styles.dayDate}>{day.date}</span>
                  <img
                    className={styles.dayIcon}
                    src={iconUrl(day.icon)}
                    alt={day.condition}
                    width={44}
                    height={44}
                  />
                  <span className={styles.dayTemps}>
                    <span className={styles.dayMax}>{day.max}°</span>
                    <span className={styles.dayMin}>{day.min}°</span>
                  </span>
                  <span
                    className={`${styles.dayChevron} ${open ? styles.dayChevronOpen : ""}`}
                  >
                    ▾
                  </span>
                </button>
              );
            })}
          </div>

          {selectedDay && groups.has(selectedDay) && selectedSummary && (
            <div className={styles.dayDetail}>
              <div className={styles.dayDetailHeader}>
                <strong>{selectedSummary.weekday}</strong>
                <span>{selectedSummary.date}</span>
              </div>
              <PointsChart
                points={groups.get(selectedDay)}
                timezone={timezone}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}

function PointsChart({ points, timezone }) {
  const temps = points.map((point) => point.temperature);
  const minTemp = temps.length ? Math.min(...temps) : 0;
  const maxTemp = temps.length ? Math.max(...temps) : 0;
  const tempSpan = maxTemp - minTemp;

  return (
    <div className={styles.chart}>
      {points.map((point) => {
        const percent =
          tempSpan === 0
            ? MAX_BAR_HEIGHT
            : MIN_BAR_HEIGHT +
              ((point.temperature - minTemp) / tempSpan) * BAR_RANGE;
        return (
          <div key={point.timestamp} className={styles.chartColumn}>
            <span className={styles.chartTemp}>{point.temperature}°</span>
            <img
              className={styles.chartIcon}
              src={iconUrl(point.icon)}
              alt={point.condition}
              width={40}
              height={40}
            />
            <div className={styles.chartTrack}>
              <div
                className={styles.chartBar}
                style={{ height: `${percent}%` }}
              />
            </div>
            <span className={styles.chartTime}>
              {point.isNow ? "Now" : formatLocalTime(point.timestamp, timezone)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function summarizeDay(points, timezone) {
  const min = Math.min(...points.map((point) => point.min));
  const max = Math.max(...points.map((point) => point.max));
  const representative = [...points].sort(
    (a, b) =>
      Math.abs(localDateParts(a.timestamp, timezone).hours - NOON_HOUR) -
      Math.abs(localDateParts(b.timestamp, timezone).hours - NOON_HOUR),
  )[0];
  const parts = localDateParts(points[0].timestamp, timezone);
  return {
    key: localDateKey(points[0].timestamp, timezone),
    weekday: WEEKDAY_NAMES[parts.weekday],
    date: `${MONTH_NAMES[parts.month]} ${parts.day}`,
    min,
    max,
    icon: representative.icon,
    condition: representative.condition,
  };
}

import { useState } from "react";
import { useDispatch } from "react-redux";
import { startGame } from "../../store/puzzleSlice.js";
import { formatTime } from "../../utils/format.js";
import styles from "./SetupPanel.module.css";

const TIME_PRESETS = [30, 60, 120, 180];

export default function SetupPanel() {
  const dispatch = useDispatch();
  const [mode, setMode] = useState("free");
  const [targetSeconds, setTargetSeconds] = useState(60);

  const handleStart = () => {
    dispatch(startGame({ mode, timeLimit: targetSeconds * 1000 }));
  };

  const optionClass = (active) =>
    active ? `${styles.option} ${styles.optionActive}` : styles.option;

  return (
    <section className={`panel ${styles.panel}`}>
      <h2 className={styles.title}>New game</h2>
      <div className={styles.fieldGroup}>
        <span className={styles.label} id="mode-label">
          Mode
        </span>
        <div
          className={styles.segmented}
          role="radiogroup"
          aria-labelledby="mode-label"
        >
          <button
            type="button"
            className={optionClass(mode === "free")}
            aria-pressed={mode === "free"}
            onClick={() => setMode("free")}
          >
            No time limit
          </button>
          <button
            type="button"
            className={optionClass(mode === "timed")}
            aria-pressed={mode === "timed"}
            onClick={() => setMode("timed")}
          >
            Timed
          </button>
        </div>
      </div>
      {mode === "timed" && (
        <div className={styles.fieldGroup}>
          <span className={styles.label} id="time-label">
            Time limit
          </span>
          <div
            className={styles.presets}
            role="group"
            aria-labelledby="time-label"
          >
            {TIME_PRESETS.map((seconds) => (
              <button
                key={seconds}
                type="button"
                className={optionClass(targetSeconds === seconds)}
                aria-pressed={targetSeconds === seconds}
                onClick={() => setTargetSeconds(seconds)}
              >
                {formatTime(seconds)}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        type="button"
        className={styles.startButton}
        onClick={handleStart}
      >
        Start
      </button>{" "}
    </section>
  );
}

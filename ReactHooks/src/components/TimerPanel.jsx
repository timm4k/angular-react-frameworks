import { useState } from "react";
import Timer from "./Timer";
import styles from "../styles/Task.module.css";

function TimerPanel() {
  const [showTimer, setShowTimer] = useState(true);

  return (
    <article className={styles.card}>
      <span className={styles.number}>3.2</span>
      <p className={styles.eyebrow}>Listening booth</p>
      <h3>Session timer</h3>
      {showTimer ? (
        <Timer />
      ) : (
        <div className={styles.timerOff}>Session stopped</div>
      )}
      <button onClick={() => setShowTimer((current) => !current)}>
        {showTimer ? "End session" : "Start new session"}
      </button>
      <p className={styles.note}>The interval is cleared when hidden</p>
    </article>
  );
}

export default TimerPanel;

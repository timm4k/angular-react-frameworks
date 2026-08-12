import { useEffect, useState } from "react";
import styles from "../styles/Task.module.css";

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((current) => {
        const next = current + 1;
        console.log(`Listening booth timer: ${next}s`);
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.timer} role="timer" aria-live="off">
      {String(seconds).padStart(2, "0")}
      <small>SEC</small>
    </div>
  );
}

export default Timer;

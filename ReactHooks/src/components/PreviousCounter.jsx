import { useEffect, useRef, useState } from "react";
import styles from "../styles/Task.module.css";

function PreviousCounter() {
  const [count, setCount] = useState(5);
  const prevCount = useRef(count);

  useEffect(() => {
    prevCount.current = count;
  }, [count]);

  return (
    <article className={styles.card}>
      <span className={styles.number}>2.3</span>
      <p className={styles.eyebrow}>Stock desk</p>
      <h3>Track crate inventory</h3>
      <div className={styles.stock}>
        <div>
          <strong>{count}</strong>
          <span>Current</span>
        </div>
        <div>
          <strong>{prevCount.current}</strong>
          <span>Previous</span>
        </div>
      </div>
      <div className={styles.actions}>
        <button onClick={() => setCount((current) => current - 1)}>
          − Remove
        </button>
        <button onClick={() => setCount((current) => current + 1)}>
          ＋ Add
        </button>
      </div>
    </article>
  );
}

export default PreviousCounter;

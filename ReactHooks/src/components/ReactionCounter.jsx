import { useEffect, useState } from "react";
import styles from "../styles/Task.module.css";

function ReactionCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Reactions: ${count}`;
  }, [count]);

  return (
    <article className={styles.card}>
      <span className={styles.number}>1.2</span>
      <p className={styles.eyebrow}>Window display</p>
      <h3>Rate tonight’s selection</h3>
      <div className={styles.bigValue} aria-live="polite">{count}</div>
      <button onClick={() => setCount((current) => current + 1)}>
        Send a reaction
      </button>
      <p className={styles.note}>The browser tab follows every reaction</p>
    </article>
  );
}

export default ReactionCounter;

import { useRef } from "react";
import styles from "../styles/Task.module.css";

function SilentCounter() {
  const countRef = useRef(0);

  const inspectCrate = () => {
    countRef.current++;
    console.log(`Silent crate inspections: ${countRef.current}`);
  };

  return (
    <article className={styles.card}>
      <span className={styles.number}>1.3</span>
      <p className={styles.eyebrow}>Private crate</p>
      <h3>Inspect without a trace</h3>
      <div className={styles.crate} aria-hidden="true">
        <span>
          RARE
          <br />
          PRESSINGS
        </span>
      </div>
      <button onClick={inspectCrate}>Silent inspection</button>
      <p className={styles.note}>The value changes only in the console</p>
    </article>
  );
}

export default SilentCounter;

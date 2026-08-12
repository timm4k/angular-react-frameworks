import { useEffect } from "react";
import styles from "../styles/Task.module.css";

function ColorBox({ color, children }) {
  useEffect(() => {
    console.log(`Display color changed to: ${color}`);
  }, [color]);

  return (
    <article className={styles.card}>
      <span className={styles.number}>2.2</span>
      <p className={styles.eyebrow}>Display lights</p>
      <h3>Set the window mood</h3>
      <div className={styles.colorDisplay} style={{ "--display-color": color }}>
        <div className={styles.miniRecord}>
          <i />
        </div>
        <span>
          NOW
          <br />
          SPINNING
        </span>
      </div>
      {children}
      <p className={styles.note}>The effect runs only when the color changes</p>
    </article>
  );
}

export default ColorBox;

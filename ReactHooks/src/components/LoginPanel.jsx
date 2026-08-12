import { useEffect, useRef } from "react";
import styles from "../styles/Task.module.css";

function LoginPanel() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <article className={styles.card}>
      <span className={styles.number}>1.1</span>
      <p className={styles.eyebrow}>Staff entrance</p>
      <h3>Clock in for the night</h3>
      <form
        className={styles.form}
        onSubmit={(event) => event.preventDefault()}
      >
        <label>
          Staff login
          <input
            ref={inputRef}
            name="login"
            autoComplete="username"
            placeholder="night.clerk"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </label>
        <button type="submit">Enter the store</button>
      </form>
      <p className={styles.note}>The login field receives focus on mount</p>
    </article>
  );
}

export default LoginPanel;

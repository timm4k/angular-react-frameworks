import styles from "../styles/App.module.css";

function Level({ number, label, title, children }) {
  return (
    <section className={styles.level}>
      <header className={styles.levelHeader}>
        <span>{number}</span>
        <div>
          <p>{label}</p>
          <h2>{title}</h2>
        </div>
      </header>
      <div className={styles.tasks}>{children}</div>
    </section>
  );
}

export default Level;

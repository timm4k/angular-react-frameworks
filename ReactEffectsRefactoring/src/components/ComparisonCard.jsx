import styles from "../styles/Comparison.module.css";

function CodeBlock({ children }) {
  return (
    <pre className={styles.code}>
      <code>{children}</code>
    </pre>
  );
}

function Flow({ steps, good }) {
  return (
    <div
      className={good ? styles.goodFlow : styles.badFlow}
      aria-label={steps.join(" then ")}
    >
      {steps.map((step, index) => (
        <span key={step}>
          {step}
          {index < steps.length - 1 && <i>→</i>}
        </span>
      ))}
    </div>
  );
}

function ComparisonCard({
  number,
  title,
  badCode,
  goodCode,
  problem,
  solution,
  badFlow,
  goodFlow,
  children,
}) {
  return (
    <article className={styles.task}>
      <header className={styles.taskHeader}>
        <span>{number}</span>
        <h3>{title}</h3>
      </header>

      <div className={styles.compare}>
        <section className={styles.before} aria-labelledby={`before-${number}`}>
          <div className={styles.columnTitle}>
            <span>Before</span>
            <strong id={`before-${number}`}>Effect-driven</strong>
          </div>
          <Flow steps={badFlow} />
          <p>{problem}</p>
          <CodeBlock>{badCode}</CodeBlock>
        </section>

        <section className={styles.after} aria-labelledby={`after-${number}`}>
          <div className={styles.columnTitle}>
            <span>After</span>
            <strong id={`after-${number}`}>Direct and predictable</strong>
          </div>
          <Flow steps={goodFlow} good />
          <p>{solution}</p>
          <div className={styles.demo}>{children}</div>
          <CodeBlock>{goodCode}</CodeBlock>
        </section>
      </div>
    </article>
  );
}

export default ComparisonCard;

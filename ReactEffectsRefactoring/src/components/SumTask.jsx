import { useState } from "react";
import ComparisonCard from "./ComparisonCard";
import { snippets } from "../data/snippets";
import styles from "../styles/Demo.module.css";

function SumTask() {
  const [a, setA] = useState(8);
  const [b, setB] = useState(12);
  const sum = a + b;

  return (
    <ComparisonCard
      number="1.1"
      title="Sum calculator"
      badCode={snippets.sum.bad}
      goodCode={snippets.sum.good}
      problem="The result is stored twice: first in a and b, then again in sum. The effect forces a second render just to synchronize values React already knows"
      solution="Sum is derived during render. It is always current, needs no synchronization, and cannot drift out of date"
      badFlow={["Change A", "Render", "Effect", "Set sum", "Render"]}
      goodFlow={["Change A", "Calculate", "Render"]}
    >
      <div className={styles.numberGrid}>
        <label>
          A
          <input
            type="number"
            value={a}
            onChange={(event) => setA(Number(event.target.value))}
          />
        </label>
        <span>+</span>
        <label>
          B
          <input
            type="number"
            value={b}
            onChange={(event) => setB(Number(event.target.value))}
          />
        </label>
        <span>=</span>
        <output aria-live="polite">{sum}</output>
      </div>
    </ComparisonCard>
  );
}

export default SumTask;

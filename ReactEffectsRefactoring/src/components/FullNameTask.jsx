import { useState } from "react";
import ComparisonCard from "./ComparisonCard";
import { snippets } from "../data/snippets";
import styles from "../styles/Demo.module.css";

function FullNameTask() {
  const [firstName, setFirstName] = useState("Tom");
  const [lastName, setLastName] = useState("Keifer");
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <ComparisonCard
      number="1.3"
      title="Artist name"
      badCode={snippets.name.bad}
      goodCode={snippets.name.good}
      problem="fullName is not independent state. Keeping it separately creates two sources of truth and a delayed update"
      solution="A plain constant expresses the relationship directly: the displayed artist is always made from the two current fields"
      badFlow={["Edit name", "Render stale name", "Effect", "Render again"]}
      goodFlow={["Edit name", "Compose name", "Render"]}
    >
      <div className={styles.formRow}>
        <label>
          First name
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </label>
        <label>
          Last name
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </label>
      </div>
      <output className={styles.artist} aria-live="polite">
        {fullName || "Unknown artist"}
      </output>
    </ComparisonCard>
  );
}

export default FullNameTask;

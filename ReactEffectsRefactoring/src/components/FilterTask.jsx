import { useState } from "react";
import ComparisonCard from "./ComparisonCard";
import { snippets } from "../data/snippets";
import styles from "../styles/Demo.module.css";

const records = [
  "Night Songs",
  "Purple Rain",
  "Rumours",
  "Disintegration",
  "Grace",
];

function FilterTask() {
  const [query, setQuery] = useState("");
  const filtered = records.filter((record) =>
    record.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <ComparisonCard
      number="1.2"
      title="Catalog filter"
      badCode={snippets.filter.bad}
      goodCode={snippets.filter.good}
      problem="visibleItems duplicates information that can already be calculated from items and query. Every search change schedules another state update"
      solution="The filtered list is calculated from the current query during the same render. useMemo would only be useful for a genuinely expensive, large list"
      badFlow={["Type", "Render old list", "Effect", "Set list", "Render"]}
      goodFlow={["Type", "Filter", "Render"]}
    >
      <label className={styles.search}>
        Search the crate
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try Night"
        />
      </label>
      <ul className={styles.results} aria-live="polite">
        {filtered.map((record) => (
          <li key={record}>{record}</li>
        ))}
        {filtered.length === 0 && <li>No records found</li>}
      </ul>
    </ComparisonCard>
  );
}

export default FilterTask;

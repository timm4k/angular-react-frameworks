import { useDispatch, useSelector } from "react-redux";
import { resetStats, selectStats } from "../../store/puzzleSlice.js";
import { formatTime } from "../../utils/format.js";
import styles from "./StatsPanel.module.css";

const EMPTY_VALUE = "—";

export default function StatsPanel() {
  const dispatch = useDispatch();
  const stats = useSelector(selectStats);
  const hasRecords = stats.games > 0;

  const items = [
    { label: "Games", value: String(stats.games) },
    { label: "Wins", value: String(stats.wins) },
    { label: "Losses", value: String(stats.losses) },
    {
      label: "Shortest",
      value: hasRecords
        ? formatTime(Math.round(stats.shortest / 1000))
        : EMPTY_VALUE,
    },
    {
      label: "Longest",
      value: hasRecords
        ? formatTime(Math.round(stats.longest / 1000))
        : EMPTY_VALUE,
    },
    {
      label: "Average time",
      value: hasRecords
        ? formatTime(Math.round(stats.avgTime / 1000))
        : EMPTY_VALUE,
    },
    {
      label: "Fewest moves",
      value: hasRecords ? `${stats.minMoves} moves` : EMPTY_VALUE,
    },
    {
      label: "Most moves",
      value: hasRecords ? `${stats.maxMoves} moves` : EMPTY_VALUE,
    },
    {
      label: "Average moves",
      value: hasRecords ? `${stats.avgMoves} moves` : EMPTY_VALUE,
    },
  ];

  return (
    <aside className={`panel ${styles.panel}`} aria-label="Statistics">
      <div className={styles.header}>
        <h2 className={styles.title}>Statistics</h2>
        {hasRecords && (
          <button
            type="button"
            className={styles.reset}
            onClick={() => dispatch(resetStats())}
          >
            Reset
          </button>
        )}
      </div>
      {hasRecords ? (
        <dl className={styles.grid}>
          {items.map(({ label, value }) => (
            <div key={label} className={styles.item}>
              <dt className={styles.label}>{label}</dt>
              <dd className={styles.value}>{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className={styles.empty}>No completed games yet</p>
      )}
    </aside>
  );
}

import { useSelector } from "react-redux";
import { selectStatus } from "./store/puzzleSlice.js";
import SetupPanel from "./components/SetupPanel/SetupPanel.jsx";
import GamePanel from "./components/GamePanel/GamePanel.jsx";
import StatsPanel from "./components/StatsPanel/StatsPanel.jsx";
import styles from "./App.module.css";

export default function App() {
  const status = useSelector(selectStatus);
  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1 className={styles.appTitle}>Fifteen Puzzle</h1>
      </header>
      <main className={styles.appMain}>
        <section>{status === "idle" ? <SetupPanel /> : <GamePanel />}</section>
        <StatsPanel />
      </main>
    </div>
  );
}

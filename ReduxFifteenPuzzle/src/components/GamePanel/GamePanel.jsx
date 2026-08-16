import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  autoStep,
  selectElapsed,
  selectIsAutoSolving,
  selectMode,
  selectMoves,
  selectRemaining,
  selectStatus,
  selectTimeLimit,
  startAutoSolve,
  startGame,
  stopAutoSolve,
  tick,
  toMenu,
} from "../../store/puzzleSlice.js";
import { formatTimer } from "../../utils/format.js";
import Board from "../Board/Board.jsx";
import styles from "./GamePanel.module.css";

const TICK_MS = 200;
const AUTO_STEP_MS = 200;

export default function GamePanel() {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  const mode = useSelector(selectMode);
  const timeLimit = useSelector(selectTimeLimit);
  const elapsed = useSelector(selectElapsed);
  const remaining = useSelector(selectRemaining);
  const moves = useSelector(selectMoves);
  const isAutoSolving = useSelector(selectIsAutoSolving);

  useEffect(() => {
    if (status !== "playing" && status !== "auto-solving") return undefined;
    const id = setInterval(() => dispatch(tick()), TICK_MS);
    return () => clearInterval(id);
  }, [dispatch, status]);

  useEffect(() => {
    if (status !== "auto-solving") return undefined;
    const id = setInterval(() => dispatch(autoStep()), AUTO_STEP_MS);
    return () => clearInterval(id);
  }, [dispatch, status]);

  const isFinished = status === "won" || status === "lost";
  const isTimed = mode === "timed";

  const handleReplay = () => {
    dispatch(startGame({ mode, timeLimit }));
  };

  return (
    <section className={`panel ${styles.panel}`}>
      <div className={styles.statusbar}>
        <span className={styles.metric}>
          <span className={styles.metricLabel}>Time</span>
          {formatTimer(elapsed)}
        </span>
        <span className={styles.metric}>
          <span className={styles.metricLabel}>Moves</span>
          {moves}
        </span>
        <span className={styles.metric}>
          <span className={styles.metricLabel}>Mode</span>
          {isTimed ? formatTimer(timeLimit) : "No limit"}
        </span>
        {isTimed && (
          <span className={styles.metric}>
            <span className={styles.metricLabel}>Left</span>
            {formatTimer(remaining)}
          </span>
        )}
      </div>
      <div className={styles.boardWrap}>
        <Board disabled={isFinished} />
      </div>
      <div className={styles.actions}>
        {!isFinished && (
          <button
            type="button"
            className={
              isAutoSolving
                ? `${styles.actionButton} ${styles.autoActive}`
                : styles.actionButton
            }
            aria-pressed={isAutoSolving}
            onClick={() =>
              dispatch(isAutoSolving ? stopAutoSolve() : startAutoSolve())
            }
          >
            {isAutoSolving ? "Stop auto-solve" : "Auto-solve"}
          </button>
        )}
        <button
          type="button"
          className={styles.actionButton}
          onClick={() => dispatch(toMenu())}
        >
          Back to menu
        </button>
      </div>
      {isFinished && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-title"
        >
          <h3 id="result-title" className={styles.resultTitle}>
            {status === "won" ? "Solved!" : "Time is up"}
          </h3>
          <p className={styles.resultText} aria-live="polite">
            {status === "won"
              ? `Time: ${formatTimer(elapsed)} · Moves: ${moves}`
              : `Limit ${formatTimer(timeLimit)} expired`}
          </p>
          <button
            type="button"
            className={styles.replay}
            onClick={handleReplay}
          >
            Play again
          </button>
        </div>
      )}
    </section>
  );
}

import { useDispatch, useSelector } from "react-redux";
import {
  move,
  selectBoard,
  selectIsAutoSolving,
} from "../../store/puzzleSlice.js";
import {
  EMPTY_TILE,
  SIZE,
  adjacentIndices,
  findEmptyIndex,
} from "../../utils/puzzle.js";
import styles from "./Board.module.css";

export default function Board({ disabled }) {
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const isAutoSolving = useSelector(selectIsAutoSolving);

  const emptyIndex = findEmptyIndex(board);
  const movable = adjacentIndices(emptyIndex);

  const handleClick = (index) => {
    if (disabled || isAutoSolving || !movable.includes(index)) return;
    dispatch(move({ index }));
  };

  return (
    <div className={styles.board} role="grid" aria-label="Fifteen puzzle board">
      {board.map((value, index) => {
        const row = Math.floor(index / SIZE);
        const col = index % SIZE;
        if (value === EMPTY_TILE) {
          return (
            <div
              key="empty"
              className={styles.cell}
              style={{ "--row": row, "--col": col }}
              aria-hidden="true"
            />
          );
        }
        return (
          <button
            key={value}
            type="button"
            className={
              movable.includes(index) && !disabled && !isAutoSolving
                ? `${styles.tile} ${styles.movable}`
                : styles.tile
            }
            style={{ "--row": row, "--col": col }}
            aria-label={`Tile ${value}`}
            disabled={disabled || isAutoSolving}
            onClick={() => handleClick(index)}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}

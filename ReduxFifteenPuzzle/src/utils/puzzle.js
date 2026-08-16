export const SIZE = 4;
export const TILE_COUNT = SIZE * SIZE;
export const EMPTY_TILE = null;
export const SHUFFLE_STEPS = 150;

export function createSolvedBoard() {
  return Array.from({ length: TILE_COUNT }, (_, i) =>
    i === TILE_COUNT - 1 ? EMPTY_TILE : i + 1,
  );
}

export function findEmptyIndex(board) {
  return board.indexOf(EMPTY_TILE);
}

export function adjacentIndices(index) {
  const row = Math.floor(index / SIZE);
  const col = index % SIZE;
  const result = [];
  if (row > 0) result.push(index - SIZE);
  if (row < SIZE - 1) result.push(index + SIZE);
  if (col > 0) result.push(index - 1);
  if (col < SIZE - 1) result.push(index + 1);
  return result;
}

export function isAdjacent(a, b) {
  return adjacentIndices(a).includes(b);
}

export function moveTile(board, index) {
  const emptyIndex = findEmptyIndex(board);
  if (!isAdjacent(index, emptyIndex)) return null;
  const next = [...board];
  next[emptyIndex] = next[index];
  next[index] = EMPTY_TILE;
  return next;
}

export function isSolved(board) {
  return board.every(
    (value, index) =>
      value === (index === TILE_COUNT - 1 ? EMPTY_TILE : index + 1),
  );
}

export function scrambleBoard() {
  let board = createSolvedBoard();
  let previousMove = -1;
  for (let step = 0; step < SHUFFLE_STEPS; step += 1) {
    const emptyIndex = findEmptyIndex(board);
    const options = adjacentIndices(emptyIndex).filter(
      (i) => i !== previousMove,
    );
    const chosen = options[Math.floor(Math.random() * options.length)];
    board = moveTile(board, chosen);
    previousMove = chosen;
  }
  return board;
}

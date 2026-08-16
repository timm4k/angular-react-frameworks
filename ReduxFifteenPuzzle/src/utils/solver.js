import {
  EMPTY_TILE,
  SIZE,
  TILE_COUNT,
  adjacentIndices,
  isSolved,
  moveTile,
} from "./puzzle.js";

const MAX_EXPANSIONS = 1_000_000;

function manhattan(board) {
  let total = 0;
  for (let index = 0; index < TILE_COUNT; index += 1) {
    const value = board[index];
    if (value === EMPTY_TILE) continue;
    const target = value - 1;
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const targetRow = Math.floor(target / SIZE);
    const targetCol = target % SIZE;
    total += Math.abs(row - targetRow) + Math.abs(col - targetCol);
  }
  return total;
}

function linearConflicts(board) {
  let conflicts = 0;
  for (let row = 0; row < SIZE; row += 1) {
    const inRow = [];
    for (let col = 0; col < SIZE; col += 1) {
      const value = board[row * SIZE + col];
      if (value !== EMPTY_TILE && Math.floor((value - 1) / SIZE) === row) {
        inRow.push({ col, target: (value - 1) % SIZE });
      }
    }
    for (let i = 0; i < inRow.length; i += 1) {
      for (let j = i + 1; j < inRow.length; j += 1) {
        if (inRow[i].target > inRow[j].target) conflicts += 2;
      }
    }
  }
  for (let col = 0; col < SIZE; col += 1) {
    const inCol = [];
    for (let row = 0; row < SIZE; row += 1) {
      const value = board[row * SIZE + col];
      if (value !== EMPTY_TILE && (value - 1) % SIZE === col) {
        inCol.push({ row, target: Math.floor((value - 1) / SIZE) });
      }
    }
    for (let i = 0; i < inCol.length; i += 1) {
      for (let j = i + 1; j < inCol.length; j += 1) {
        if (inCol[i].target > inCol[j].target) conflicts += 2;
      }
    }
  }
  return conflicts;
}

function heuristic(board) {
  return manhattan(board) + linearConflicts(board);
}

function less(a, b) {
  if (a.f !== b.f) return a.f < b.f;
  return a.g > b.g;
}

class MinHeap {
  constructor() {
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  push(node) {
    const items = this.items;
    items.push(node);
    let index = items.length - 1;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (less(items[parent], node)) break;
      [items[parent], items[index]] = [items[index], items[parent]];
      index = parent;
    }
  }

  pop() {
    const items = this.items;
    const top = items[0];
    const last = items.pop();
    if (items.length > 0) {
      items[0] = last;
      let index = 0;
      for (;;) {
        const left = index * 2 + 1;
        const right = left + 1;
        let smallest = index;
        if (left < items.length && less(items[left], items[smallest]))
          smallest = left;
        if (right < items.length && less(items[right], items[smallest]))
          smallest = right;
        if (smallest === index) break;
        [items[smallest], items[index]] = [items[index], items[smallest]];
        index = smallest;
      }
    }
    return top;
  }
}

function reconstruct(node) {
  const moves = [];
  for (let cur = node; cur.move !== -1; cur = cur.prev) moves.push(cur.move);
  return moves.reverse();
}

export function solveBoard(board) {
  if (isSolved(board)) return [];
  const heap = new MinHeap();
  const visited = new Map();
  const startKey = board.join(",");
  const start = {
    board,
    key: startKey,
    g: 0,
    h: heuristic(board),
    move: -1,
    prev: null,
  };
  start.f = start.h;
  heap.push(start);
  visited.set(startKey, 0);
  let expansions = 0;
  while (heap.size > 0) {
    const node = heap.pop();
    if (node.g > visited.get(node.key)) continue;
    if (isSolved(node.board)) return reconstruct(node);
    expansions += 1;
    if (expansions > MAX_EXPANSIONS) return null;
    const emptyIndex = node.board.indexOf(EMPTY_TILE);
    for (const index of adjacentIndices(emptyIndex)) {
      const next = moveTile(node.board, index);
      const g = node.g + 1;
      const key = next.join(",");
      const known = visited.get(key);
      if (known !== undefined && known <= g) continue;
      visited.set(key, g);
      const h = heuristic(next);
      heap.push({ board: next, key, g, h, f: g + h, move: index, prev: node });
    }
  }
  return null;
}

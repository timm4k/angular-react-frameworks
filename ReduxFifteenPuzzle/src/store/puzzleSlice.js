import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
  createSolvedBoard,
  isSolved,
  moveTile,
  scrambleBoard,
} from "../utils/puzzle.js";
import { solveBoard } from "../utils/solver.js";

export const STORAGE_KEY = "fifteenPuzzleStats";
const MAX_RECORDS = 100;

function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function finishGame(state, result) {
  const time = Date.now() - state.startTime;
  state.resultTime = time;
  state.isAutoSolving = false;
  state.gameStatus = result === "win" ? "won" : "lost";
  state.statistics = [
    { id: crypto.randomUUID(), time, moves: state.moves, result },
    ...state.statistics,
  ].slice(0, MAX_RECORDS);
}

const initialState = {
  board: createSolvedBoard(),
  gameStatus: "idle",
  mode: "free",
  timeLimit: 0,
  moves: 0,
  startTime: 0,
  now: 0,
  resultTime: 0,
  isAutoSolving: false,
  solutionPath: [],
  statistics: loadRecords(),
};

const puzzleSlice = createSlice({
  name: "puzzle",
  initialState,
  reducers: {
    startGame(state, action) {
      const { mode, timeLimit } = action.payload;
      let board = scrambleBoard();
      while (isSolved(board)) {
        board = scrambleBoard();
      }
      state.board = board;
      state.gameStatus = "playing";
      state.mode = mode;
      state.timeLimit = timeLimit;
      state.moves = 0;
      state.resultTime = 0;
      state.isAutoSolving = false;
      state.solutionPath = [];
      state.startTime = Date.now();
      state.now = state.startTime;
    },
    move(state, action) {
      if (state.gameStatus !== "playing" || state.isAutoSolving) return;
      const next = moveTile(state.board, action.payload.index);
      if (!next) return;
      state.board = next;
      state.moves += 1;
      if (isSolved(next)) finishGame(state, "win");
    },
    tick(state) {
      state.now = Date.now();
      if (state.mode !== "timed") return;
      const isActive =
        state.gameStatus === "playing" || state.gameStatus === "auto-solving";
      if (isActive && state.now - state.startTime >= state.timeLimit) {
        finishGame(state, "loss");
      }
    },
    startAutoSolve(state) {
      if (state.gameStatus !== "playing") return;
      const solution = solveBoard(state.board);
      if (!solution) return;
      state.solutionPath = solution;
      state.isAutoSolving = true;
      state.gameStatus = "auto-solving";
    },
    autoStep(state) {
      if (state.gameStatus !== "auto-solving") return;
      const index = state.solutionPath.shift();
      if (index === undefined) {
        state.isAutoSolving = false;
        state.gameStatus = "playing";
        return;
      }
      const next = moveTile(state.board, index);
      if (!next) return;
      state.board = next;
      state.moves += 1;
      if (isSolved(next)) finishGame(state, "win");
    },
    stopAutoSolve(state) {
      if (state.gameStatus !== "auto-solving") return;
      state.isAutoSolving = false;
      state.gameStatus = "playing";
    },
    toMenu(state) {
      state.gameStatus = "idle";
      state.isAutoSolving = false;
      state.board = createSolvedBoard();
      state.solutionPath = [];
      state.moves = 0;
      state.resultTime = 0;
    },
    resetStats(state) {
      state.statistics = [];
    },
  },
});

export const {
  autoStep,
  move,
  resetStats,
  startAutoSolve,
  startGame,
  stopAutoSolve,
  tick,
  toMenu,
} = puzzleSlice.actions;

export const selectBoard = (state) => state.puzzle.board;
export const selectStatus = (state) => state.puzzle.gameStatus;
export const selectMode = (state) => state.puzzle.mode;
export const selectTimeLimit = (state) => state.puzzle.timeLimit;
export const selectMoves = (state) => state.puzzle.moves;
export const selectIsAutoSolving = (state) => state.puzzle.isAutoSolving;
export const selectElapsed = (state) => {
  const { gameStatus, startTime, now, resultTime } = state.puzzle;
  const isActive = gameStatus === "playing" || gameStatus === "auto-solving";
  return isActive ? now - startTime : resultTime;
};
export const selectRemaining = (state) => {
  const { mode, timeLimit, startTime, now, gameStatus } = state.puzzle;
  if (mode !== "timed") return 0;
  const isActive = gameStatus === "playing" || gameStatus === "auto-solving";
  if (!isActive) return 0;
  return Math.max(0, timeLimit - (now - startTime));
};
export const selectStats = createSelector(
  (state) => state.puzzle.statistics,
  (records) => {
    const games = records.length;
    const wins = records.filter((r) => r.result === "win");
    const winTimes = wins.map((r) => r.time);
    const totalTime = records.reduce((sum, r) => sum + r.time, 0);
    const totalMoves = records.reduce((sum, r) => sum + r.moves, 0);
    return {
      games,
      wins: wins.length,
      losses: games - wins.length,
      winRate: games ? Math.round((wins.length / games) * 100) : 0,
      shortest: winTimes.length ? Math.min(...winTimes) : 0,
      longest: games ? Math.max(...records.map((r) => r.time)) : 0,
      avgTime: games ? Math.round(totalTime / games) : 0,
      minMoves: games ? Math.min(...records.map((r) => r.moves)) : 0,
      maxMoves: games ? Math.max(...records.map((r) => r.moves)) : 0,
      avgMoves: games ? Math.round(totalMoves / games) : 0,
    };
  },
);

export default puzzleSlice;

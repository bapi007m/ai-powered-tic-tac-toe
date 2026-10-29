import type { Board, Player } from "./types";

export const BOARD_SIZE = 9;

const WINNING_LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  winningLine: number[];
  isDraw: boolean;
  isOver: boolean;
}

export function buildBoard(moves: number[]): Board {
  const board: Board = Array(BOARD_SIZE).fill(null);
  moves.forEach((position, turn) => {
    board[position] = turn % 2 === 0 ? "X" : "O";
  });
  return board;
}

export function findWinningLine(board: Board): number[] {
  const line = WINNING_LINES.find(
    ([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]
  );
  return line ? [...line] : [];
}

export function getGameState(moves: number[]): GameState {
  const board = buildBoard(moves);
  const winningLine = findWinningLine(board);
  const winner = winningLine.length ? board[winningLine[0]] : null;
  const isDraw = !winner && moves.length === BOARD_SIZE;

  return {
    board,
    currentPlayer: moves.length % 2 === 0 ? "X" : "O",
    winner,
    winningLine,
    isDraw,
    isOver: winner !== null || isDraw,
  };
}

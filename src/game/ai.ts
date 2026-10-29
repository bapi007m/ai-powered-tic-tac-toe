import { findWinningLine } from "./logic";
import type { Board, Player } from "./types";

const opponentOf = (player: Player): Player => (player === "X" ? "O" : "X");

// Minimax score from `self`'s point of view. Depth is factored in so the
// computer prefers the quickest win and drags out a loss as long as possible.
function minimax(board: Board, turn: Player, self: Player, depth: number): number {
  const line = findWinningLine(board);
  if (line.length) return board[line[0]] === self ? 10 - depth : depth - 10;
  if (board.every((cell) => cell !== null)) return 0;

  const scores = board.flatMap((cell, index) => {
    if (cell) return [];
    board[index] = turn;
    const score = minimax(board, opponentOf(turn), self, depth + 1);
    board[index] = null;
    return [score];
  });

  return turn === self ? Math.max(...scores) : Math.min(...scores);
}

export function getBestMove(board: Board, player: Player): number {
  const scratch = [...board];
  let bestScore = -Infinity;
  let bestMoves: number[] = [];

  scratch.forEach((cell, index) => {
    if (cell) return;
    scratch[index] = player;
    const score = minimax(scratch, opponentOf(player), player, 1);
    scratch[index] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [index];
    } else if (score === bestScore) {
      bestMoves.push(index);
    }
  });

  // Pick randomly among equally strong moves so games don't all look the same.
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

// Chance that the computer plays the best move instead of a random one.
const BEST_MOVE_CHANCE: Record<Difficulty, number> = {
  easy: 0.3,
  medium: 0.75,
  hard: 1,
};

export function getComputerMove(
  board: Board,
  player: Player,
  difficulty: Difficulty
): number {
  if (Math.random() < BEST_MOVE_CHANCE[difficulty]) {
    return getBestMove(board, player);
  }

  const emptyCells = board.flatMap((cell, index) => (cell ? [] : [index]));
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

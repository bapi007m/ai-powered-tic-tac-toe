import { z } from "zod";

export type Cell = "X" | "O" | null;
export type Mark = "X" | "O";

export const MoveSchema = z.object({
  cell: z.number().int().describe("Index (0-8) of the empty cell to play"),
});

export const SYSTEM_PROMPT = `You are playing tic-tac-toe as an expert opponent and you play to win.
Cells are indexed 0-8, left to right, top to bottom:
 0 | 1 | 2
 3 | 4 | 5
 6 | 7 | 8
On each turn: win immediately if you can, otherwise block the opponent's
immediate win, otherwise play the strongest move (create forks, block forks,
prefer center, then corners). Only ever choose an empty cell.`;

export function emptyCells(board: Cell[]): number[] {
  return board.flatMap((cell, index) => (cell ? [] : [index]));
}

export function buildUserPrompt(board: Cell[], player: Mark): string {
  const rows = [0, 3, 6].map((start) =>
    board
      .slice(start, start + 3)
      .map((cell, offset) => cell ?? String(start + offset))
      .join(" | ")
  );
  return `You are ${player}. Current board (numbers are empty cells):\n${rows.join("\n")}\n\nEmpty cells: ${emptyCells(board).join(", ")}. Choose your move.`;
}

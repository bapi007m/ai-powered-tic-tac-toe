import { emptyCells, type Cell, type Mark } from "./prompt";
import { anthropicMove } from "./providers/anthropic";
import { openaiMove } from "./providers/openai";

export type Provider = "anthropic" | "openai";

const PROVIDERS: Record<Provider, (board: Cell[], player: Mark) => Promise<number | undefined>> = {
  anthropic: anthropicMove,
  openai: openaiMove,
};

export async function getLlmMove(board: Cell[], player: Mark, provider: Provider): Promise<number> {
  const requestMove = PROVIDERS[provider];
  if (!requestMove) throw new Error(`Unknown provider: ${provider}`);

  const cell = await requestMove(board, player);
  if (cell === undefined || !emptyCells(board).includes(cell)) {
    throw new Error(`Model returned an invalid move: ${cell}`);
  }
  return cell;
}

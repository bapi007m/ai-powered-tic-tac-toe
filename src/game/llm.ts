import type { Board, Player } from "./types";

export type LlmProvider = "anthropic" | "openai";

export async function requestLlmMove(
  board: Board,
  player: Player,
  provider: LlmProvider,
  signal: AbortSignal
): Promise<number> {
  const response = await fetch("/api/llm-move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ board, player, provider }),
    signal,
  });

  const data = (await response.json()) as { cell?: number; error?: string };
  if (!response.ok || data.cell === undefined) {
    throw new Error(data.error ?? `Request failed (${response.status})`);
  }
  return data.cell;
}

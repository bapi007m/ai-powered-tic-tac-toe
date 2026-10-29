import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { MoveSchema, SYSTEM_PROMPT, buildUserPrompt, type Cell, type Mark } from "../prompt";

const DEFAULT_MODEL = "claude-opus-5-5";

let client: Anthropic | null = null;

export async function anthropicMove(board: Cell[], player: Mark): Promise<number | undefined> {
  client ??= new Anthropic();

  const response = await client.beta.messages.parse({
    model: process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(MoveSchema) },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(board, player) }],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("Model declined to choose a move");
  }
  return response.parsed_output?.cell;
}

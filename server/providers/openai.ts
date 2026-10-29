import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { MoveSchema, SYSTEM_PROMPT, buildUserPrompt, type Cell, type Mark } from "../prompt";

const DEFAULT_MODEL = "gpt-5.5";

let client: OpenAI | null = null;

export async function openaiMove(board: Cell[], player: Mark): Promise<number | undefined> {
  client ??= new OpenAI();

  const response = await client.responses.parse({
    model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
    instructions: SYSTEM_PROMPT,
    input: buildUserPrompt(board, player),
    text: { format: zodTextFormat(MoveSchema, "move") },
  });

  return response.output_parsed?.cell;
}

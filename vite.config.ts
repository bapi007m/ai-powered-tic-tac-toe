import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, loadEnv, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { getLlmMove, type Provider } from "./server/llmMove";

async function readJson(req: IncomingMessage): Promise<unknown> {
  let body = "";
  for await (const chunk of req) body += chunk;
  return JSON.parse(body);
}

async function handleLlmMove(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  try {
    const { board, player, provider } = (await readJson(req)) as {
      board: ("X" | "O" | null)[];
      player: "X" | "O";
      provider: Provider;
    };
    const cell = await getLlmMove(board, player, provider);
    res.end(JSON.stringify({ cell }));
  } catch (error) {
    console.error("[llm-move]", error);
    res.statusCode = 502;
    res.end(JSON.stringify({ error: (error as Error).message }));
  }
}

// Serves POST /api/llm-move from the dev/preview server so the API key
// stays on the server and never ships to the browser.
function llmMoveApi(): Plugin {
  const mount = (middlewares: Connect.Server) =>
    middlewares.use("/api/llm-move", (req: IncomingMessage, res: ServerResponse) => {
      if (req.method !== "POST") {
        res.statusCode = 405;
        res.end();
        return;
      }
      void handleLlmMove(req, res);
    });

  return {
    name: "llm-move-api",
    configureServer(server) {
      mount(server.middlewares);
    },
    configurePreviewServer(server) {
      mount(server.middlewares);
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ["ANTHROPIC_", "OPENAI_"]));

  return {
    plugins: [react(), llmMoveApi()],
  };
});

# Tic Tac Toe

A fast, accessible tic-tac-toe game built with **React 19**, **TypeScript** and **Vite**, featuring a perfect-play computer opponent and optional LLM opponents powered by **Claude** (Anthropic) or **OpenAI**.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white">
</p>

---

## Features

- **Two modes** – play against the computer, or pass-and-play with a friend.
- **Five opponent levels**

  | Level      | How it plays                                                         |
  | ---------- | -------------------------------------------------------------------- |
  | **Easy**   | Plays the best move 30% of the time, otherwise a random cell         |
  | **Medium** | Plays the best move 75% of the time                                  |
  | **Hard**   | Full minimax search – unbeatable; the best you can get is a draw     |
  | **Claude** | Asks an Anthropic model for each move                                |
  | **OpenAI** | Asks an OpenAI model for each move                                   |

- **Graceful fallback** – if an LLM call fails (missing key, network error, invalid answer), that move is played by the built-in engine and a notice explains why. The game never stalls.
- **Server-side API keys** – LLM calls go through a small endpoint on the Vite server, so keys never reach the browser.
- **Move history**, winning-line highlight, and accessible markup (labelled cells, live status announcements, disabled cells once filled).

## Quick start

**Requirements:** Node.js 20.19+ or 22.12+

```bash
git clone https://github.com/bapi007m/game.git
cd game
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). Easy, Medium, Hard and 2-player mode work with no further setup.

### Enabling the LLM opponents

Copy the example environment file and add the key(s) for the provider(s) you want:

```bash
cp .env.example .env
```

```ini
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Optional model overrides
# ANTHROPIC_MODEL=claude-opus-5-5
# OPENAI_MODEL=gpt-5.5
```

Restart `npm run dev`, then pick **Claude** or **OpenAI** from the level selector. `.env` is git-ignored.

> Each LLM move is a paid API request and typically takes a second or more.

## Scripts

| Command             | Description                                        |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Start the dev server (includes the LLM endpoint)   |
| `npm run build`     | Type-check and build the production bundle         |
| `npm run preview`   | Serve the production build (includes LLM endpoint) |
| `npm run typecheck` | Run the TypeScript compiler without emitting       |

## How it works

### Game state

The only piece of state is the ordered list of moves. Everything else – the board, whose turn it is, the winner, the winning line and draws – is derived from it in [`src/game/logic.ts`](src/game/logic.ts). This keeps state consistent by construction and makes restarting trivial.

### Built-in engine

[`src/game/ai.ts`](src/game/ai.ts) implements minimax over the full game tree (fewer than 9! positions, so it is instant). Scores are depth-weighted, so the engine takes the fastest win and delays a loss as long as possible. Ties between equally good moves are broken randomly to keep games varied. Difficulty levels mix in random moves at a fixed rate.

### LLM opponents

```
Browser ──POST /api/llm-move──▶ Vite server middleware ──▶ Anthropic / OpenAI
           { board, player,          (vite.config.ts)
             provider }      ◀── { cell } ───────────────┘
```

1. When it is the computer's turn, the client calls `POST /api/llm-move` ([`src/game/llm.ts`](src/game/llm.ts)).
2. The Vite plugin in [`vite.config.ts`](vite.config.ts) routes the request to the chosen provider.
3. Both providers receive the same prompt ([`server/prompt.ts`](server/prompt.ts)) and must return structured output matching `{ cell: number }`, validated with Zod.
4. [`server/llmMove.ts`](server/llmMove.ts) rejects any move that is not an empty cell before it reaches the game.

## Project structure

```
├── server/
│   ├── llmMove.ts            # Provider dispatch + move validation
│   ├── prompt.ts             # Shared prompt, board rendering, response schema
│   └── providers/
│       ├── anthropic.ts      # Claude via @anthropic-ai/sdk
│       └── openai.ts         # OpenAI via openai SDK
├── src/
│   ├── App.tsx               # Game orchestration, mode & level selection
│   ├── components/
│   │   ├── Board.tsx
│   │   ├── Cell.tsx
│   │   ├── GameStatus.tsx
│   │   └── MoveHistory.tsx
│   └── game/
│       ├── ai.ts             # Minimax engine + difficulty levels
│       ├── llm.ts            # Client for /api/llm-move
│       ├── logic.ts          # Pure game rules and derived state
│       └── types.ts
├── .env.example
└── vite.config.ts            # Vite config + LLM API middleware
```

## Deployment notes

`npm run build` produces a static site in `dist/` that runs Easy, Medium, Hard and 2-player mode anywhere static files can be hosted. The `/api/llm-move` endpoint exists only in the Vite dev and preview servers; to offer the LLM levels in production, host the `server/` logic behind a backend or serverless function at the same path.

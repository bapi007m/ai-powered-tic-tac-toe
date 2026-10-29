import { useEffect, useState } from "react";
import Board from "./components/Board";
import GameStatus from "./components/GameStatus";
import MoveHistory from "./components/MoveHistory";
import { DIFFICULTIES, getBestMove, getComputerMove, type Difficulty } from "./game/ai";
import { requestLlmMove, type LlmProvider } from "./game/llm";
import { getGameState } from "./game/logic";
import type { Player } from "./game/types";
import "./App.css";

const HUMAN: Player = "X";
const COMPUTER: Player = "O";
const COMPUTER_DELAY_MS = 400;

type Level = Difficulty | LlmProvider;
const LEVELS: Level[] = [...DIFFICULTIES, "anthropic", "openai"];
const LEVEL_LABELS: Record<Level, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  anthropic: "Claude",
  openai: "OpenAI",
};

function App() {
  const [moves, setMoves] = useState<number[]>([]);
  const [vsComputer, setVsComputer] = useState(true);
  const [difficulty, setDifficulty] = useState<Level>("hard");
  const [llmError, setLlmError] = useState<string | null>(null);
  const { board, currentPlayer, winner, winningLine, isDraw, isOver } =
    getGameState(moves);

  const isComputerTurn = vsComputer && !isOver && currentPlayer === COMPUTER;
  const isLlmLevel = difficulty === "anthropic" || difficulty === "openai";

  useEffect(() => {
    if (!isComputerTurn) return;

    if (isLlmLevel) {
      const controller = new AbortController();
      requestLlmMove(board, COMPUTER, difficulty, controller.signal)
        .then((cell) => {
          setLlmError(null);
          setMoves((prev) => [...prev, cell]);
        })
        .catch((error: Error) => {
          if (controller.signal.aborted) return;
          // Keep the game going with the built-in engine if the LLM is unavailable.
          setLlmError(error.message);
          setMoves((prev) => [...prev, getBestMove(board, COMPUTER)]);
        });
      return () => controller.abort();
    }

    const timer = setTimeout(() => {
      setMoves((prev) => [...prev, getComputerMove(board, COMPUTER, difficulty)]);
    }, COMPUTER_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isComputerTurn, board, difficulty]);

  const handleCellClick = (index: number) => {
    if (board[index] || isOver || isComputerTurn) return;
    setMoves((prev) => [...prev, index]);
  };

  const resetGame = () => {
    setMoves([]);
    setLlmError(null);
  };

  const toggleMode = () => {
    setVsComputer((prev) => !prev);
    resetGame();
  };

  const changeDifficulty = (level: Level) => {
    setDifficulty(level);
    resetGame();
  };

  return (
    <main className="app">
      <section className="game-container">
        <h1>Tic Tac Toe</h1>

        <button type="button" className="mode-button" onClick={toggleMode}>
          {vsComputer ? "Mode: vs Computer" : "Mode: 2 Players"}
        </button>

        {vsComputer && (
          <div className="difficulty" role="group" aria-label="Difficulty">
            {LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                className={
                  level === difficulty
                    ? "difficulty-button active"
                    : "difficulty-button"
                }
                aria-pressed={level === difficulty}
                onClick={() => changeDifficulty(level)}
              >
                {LEVEL_LABELS[level]}
              </button>
            ))}
          </div>
        )}

        <GameStatus
          winner={winner}
          isDraw={isDraw}
          currentPlayer={currentPlayer}
          computerPlayer={vsComputer ? COMPUTER : null}
          humanPlayer={vsComputer ? HUMAN : null}
        />

        {vsComputer && isLlmLevel && llmError && (
          <p className="llm-error" role="alert">
            LLM unavailable ({llmError}). Used the built-in engine for that move.
          </p>
        )}

        <Board
          board={board}
          winningLine={winningLine}
          disabled={isOver || isComputerTurn}
          onCellClick={handleCellClick}
        />

        <button type="button" className="reset-button" onClick={resetGame}>
          Restart Game
        </button>

        <MoveHistory moves={moves} />
      </section>
    </main>
  );
}

export default App;

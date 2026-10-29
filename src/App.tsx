import { useState } from "react";
import Board from "./components/Board";
import GameStatus from "./components/GameStatus";
import MoveHistory from "./components/MoveHistory";
import { getGameState } from "./game/logic";
import "./App.css";

function App() {
  const [moves, setMoves] = useState<number[]>([]);
  const { board, currentPlayer, winner, winningLine, isDraw, isOver } =
    getGameState(moves);

  const handleCellClick = (index: number) => {
    if (board[index] || isOver) return;
    setMoves((prev) => [...prev, index]);
  };

  const resetGame = () => setMoves([]);

  return (
    <main className="app">
      <section className="game-container">
        <h1>Tic Tac Toe</h1>

        <GameStatus
          winner={winner}
          isDraw={isDraw}
          currentPlayer={currentPlayer}
        />

        <Board
          board={board}
          winningLine={winningLine}
          disabled={isOver}
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

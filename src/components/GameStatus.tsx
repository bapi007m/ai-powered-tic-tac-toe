import type { Player } from "../game/types";

interface GameStatusProps {
  winner: Player | null;
  isDraw: boolean;
  currentPlayer: Player;
}

export default function GameStatus({
  winner,
  isDraw,
  currentPlayer,
}: GameStatusProps) {
  if (winner) {
    return (
      <div className="status winner" role="status">
        Player {winner} wins!
      </div>
    );
  }

  if (isDraw) {
    return (
      <div className="status draw" role="status">
        It's a draw!
      </div>
    );
  }

  return (
    <div className="status" role="status">
      Player <strong>{currentPlayer}</strong>'s turn
    </div>
  );
}

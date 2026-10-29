import type { Player } from "../game/types";

interface GameStatusProps {
  winner: Player | null;
  isDraw: boolean;
  currentPlayer: Player;
  computerPlayer: Player | null;
  humanPlayer: Player | null;
}

export default function GameStatus({
  winner,
  isDraw,
  currentPlayer,
  computerPlayer,
  humanPlayer,
}: GameStatusProps) {
  const label = (player: Player) => {
    if (player === computerPlayer) return `Computer (${player})`;
    if (player === humanPlayer) return `You (${player})`;
    return `Player ${player}`;
  };

  if (winner) {
    const message =
      winner === humanPlayer ? "You win!" : `${label(winner)} wins!`;
    return (
      <div className="status winner" role="status">
        {message}
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

  if (currentPlayer === computerPlayer) {
    return (
      <div className="status" role="status">
        Computer is thinking…
      </div>
    );
  }

  return (
    <div className="status" role="status">
      <strong>{label(currentPlayer)}</strong> to move
    </div>
  );
}

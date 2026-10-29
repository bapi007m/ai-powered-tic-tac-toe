import Cell from "./Cell";
import type { Board as BoardState } from "../game/types";

interface BoardProps {
  board: BoardState;
  winningLine: number[];
  disabled: boolean;
  onCellClick: (index: number) => void;
}

export default function Board({
  board,
  winningLine,
  disabled,
  onCellClick,
}: BoardProps) {
  return (
    <div className="board" role="grid" aria-label="Game board">
      {board.map((value, index) => (
        <Cell
          key={index}
          index={index}
          value={value}
          isWinning={winningLine.includes(index)}
          disabled={disabled || value !== null}
          onClick={() => onCellClick(index)}
        />
      ))}
    </div>
  );
}

import type { CellValue } from "../game/types";

interface CellProps {
  index: number;
  value: CellValue;
  isWinning: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function Cell({
  index,
  value,
  isWinning,
  disabled,
  onClick,
}: CellProps) {
  const className = isWinning ? "cell winning-cell" : "cell";

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Cell ${index + 1}: ${value ?? "empty"}`}
    >
      {value}
    </button>
  );
}

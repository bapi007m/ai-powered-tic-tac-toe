interface MoveHistoryProps {
  moves: number[];
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <div className="history">
      <h3>Move History</h3>
      {moves.length === 0 ? (
        <p>No moves yet</p>
      ) : (
        <ol>
          {moves.map((position, turn) => (
            <li key={turn}>
              {turn % 2 === 0 ? "X" : "O"} → Cell {position + 1}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

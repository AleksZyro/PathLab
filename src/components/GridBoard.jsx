import { COLS } from '../utils/grid.js';

const legendKeys = ['start', 'target', 'wall', 'water', 'mud', 'visited', 'path', 'empty'];

export default function GridBoard({ dictionary, grid, isRunning, onCellClick }) {
  return (
    <section className="board-card">
      <div className="legend">
        {legendKeys.map((key) => (
          <span key={key}><i className={`legend-dot ${key}`} /> {dictionary.legend[key]}</span>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {grid.flat().map((cell) => (
          <button
            key={`${cell.row}-${cell.col}`}
            className={`cell ${cell.type}`}
            aria-label={`${cell.type} cell at row ${cell.row + 1}, column ${cell.col + 1}`}
            disabled={isRunning}
            onClick={() => onCellClick(cell.row, cell.col)}
          />
        ))}
      </div>
    </section>
  );
}

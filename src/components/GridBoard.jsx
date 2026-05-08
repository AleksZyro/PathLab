import { COLS } from '../utils/grid.js';

const legendKeys = ['start', 'target', 'wall', 'water', 'mud', 'visited', 'path', 'empty'];

export default function GridBoard({ dictionary, grid, isRunning, tool, onCellAction, onHoverCell, onLeaveGrid }) {
  const isBrushTool = ['wall', 'water', 'mud', 'erase'].includes(tool);

  const handlePointerDown = (event, cell) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    onCellAction(cell.row, cell.col, { commitHistory: true });
  };

  const handlePointerEnter = (event, cell) => {
    onHoverCell(cell);
    if (!isBrushTool || event.buttons !== 1 || isRunning) return;
    onCellAction(cell.row, cell.col, { commitHistory: false });
  };

  return (
    <section className="board-card" onPointerLeave={onLeaveGrid}>
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
            onPointerDown={(event) => handlePointerDown(event, cell)}
            onPointerEnter={(event) => handlePointerEnter(event, cell)}
            onPointerMove={() => onHoverCell(cell)}
          />
        ))}
      </div>
    </section>
  );
}

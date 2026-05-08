import { useState } from 'react';
import { COLS } from '../utils/grid.js';

const legendKeys = ['start', 'target', 'wall', 'water', 'mud', 'visited', 'path', 'empty'];
const brushTools = ['wall', 'water', 'mud', 'erase'];

export default function GridBoard({ dictionary, grid, isRunning, tool, onCellAction, onHoverCell, onLeaveGrid }) {
  const [isPainting, setIsPainting] = useState(false);
  const [lastPaintedCell, setLastPaintedCell] = useState(null);
  const isBrushTool = brushTools.includes(tool);

  const paintCell = (cell, options) => {
    const key = `${cell.row}-${cell.col}`;
    if (lastPaintedCell === key && !options.commitHistory) return;
    setLastPaintedCell(key);
    onCellAction(cell.row, cell.col, options);
  };

  const handlePointerDown = (event, cell) => {
    if (isRunning) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setIsPainting(isBrushTool);
    paintCell(cell, { commitHistory: true });
  };

  const handlePointerOver = (event, cell) => {
    onHoverCell(cell);
    if (!isBrushTool || !isPainting || event.buttons !== 1 || isRunning) return;
    paintCell(cell, { commitHistory: false });
  };

  const stopPainting = () => {
    setIsPainting(false);
    setLastPaintedCell(null);
  };

  return (
    <section className="board-card" onPointerLeave={() => { stopPainting(); onLeaveGrid(); }} onPointerUp={stopPainting} onPointerCancel={stopPainting}>
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
            onPointerOver={(event) => handlePointerOver(event, cell)}
            onPointerMove={() => onHoverCell(cell)}
          />
        ))}
      </div>
    </section>
  );
}

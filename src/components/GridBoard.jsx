import { useState } from 'react';
import { COLS } from '../utils/grid.js';

const legendKeys = ['start', 'target', 'wall', 'water', 'mud', 'visited', 'path', 'empty'];
const brushTools = ['wall', 'water', 'mud', 'erase'];

export default function GridBoard({ dictionary, grid, isRunning, tool, onCellAction, onHoverCell, onLeaveGrid }) {
  const [isPainting, setIsPainting] = useState(false);
  const [lastPaintedCell, setLastPaintedCell] = useState(null);
  const isBrushTool = brushTools.includes(tool);

  const paintCell = (row, col, options) => {
    const key = `${row}-${col}`;
    if (lastPaintedCell === key && !options.commitHistory) return;
    setLastPaintedCell(key);
    onCellAction(row, col, options);
  };

  const getCellFromPointer = (event) => {
    const element = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-grid-cell="true"]');
    if (!element) return null;
    return {
      row: Number(element.dataset.row),
      col: Number(element.dataset.col)
    };
  };

  const handlePointerDown = (event, cell) => {
    if (isRunning) return;
    event.preventDefault();

    const shouldBrush = isBrushTool && event.ctrlKey && event.button === 0;
    setIsPainting(shouldBrush);
    paintCell(cell.row, cell.col, { commitHistory: true });
  };

  const handlePointerMove = (event, cell) => {
    onHoverCell(cell);
    if (!isPainting || !isBrushTool || event.buttons !== 1 || !event.ctrlKey || isRunning) return;

    const pointedCell = getCellFromPointer(event);
    if (!pointedCell) return;
    paintCell(pointedCell.row, pointedCell.col, { commitHistory: false });
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
            data-grid-cell="true"
            data-row={cell.row}
            data-col={cell.col}
            className={`cell ${cell.type}`}
            aria-label={`${cell.type} cell at row ${cell.row + 1}, column ${cell.col + 1}`}
            disabled={isRunning}
            onPointerDown={(event) => handlePointerDown(event, cell)}
            onPointerMove={(event) => handlePointerMove(event, cell)}
          />
        ))}
      </div>
    </section>
  );
}

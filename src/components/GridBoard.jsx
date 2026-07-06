import { useState } from 'react';
import { COLS, getTerrainCostTotal } from '../utils/grid.js';

const legendKeys = ['start', 'target', 'wall', 'water', 'mud', 'visited', 'path', 'empty'];
const brushTools = ['wall', 'water', 'mud', 'erase'];
const mergedCellTypes = new Set(['wall', 'water', 'mud']);

function getMergedCellClasses(grid, cell) {
  if (!mergedCellTypes.has(cell.type)) return '';

  const sameType = (row, col) => grid[row]?.[col]?.type === cell.type;
  return [
    'merged-cell',
    sameType(cell.row - 1, cell.col) && 'merge-up',
    sameType(cell.row + 1, cell.col) && 'merge-down',
    sameType(cell.row, cell.col - 1) && 'merge-left',
    sameType(cell.row, cell.col + 1) && 'merge-right'
  ].filter(Boolean).join(' ');
}

export default function GridBoard({ dictionary, grid, isRunning, tool, pathCost, onCellAction, onHoverCell, onLeaveGrid }) {
  const [isPainting, setIsPainting] = useState(false);
  const [lastPaintedCell, setLastPaintedCell] = useState(null);
  const isBrushTool = brushTools.includes(tool);
  const displayCost = pathCost ?? getTerrainCostTotal(grid);

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
    if (isRunning || !event.isPrimary || event.button !== 0) return;
    event.preventDefault();

    setIsPainting(isBrushTool);
    paintCell(cell.row, cell.col, { commitHistory: true });
  };

  const handlePointerMove = (event, cell) => {
    onHoverCell(cell);
    if (!isPainting || !isBrushTool || isRunning) return;

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
      <div className="board-header">
        <div className="legend">
          {legendKeys.map((key) => (
            <span key={key}><i className={`legend-dot ${key}`} /> {dictionary.legend[key]}</span>
          ))}
        </div>
        <div className="board-cost-pill">{dictionary.cost.shortLabel}: <strong>{displayCost}</strong></div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {grid.flat().map((cell) => (
          <button
            key={`${cell.row}-${cell.col}`}
            data-grid-cell="true"
            data-row={cell.row}
            data-col={cell.col}
            className={`cell ${cell.type} ${getMergedCellClasses(grid, cell)}`.trim()}
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

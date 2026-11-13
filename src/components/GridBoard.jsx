import { memo, useRef } from 'react';
import { COLS, makeKey } from '../utils/grid.js';

const legendKeys = ['start', 'target', 'wall', 'water', 'mud', 'frontier', 'visited', 'path', 'empty'];
const brushTools = ['wall', 'water', 'mud', 'erase'];
const mergedCellTypes = new Set(['wall', 'water', 'mud', 'frontier', 'visited', 'path']);

const arrowOffsets = {
  ArrowUp: [-1, 0],
  ArrowRight: [0, 1],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1]
};

const GridCell = memo(function GridCell({ cell, mergedClasses, label, disabled }) {
  return (
    <button
      data-grid-cell="true"
      data-row={cell.row}
      data-col={cell.col}
      className={`cell ${cell.type} ${mergedClasses}`.trim()}
      aria-label={label}
      tabIndex={cell.type === 'start' ? 0 : -1}
      disabled={disabled}
    />
  );
});

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

export default function GridBoard({ dictionary, grid, isRunning, tool, terrainCost, onCellAction, onHoverCell, onLeaveGrid }) {
  const isPainting = useRef(false);
  const lastPaintedCell = useRef(null);
  const isBrushTool = brushTools.includes(tool);

  const paintCell = (row, col, options) => {
    const key = makeKey(row, col);
    if (lastPaintedCell.current === key && !options.commitHistory) return;
    lastPaintedCell.current = key;
    onCellAction(row, col, options);
  };

  const getCell = (element, boardElement) => {
    const button = element?.closest?.('[data-grid-cell="true"]');
    if (!button || !boardElement.contains(button)) return null;
    return grid[Number(button.dataset.row)]?.[Number(button.dataset.col)] ?? null;
  };

  const handlePointerDown = (event) => {
    const cell = getCell(event.target, event.currentTarget);
    if (!cell) return;
    if (isRunning || !event.isPrimary || event.button !== 0) return;
    event.preventDefault();

    isPainting.current = isBrushTool;
    paintCell(cell.row, cell.col, { commitHistory: true });
  };

  const handlePointerMove = (event) => {
    const cell = getCell(event.target, event.currentTarget);
    if (!cell) return;
    onHoverCell(cell);
    if (!isPainting.current || !isBrushTool || isRunning) return;

    const pointedCell = getCell(document.elementFromPoint(event.clientX, event.clientY), event.currentTarget);
    if (!pointedCell) return;
    paintCell(pointedCell.row, pointedCell.col, { commitHistory: false });
  };

  const stopPainting = () => {
    isPainting.current = false;
    lastPaintedCell.current = null;
  };

  const handleCellKeyDown = (event) => {
    const cell = getCell(event.target, event.currentTarget);
    if (!cell || isRunning) return;
    const movement = arrowOffsets[event.key];

    if (movement) {
      event.preventDefault();
      const row = Math.max(0, Math.min(grid.length - 1, cell.row + movement[0]));
      const col = Math.max(0, Math.min(grid[0].length - 1, cell.col + movement[1]));
      event.currentTarget.querySelector(`[data-row="${row}"][data-col="${col}"]`)?.focus();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      paintCell(cell.row, cell.col, { commitHistory: true });
    }
  };

  const getCellLabel = (cell) => dictionary.grid.cellLabel
    .replace('{{type}}', dictionary.legend[cell.type] ?? cell.type)
    .replace('{{row}}', String(cell.row + 1))
    .replace('{{column}}', String(cell.col + 1));

  return (
    <section className="board-card" aria-labelledby="grid-title" onPointerLeave={() => { stopPainting(); onLeaveGrid(); }} onPointerUp={stopPainting} onPointerCancel={stopPainting}>
      <div className="board-header">
        <h2 id="grid-title" className="sr-only">{dictionary.grid.title}</h2>
        <div className="legend">
          {legendKeys.map((key) => (
            <span key={key}><i className={`legend-dot ${key}`} /> {dictionary.legend[key]}</span>
          ))}
        </div>
        <div className="board-cost-pill">{dictionary.cost.shortLabel}: <strong>{terrainCost}</strong></div>
      </div>

      <p id="grid-instructions" className="sr-only">{dictionary.grid.instructions}</p>
      <div className="grid-viewport">
        <div
          className="grid"
          aria-describedby="grid-instructions"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          onFocus={(event) => {
            const cell = getCell(event.target, event.currentTarget);
            if (cell) onHoverCell(cell);
          }}
          onKeyDown={handleCellKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          {grid.map((gridRow) => gridRow.map((cell) => (
            <GridCell
              key={makeKey(cell.row, cell.col)}
              cell={cell}
              mergedClasses={getMergedCellClasses(grid, cell)}
              label={getCellLabel(cell)}
              disabled={isRunning}
            />
          )))}
        </div>
      </div>
    </section>
  );
}

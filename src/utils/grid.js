export const ROWS = 18;
export const COLS = 32;
export const DEFAULT_START = { row: 8, col: 7 };
export const DEFAULT_TARGET = { row: 8, col: 24 };

export const terrainCosts = {
  empty: 1,
  start: 1,
  target: 1,
  visited: 1,
  path: 1,
  water: 5,
  mud: 10
};

export function makeKey(row, col) {
  return `${row}-${col}`;
}

export function sameNode(a, b) {
  return Boolean(a && b && a.row === b.row && a.col === b.col);
}

export function createGrid(start = DEFAULT_START, target = DEFAULT_TARGET) {
  return Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => {
      const node = { row, col };
      return {
        row,
        col,
        type: sameNode(node, start) ? 'start' : sameNode(node, target) ? 'target' : 'empty'
      };
    })
  );
}

export function cloneGridWithClearedSearch(grid) {
  return grid.map((gridRow) =>
    gridRow.map((cell) => {
      if (cell.type === 'visited' || cell.type === 'path') {
        const { previousType, ...restoredCell } = cell;
        return { ...restoredCell, type: previousType ?? 'empty' };
      }
      return cell;
    })
  );
}

export function setCellType(grid, node, type) {
  return grid.map((gridRow) =>
    gridRow.map((cell) => {
      if (cell.row !== node.row || cell.col !== node.col) return cell;
      const { previousType, ...cleanCell } = cell;
      return { ...cleanCell, type };
    })
  );
}

export function moveSpecialNode(grid, previousNode, nextNode, type) {
  return cloneGridWithClearedSearch(grid).map((gridRow) =>
    gridRow.map((cell) => {
      const { previousType, ...cleanCell } = cell;
      if (sameNode(cell, previousNode)) return { ...cleanCell, type: 'empty' };
      if (sameNode(cell, nextNode)) return { ...cleanCell, type };
      return cleanCell;
    })
  );
}

export function applySearchType(grid, node, type) {
  return grid.map((gridRow) =>
    gridRow.map((cell) => {
      if (cell.row !== node.row || cell.col !== node.col) return cell;
      if (cell.type === 'start' || cell.type === 'target' || cell.type === 'wall') return cell;
      return { ...cell, previousType: cell.previousType ?? cell.type, type };
    })
  );
}

export function getCellCost(cell) {
  if (!cell || cell.type === 'wall') return Infinity;
  return terrainCosts[cell.type] ?? terrainCosts[cell.previousType] ?? 1;
}

export function countCells(grid, type) {
  return grid.flat().filter((cell) => cell.type === type).length;
}

export function isBlockedForSpecialTool(cell) {
  return cell.type === 'start' || cell.type === 'target';
}

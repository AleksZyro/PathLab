export const ROWS = 17;
export const COLS = 31;
export const DEFAULT_START = { row: 8, col: 7 };
export const DEFAULT_TARGET = { row: 8, col: 23 };

const terrainCosts = {
  empty: 1,
  start: 1,
  target: 1,
  water: 5,
  mud: 10
};

const searchOverlayTypes = new Set(['frontier', 'visited', 'path']);

function getEffectiveCellType(cell) {
  if (!cell) return undefined;
  if (searchOverlayTypes.has(cell.type) && cell.previousType) return cell.previousType;
  return cell.type;
}

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
  let nextGrid = grid;
  for (const [index, row] of grid.entries()) {
    if (!row.some((cell) => searchOverlayTypes.has(cell.type))) continue;
    if (nextGrid === grid) nextGrid = [...grid];

    nextGrid[index] = row.map((cell) => {
      if (!searchOverlayTypes.has(cell.type)) return cell;
      const { previousType, ...restoredCell } = cell;
      return { ...restoredCell, type: previousType ?? 'empty' };
    });
  }
  return nextGrid;
}

export function setCellType(grid, node, type) {
  const nextGrid = [...grid];
  nextGrid[node.row] = [...grid[node.row]];
  const { previousType, ...cleanCell } = nextGrid[node.row][node.col];
  nextGrid[node.row][node.col] = { ...cleanCell, type };
  return nextGrid;
}

export function moveSpecialNode(grid, previousNode, nextNode, type) {
  const cleanGrid = cloneGridWithClearedSearch(grid);
  if (sameNode(previousNode, nextNode)) return cleanGrid;
  return setCellType(setCellType(cleanGrid, previousNode, 'empty'), nextNode, type);
}

export function applySearchType(grid, node, type) {
  const cell = grid[node.row]?.[node.col];
  if (!cell || cell.type === 'start' || cell.type === 'target' || cell.type === 'wall') return grid;
  const nextGrid = [...grid];
  nextGrid[node.row] = [...grid[node.row]];
  nextGrid[node.row][node.col] = { ...cell, previousType: cell.previousType ?? cell.type, type };
  return nextGrid;
}

export function getCellCost(cell) {
  if (!cell || cell.type === 'wall') return Infinity;
  const type = getEffectiveCellType(cell);
  return terrainCosts[type] ?? 1;
}

export function getTerrainCostTotal(grid) {
  let total = 0;
  for (const row of grid) {
    for (const cell of row) {
      const type = getEffectiveCellType(cell);
      if (type === 'water') total += terrainCosts.water;
      if (type === 'mud') total += terrainCosts.mud;
    }
  }
  return total;
}

export function countCells(grid, type) {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.type === type) count += 1;
    }
  }
  return count;
}

export function isBlockedForSpecialTool(cell) {
  return cell.type === 'start' || cell.type === 'target';
}

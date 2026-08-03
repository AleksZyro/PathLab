import { DEFAULT_START, DEFAULT_TARGET, ROWS, createGrid, setCellType } from './grid.js';

function applyCells(grid, cells, type) {
  return cells.reduce((nextGrid, node) => setCellType(nextGrid, node, type), grid);
}

function horizontal(row, startCol, endCol) {
  return Array.from({ length: endCol - startCol + 1 }, (_, index) => ({ row, col: startCol + index }));
}

function vertical(col, startRow, endRow) {
  return Array.from({ length: endRow - startRow + 1 }, (_, index) => ({ row: startRow + index, col }));
}

function block(startRow, endRow, startCol, endCol) {
  return Array.from({ length: endRow - startRow + 1 }, (_, rowIndex) =>
    horizontal(startRow + rowIndex, startCol, endCol)
  ).flat();
}

function withoutCells(cells, blockedCells) {
  const blockedKeys = new Set(blockedCells.map((cell) => `${cell.row}-${cell.col}`));
  return cells.filter((cell) => !blockedKeys.has(`${cell.row}-${cell.col}`));
}

export const presetIds = ['simple', 'waterBarrier', 'mudTrap', 'noPath'];

export function createPreset(id) {
  let start = DEFAULT_START;
  let target = DEFAULT_TARGET;
  let grid = createGrid(start, target);

  if (id === 'simple') {
    const gates = [{ row: 5, col: 14 }, { row: 10, col: 19 }];
    grid = applyCells(grid, withoutCells([...horizontal(5, 5, 24), ...horizontal(10, 7, 26)], gates), 'wall');
    grid = applyCells(grid, [...block(7, 8, 14, 18), ...horizontal(12, 12, 22)], 'water');
    grid = applyCells(grid, [...horizontal(8, 9, 12), ...horizontal(9, 20, 23)], 'mud');
  }

  if (id === 'waterBarrier') {
    start = { row: 4, col: 4 };
    target = { row: 12, col: 26 };
    grid = createGrid(start, target);
    grid = applyCells(grid, [...vertical(12, 1, 14), ...vertical(20, 2, 15)], 'water');
    grid = applyCells(grid, [...horizontal(6, 8, 15), ...horizontal(10, 17, 24)], 'wall');
    grid = applyCells(grid, [...horizontal(4, 13, 19), ...horizontal(12, 9, 16)], 'mud');
  }

  if (id === 'mudTrap') {
    start = { row: 8, col: 3 };
    target = { row: 8, col: 27 };
    grid = createGrid(start, target);
    grid = applyCells(grid, block(5, 11, 11, 19), 'mud');
    grid = applyCells(grid, [...horizontal(4, 10, 20), ...horizontal(12, 10, 20)], 'wall');
    grid = applyCells(grid, [...vertical(8, 6, 10), ...vertical(22, 6, 10)], 'water');
  }

  if (id === 'noPath') {
    start = { row: 8, col: 5 };
    target = { row: 8, col: 24 };
    grid = createGrid(start, target);
    grid = applyCells(grid, [
      ...vertical(21, 4, 12),
      ...vertical(27, 4, 12),
      ...horizontal(4, 21, 27),
      ...horizontal(12, 21, 27),
      ...vertical(14, 0, ROWS - 1)
    ], 'wall');
    grid = applyCells(grid, [...horizontal(6, 4, 11), ...horizontal(10, 4, 11)], 'water');
    grid = applyCells(grid, block(7, 9, 16, 19), 'mud');
  }

  return { grid, start, target };
}

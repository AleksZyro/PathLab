import { DEFAULT_START, DEFAULT_TARGET, createGrid, setCellType } from './grid.js';

function applyCells(grid, cells, type) {
  return cells.reduce((nextGrid, node) => setCellType(nextGrid, node, type), grid);
}

export const presetIds = ['simple', 'waterBarrier', 'mudTrap', 'noPath', 'astarDemo'];

export function createPreset(id) {
  let start = DEFAULT_START;
  let target = DEFAULT_TARGET;
  let grid = createGrid(start, target);

  if (id === 'simple') {
    grid = applyCells(grid, Array.from({ length: 14 }, (_, index) => ({ row: 6, col: 8 + index })), 'wall');
    grid = applyCells(grid, Array.from({ length: 8 }, (_, index) => ({ row: 11, col: 10 + index })), 'water');
  }

  if (id === 'waterBarrier') {
    grid = applyCells(grid, Array.from({ length: 16 }, (_, index) => ({ row: 8, col: 8 + index })), 'water');
    grid = applyCells(grid, Array.from({ length: 9 }, (_, index) => ({ row: 5 + index, col: 16 })), 'wall');
  }

  if (id === 'mudTrap') {
    grid = applyCells(grid, Array.from({ length: 11 }, (_, index) => ({ row: 8, col: 9 + index })), 'mud');
    grid = applyCells(grid, Array.from({ length: 8 }, (_, index) => ({ row: 5, col: 12 + index })), 'water');
    grid = applyCells(grid, Array.from({ length: 6 }, (_, index) => ({ row: 11, col: 13 + index })), 'water');
  }

  if (id === 'noPath') {
    grid = applyCells(grid, Array.from({ length: 18 }, (_, row) => ({ row, col: 15 })), 'wall');
  }

  if (id === 'astarDemo') {
    start = { row: 14, col: 4 };
    target = { row: 3, col: 27 };
    grid = createGrid(start, target);
    grid = applyCells(grid, Array.from({ length: 19 }, (_, index) => ({ row: 9, col: 6 + index })), 'wall');
    grid = applyCells(grid, Array.from({ length: 8 }, (_, index) => ({ row: 2 + index, col: 18 })), 'wall');
    grid = applyCells(grid, Array.from({ length: 10 }, (_, index) => ({ row: 12, col: 12 + index })), 'mud');
    grid = applyCells(grid, Array.from({ length: 7 }, (_, index) => ({ row: 6, col: 20 + index })), 'water');
  }

  return { grid, start, target };
}

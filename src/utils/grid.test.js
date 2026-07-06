import { describe, expect, it } from 'vitest';
import { applySearchType, cloneGridWithClearedSearch, createGrid, getCellCost, getTerrainCostTotal, moveSpecialNode, setCellType } from './grid.js';

describe('grid search state restoration', () => {
  it('restores water after clearing a visited/path overlay', () => {
    let grid = createGrid({ row: 0, col: 0 }, { row: 0, col: 4 });
    grid = setCellType(grid, { row: 1, col: 1 }, 'water');
    grid = applySearchType(grid, { row: 1, col: 1 }, 'visited');
    grid = applySearchType(grid, { row: 1, col: 1 }, 'path');

    const clearedGrid = cloneGridWithClearedSearch(grid);

    expect(clearedGrid[1][1].type).toBe('water');
    expect(clearedGrid[1][1].previousType).toBeUndefined();
  });

  it('restores mud after clearing a visited overlay', () => {
    let grid = createGrid({ row: 0, col: 0 }, { row: 0, col: 4 });
    grid = setCellType(grid, { row: 2, col: 2 }, 'mud');
    grid = applySearchType(grid, { row: 2, col: 2 }, 'visited');

    const clearedGrid = cloneGridWithClearedSearch(grid);

    expect(clearedGrid[2][2].type).toBe('mud');
    expect(clearedGrid[2][2].previousType).toBeUndefined();
  });

  it('keeps water and mud costs while cells are visually overlaid', () => {
    let grid = createGrid({ row: 0, col: 0 }, { row: 0, col: 4 });
    grid = setCellType(grid, { row: 1, col: 1 }, 'water');
    grid = setCellType(grid, { row: 1, col: 2 }, 'mud');
    grid = applySearchType(grid, { row: 1, col: 1 }, 'visited');
    grid = applySearchType(grid, { row: 1, col: 2 }, 'path');

    expect(getCellCost(grid[1][1])).toBe(5);
    expect(getCellCost(grid[1][2])).toBe(10);
    expect(getTerrainCostTotal(grid)).toBe(15);
  });

  it('moves start and target nodes without leaving duplicate special nodes', () => {
    let grid = createGrid({ row: 0, col: 0 }, { row: 0, col: 4 });
    grid = moveSpecialNode(grid, { row: 0, col: 0 }, { row: 1, col: 1 }, 'start');
    grid = moveSpecialNode(grid, { row: 0, col: 4 }, { row: 2, col: 2 }, 'target');

    expect(grid[0][0].type).toBe('empty');
    expect(grid[0][4].type).toBe('empty');
    expect(grid[1][1].type).toBe('start');
    expect(grid[2][2].type).toBe('target');
    expect(grid.flat().filter((cell) => cell.type === 'start')).toHaveLength(1);
    expect(grid.flat().filter((cell) => cell.type === 'target')).toHaveLength(1);
  });
});

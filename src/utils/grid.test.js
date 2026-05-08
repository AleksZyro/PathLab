import { describe, expect, it } from 'vitest';
import { applySearchType, cloneGridWithClearedSearch, createGrid, setCellType } from './grid.js';

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
});

import { describe, expect, it } from 'vitest';
import { runAStar, runDijkstra } from '../src/algorithms/pathfinding.js';
import { createGrid, setCellType } from '../src/utils/grid.js';

const start = { row: 2, col: 1 };
const target = { row: 2, col: 5 };

function applyCells(grid, cells, type) {
  return cells.reduce((nextGrid, node) => setCellType(nextGrid, node, type), grid);
}

describe('pathfinding behavior', () => {
  it('finds a reproducible weighted route without using blocked cells', () => {
    let grid = createGrid(start, target);
    grid = applyCells(grid, [{ row: 2, col: 3 }, { row: 1, col: 3 }], 'wall');
    grid = applyCells(grid, [{ row: 2, col: 2 }, { row: 3, col: 3 }], 'water');
    grid = applyCells(grid, [{ row: 3, col: 2 }], 'mud');

    const dijkstra = runDijkstra(grid, start, target);
    const astar = runAStar(grid, start, target);

    expect(dijkstra.found).toBe(true);
    expect(astar.found).toBe(true);
    expect(astar.pathCost).toBe(dijkstra.pathCost);
    expect(dijkstra.path).not.toContainEqual({ row: 2, col: 3 });
    expect(dijkstra.path).not.toContainEqual({ row: 1, col: 3 });
    expect(runDijkstra(grid, start, target).path).toEqual(dijkstra.path);
  });
});

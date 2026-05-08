import { describe, expect, it } from 'vitest';
import { runAStar, runBfs, runDijkstra, runDfs } from './pathfinding.js';
import { ROWS, createGrid, setCellType } from '../utils/grid.js';

const start = { row: 0, col: 0 };
const target = { row: 0, col: 4 };

function gridWithStartAndTarget() {
  return createGrid(start, target);
}

function setCells(grid, cells, type) {
  return cells.reduce((nextGrid, node) => setCellType(nextGrid, node, type), grid);
}

describe('pathfinding algorithms', () => {
  it('BFS finds the shortest path by number of steps', () => {
    const grid = gridWithStartAndTarget();
    const result = runBfs(grid, start, target);

    expect(result.found).toBe(true);
    expect(result.pathLength).toBe(4);
    expect(result.pathCost).toBe(4);
  });

  it('DFS finds a valid path without walking through walls', () => {
    let grid = gridWithStartAndTarget();
    grid = setCells(grid, [{ row: 0, col: 1 }, { row: 1, col: 1 }], 'wall');
    const result = runDfs(grid, start, target);

    expect(result.found).toBe(true);
    expect(result.path).not.toContainEqual({ row: 0, col: 1 });
    expect(result.path).not.toContainEqual({ row: 1, col: 1 });
  });

  it('Dijkstra avoids expensive terrain when a cheaper route exists', () => {
    let grid = gridWithStartAndTarget();
    grid = setCells(grid, [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }], 'mud');
    const result = runDijkstra(grid, start, target);

    expect(result.found).toBe(true);
    expect(result.pathCost).toBeLessThan(31);
    expect(result.path).not.toContainEqual({ row: 0, col: 2 });
  });

  it('A* finds the same cheapest cost as Dijkstra on weighted terrain', () => {
    let grid = gridWithStartAndTarget();
    grid = setCells(grid, [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }], 'water');

    const dijkstra = runDijkstra(grid, start, target);
    const astar = runAStar(grid, start, target);

    expect(astar.found).toBe(true);
    expect(astar.pathCost).toBe(dijkstra.pathCost);
  });

  it('returns no path when a full wall separates start and target', () => {
    let grid = gridWithStartAndTarget();
    const wallColumn = Array.from({ length: ROWS }, (_, row) => ({ row, col: 2 }));
    grid = setCells(grid, wallColumn, 'wall');

    const result = runBfs(grid, start, target);

    expect(result.found).toBe(false);
    expect(result.pathLength).toBe(0);
  });
});

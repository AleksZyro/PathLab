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

  it('reports a weighted cost breakdown for water and mud fields', () => {
    let grid = gridWithStartAndTarget();
    grid = setCells(grid, [{ row: 0, col: 1 }], 'water');
    grid = setCells(grid, [{ row: 0, col: 2 }], 'mud');
    grid = setCells(grid, Array.from({ length: 5 }, (_, col) => ({ row: 1, col })), 'wall');

    const result = runDijkstra(grid, start, target);

    expect(result.found).toBe(true);
    expect(result.pathCost).toBe(17);
    expect(result.costBreakdown.normal).toEqual({ count: 2, cost: 2 });
    expect(result.costBreakdown.water).toEqual({ count: 1, cost: 5 });
    expect(result.costBreakdown.mud).toEqual({ count: 1, cost: 10 });
  });

  it('A* finds the same cheapest cost as Dijkstra on weighted terrain', () => {
    let grid = gridWithStartAndTarget();
    grid = setCells(grid, [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }], 'water');

    const dijkstra = runDijkstra(grid, start, target);
    const astar = runAStar(grid, start, target);

    expect(astar.found).toBe(true);
    expect(astar.pathCost).toBe(dijkstra.pathCost);
  });

  it('A* visits no more cells than Dijkstra on the directed demo terrain', () => {
    let grid = gridWithStartAndTarget();
    grid = setCells(grid, [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }], 'mud');
    grid = setCells(grid, [{ row: 1, col: 2 }, { row: 2, col: 2 }], 'wall');

    const dijkstra = runDijkstra(grid, start, target);
    const astar = runAStar(grid, start, target);

    expect(astar.found).toBe(true);
    expect(astar.pathCost).toBe(dijkstra.pathCost);
    expect(astar.visitedOrder.length).toBeLessThanOrEqual(dijkstra.visitedOrder.length);
  });

  it('returns no path when a full wall separates start and target', () => {
    let grid = gridWithStartAndTarget();
    const wallColumn = Array.from({ length: ROWS }, (_, row) => ({ row, col: 2 }));
    grid = setCells(grid, wallColumn, 'wall');

    const result = runBfs(grid, start, target);

    expect(result.found).toBe(false);
    expect(result.pathLength).toBe(0);
    expect(result.pathCost).toBe(0);
    expect(result.costBreakdown).toEqual({
      normal: { count: 0, cost: 0 },
      water: { count: 0, cost: 0 },
      mud: { count: 0, cost: 0 }
    });
  });
});

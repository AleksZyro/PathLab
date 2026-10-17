import { describe, expect, it } from 'vitest';
import { runAStar, runDijkstra } from '../src/algorithms/pathfinding.js';
import { createGrid, getCellCost } from '../src/utils/grid.js';

const start = { row: 0, col: 0 };
const target = { row: 4, col: 6 };

// Independent repeated edge relaxation on a small bounded area.
function referenceCost(grid) {
  const costs = Array.from({ length: 5 }, () => Array(7).fill(Infinity));
  costs[0][0] = 0;
  for (let pass = 0; pass < 35; pass += 1) {
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 7; col += 1) {
        if (grid[row][col].type === 'wall') continue;
        for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
          const r = row + dr;
          const c = col + dc;
          if (r < 0 || r >= 5 || c < 0 || c >= 7) continue;
          costs[r][c] = Math.min(costs[r][c], costs[row][col] + getCellCost(grid[r][c]));
        }
      }
    }
  }
  return costs[4][6];
}

describe('heap-based weighted searches', () => {
  it.each([runDijkstra, runAStar])('matches independent optimal costs across weighted fixtures (%#)', (run) => {
    for (let seed = 0; seed < 30; seed += 1) {
      const grid = createGrid(start, target);
      for (const row of grid) {
        for (const cell of row) {
          if (cell.type === 'start' || cell.type === 'target') continue;
          const code = (cell.row * 37 + cell.col * 11 + seed * 17) % 19;
          cell.type = cell.row >= 5 || cell.col >= 7 ? 'wall'
            : code < 4 ? 'wall' : code < 9 ? 'water' : code < 12 ? 'mud' : 'empty';
        }
      }
      const expected = referenceCost(grid);
      const result = run(grid, start, target);
      expect(result.found).toBe(Number.isFinite(expected));
      expect(result.pathCost).toBe(Number.isFinite(expected) ? expected : 0);
      const route = [start, ...result.path, target];
      if (result.found) {
        for (let i = 1; i < route.length; i += 1) {
          expect(Math.abs(route[i].row - route[i - 1].row) + Math.abs(route[i].col - route[i - 1].col)).toBe(1);
          expect(grid[route[i].row][route[i].col].type).not.toBe('wall');
        }
      }
      expect(new Set(result.visitedOrder.map((node) => node.row + ':' + node.col)).size).toBe(result.visitedOrder.length);
    }
  });

  it.each([runDijkstra, runAStar])('handles coincident endpoints and emits consistent frontier events (%#)', (run) => {
    const grid = createGrid(start, target);
    expect(run(grid, start, start)).toMatchObject({ found: true, pathCost: 0, pathLength: 0, path: [] });
    const result = run(grid, start, target);
    const frontier = new Set();
    for (const event of result.explorationEvents) {
      const key = event.node.row + ':' + event.node.col;
      if (event.type === 'frontier') frontier.add(key);
      else expect(frontier.has(key)).toBe(true);
    }
    expect(result.explorationEvents.some((event) => event.type === 'frontier')).toBe(true);
  });
});

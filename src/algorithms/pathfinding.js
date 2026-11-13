import { getCellCost, makeKey, sameNode } from '../utils/grid.js';
import { MinPriorityQueue } from './PriorityQueue.js';

const directions = [
  { row: -1, col: 0 },
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 0, col: -1 }
];

export const algorithmIds = ['bfs', 'dfs', 'dijkstra', 'astar'];

function isSpecialNode(node, start, target) {
  return sameNode(node, start) || sameNode(node, target);
}

function getNeighbors(node, grid) {
  const neighbors = [];
  for (const direction of directions) {
    const row = node.row + direction.row;
    const col = node.col + direction.col;
    const cell = grid[row]?.[col];
    if (cell && cell.type !== 'wall') neighbors.push({ row, col });
  }
  return neighbors;
}

function reconstructPath(parentMap, endNode, start, target) {
  const path = [];
  let currentKey = makeKey(endNode.row, endNode.col);

  while (parentMap.has(currentKey)) {
    const [row, col] = currentKey.split('-').map(Number);
    path.push({ row, col });
    currentKey = parentMap.get(currentKey);
  }

  return path.reverse().filter((node) => !isSpecialNode(node, start, target));
}

function getTerrainName(cell) {
  if (cell?.type === 'water') return 'water';
  if (cell?.type === 'mud') return 'mud';
  return 'normal';
}

function calculateCostBreakdown(steps, grid) {
  const breakdown = {
    normal: { count: 0, cost: 0 },
    water: { count: 0, cost: 0 },
    mud: { count: 0, cost: 0 }
  };

  for (const node of steps) {
    const cell = grid[node.row][node.col];
    const terrain = getTerrainName(cell);
    const cost = getCellCost(cell);
    breakdown[terrain].count += 1;
    breakdown[terrain].cost += cost;
  }

  return breakdown;
}

function calculatePathCost(costBreakdown) {
  return Object.values(costBreakdown).reduce((sum, entry) => sum + entry.cost, 0);
}

function createResult(visitedOrder, path, start, target, grid, found) {
  const steps = found && !sameNode(start, target) ? [...path, target] : [];
  const costBreakdown = calculateCostBreakdown(steps, grid);
  return {
    visitedOrder,
    path,
    found,
    pathLength: steps.length,
    pathCost: calculatePathCost(costBreakdown),
    costBreakdown
  };
}

function runUnweightedSearch(grid, start, target, depthFirst) {
  const pending = [start];
  const startKey = makeKey(start.row, start.col);
  const parents = new Map();
  const visitedOrder = [];
  let head = 0;

  while (head < pending.length) {
    const current = depthFirst ? pending.pop() : pending[head++];
    const currentKey = makeKey(current.row, current.col);
    if (sameNode(current, target)) {
      const path = reconstructPath(parents, current, start, target);
      return createResult(visitedOrder, path, start, target, grid, true);
    }

    const neighbors = getNeighbors(current, grid);
    if (depthFirst) neighbors.reverse();
    for (const neighbor of neighbors) {
      const key = makeKey(neighbor.row, neighbor.col);
      if (key === startKey || parents.has(key)) continue;
      parents.set(key, currentKey);
      if (!sameNode(neighbor, target)) visitedOrder.push(neighbor);
      pending.push(neighbor);
    }
  }

  return createResult(visitedOrder, [], start, target, grid, false);
}

export function runBfs(grid, start, target) {
  return runUnweightedSearch(grid, start, target, false);
}

export function runDfs(grid, start, target) {
  return runUnweightedSearch(grid, start, target, true);
}

function manhattanDistance(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// Queue entries are immutable snapshots. Improved scores enqueue another entry;
// stale snapshots are discarded when popped instead of mutating heap priorities.
function runWeightedSearch(id, grid, start, target) {
  const scores = new Map([[makeKey(start.row, start.col), 0]]);
  const parents = new Map();
  const closed = new Set();
  const visitedOrder = [];
  const explorationEvents = [];
  let sequence = 0;
  const queue = new MinPriorityQueue((a, b) => a.priority - b.priority || a.sequence - b.sequence);
  const heuristic = (node) => id === 'astar' ? manhattanDistance(node, target) : 0;
  queue.push({ node: start, cost: 0, priority: heuristic(start), sequence });

  const result = (found) => {
    const path = found ? reconstructPath(parents, target, start, target) : [];
    return { ...createResult(visitedOrder, path, start, target, grid, found), explorationEvents };
  };

  while (queue.size > 0) {
    const entry = queue.pop();
    const current = entry.node;
    const currentKey = makeKey(current.row, current.col);
    if (closed.has(currentKey) || entry.cost !== scores.get(currentKey)) continue;
    closed.add(currentKey);
    if (!isSpecialNode(current, start, target)) {
      visitedOrder.push(current);
      explorationEvents.push({ type: 'visited', node: current });
    }
    if (sameNode(current, target)) return result(true);

    for (const neighbor of getNeighbors(current, grid)) {
      const key = makeKey(neighbor.row, neighbor.col);
      if (closed.has(key)) continue;
      const cost = entry.cost + getCellCost(grid[neighbor.row][neighbor.col]);
      if (cost >= (scores.get(key) ?? Infinity)) continue;
      scores.set(key, cost);
      parents.set(key, currentKey);
      queue.push({ node: neighbor, cost, priority: cost + heuristic(neighbor), sequence: ++sequence });
      if (!isSpecialNode(neighbor, start, target)) {
        explorationEvents.push({ type: 'frontier', node: neighbor });
      }
    }
  }
  return result(false);
}

export function runDijkstra(grid, start, target) {
  return runWeightedSearch('dijkstra', grid, start, target);
}

export function runAStar(grid, start, target) {
  return runWeightedSearch('astar', grid, start, target);
}

export function runAlgorithm(id, grid, start, target) {
  if (id === 'dfs') return runDfs(grid, start, target);
  if (id === 'dijkstra') return runDijkstra(grid, start, target);
  if (id === 'astar') return runAStar(grid, start, target);
  return runBfs(grid, start, target);
}

export function measureAlgorithm(id, grid, start, target) {
  const startedAt = performance.now();
  const result = runAlgorithm(id, grid, start, target);
  const calculationMs = Number((performance.now() - startedAt).toFixed(2));
  return { ...result, calculationMs };
}

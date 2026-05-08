import { COLS, ROWS, getCellCost, makeKey, sameNode } from '../utils/grid.js';

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
  return directions
    .map((direction) => ({ row: node.row + direction.row, col: node.col + direction.col }))
    .filter((next) => next.row >= 0 && next.row < ROWS && next.col >= 0 && next.col < COLS)
    .filter((next) => grid[next.row][next.col].type !== 'wall');
}

function reconstructPath(parentMap, endNode, start, target) {
  const path = [];
  let currentKey = makeKey(endNode.row, endNode.col);

  while (parentMap.has(currentKey)) {
    const [row, col] = currentKey.split('-').map(Number);
    path.unshift({ row, col });
    currentKey = parentMap.get(currentKey);
  }

  return path.filter((node) => !isSpecialNode(node, start, target));
}

function calculatePathCost(path, target, grid, found) {
  if (!found) return 0;
  const pathCost = path.reduce((sum, node) => sum + getCellCost(grid[node.row][node.col]), 0);
  return pathCost + getCellCost(grid[target.row][target.col]);
}

function createResult(visitedOrder, path, target, grid, found) {
  return {
    visitedOrder,
    path,
    found,
    pathLength: found ? path.length + 1 : 0,
    pathCost: calculatePathCost(path, target, grid, found)
  };
}

export function runBfs(grid, start, target) {
  const queue = [start];
  const visitedSet = new Set([makeKey(start.row, start.col)]);
  const parentMap = new Map();
  const visitedOrder = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (sameNode(current, target)) {
      const path = reconstructPath(parentMap, current, start, target);
      return createResult(visitedOrder, path, target, grid, true);
    }

    for (const neighbor of getNeighbors(current, grid)) {
      const key = makeKey(neighbor.row, neighbor.col);
      if (visitedSet.has(key)) continue;
      visitedSet.add(key);
      parentMap.set(key, makeKey(current.row, current.col));
      if (!sameNode(neighbor, target)) visitedOrder.push(neighbor);
      queue.push(neighbor);
    }
  }

  return createResult(visitedOrder, [], target, grid, false);
}

export function runDfs(grid, start, target) {
  const stack = [start];
  const visitedSet = new Set([makeKey(start.row, start.col)]);
  const parentMap = new Map();
  const visitedOrder = [];

  while (stack.length > 0) {
    const current = stack.pop();
    if (sameNode(current, target)) {
      const path = reconstructPath(parentMap, current, start, target);
      return createResult(visitedOrder, path, target, grid, true);
    }

    const neighbors = getNeighbors(current, grid).reverse();
    for (const neighbor of neighbors) {
      const key = makeKey(neighbor.row, neighbor.col);
      if (visitedSet.has(key)) continue;
      visitedSet.add(key);
      parentMap.set(key, makeKey(current.row, current.col));
      if (!sameNode(neighbor, target)) visitedOrder.push(neighbor);
      stack.push(neighbor);
    }
  }

  return createResult(visitedOrder, [], target, grid, false);
}

function getAllOpenNodes(grid) {
  return grid.flat().filter((cell) => cell.type !== 'wall').map((cell) => ({ row: cell.row, col: cell.col }));
}

function manhattanDistance(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function runDijkstra(grid, start, target) {
  const distances = new Map();
  const parentMap = new Map();
  const visitedSet = new Set();
  const visitedOrder = [];
  const openNodes = getAllOpenNodes(grid);

  for (const node of openNodes) distances.set(makeKey(node.row, node.col), Infinity);
  distances.set(makeKey(start.row, start.col), 0);

  while (openNodes.length > 0) {
    openNodes.sort((a, b) => distances.get(makeKey(a.row, a.col)) - distances.get(makeKey(b.row, b.col)));
    const current = openNodes.shift();
    const currentKey = makeKey(current.row, current.col);
    const currentDistance = distances.get(currentKey);

    if (currentDistance === Infinity) break;
    if (visitedSet.has(currentKey)) continue;
    visitedSet.add(currentKey);

    if (!isSpecialNode(current, start, target)) visitedOrder.push(current);
    if (sameNode(current, target)) {
      const path = reconstructPath(parentMap, current, start, target);
      return createResult(visitedOrder, path, target, grid, true);
    }

    for (const neighbor of getNeighbors(current, grid)) {
      const neighborKey = makeKey(neighbor.row, neighbor.col);
      const nextDistance = currentDistance + getCellCost(grid[neighbor.row][neighbor.col]);
      if (nextDistance < distances.get(neighborKey)) {
        distances.set(neighborKey, nextDistance);
        parentMap.set(neighborKey, currentKey);
      }
    }
  }

  return createResult(visitedOrder, [], target, grid, false);
}

export function runAStar(grid, start, target) {
  const openNodes = [start];
  const openSet = new Set([makeKey(start.row, start.col)]);
  const closedSet = new Set();
  const parentMap = new Map();
  const gScore = new Map([[makeKey(start.row, start.col), 0]]);
  const fScore = new Map([[makeKey(start.row, start.col), manhattanDistance(start, target)]]);
  const visitedOrder = [];

  while (openNodes.length > 0) {
    openNodes.sort((a, b) => (fScore.get(makeKey(a.row, a.col)) ?? Infinity) - (fScore.get(makeKey(b.row, b.col)) ?? Infinity));
    const current = openNodes.shift();
    const currentKey = makeKey(current.row, current.col);
    openSet.delete(currentKey);

    if (closedSet.has(currentKey)) continue;
    closedSet.add(currentKey);

    if (!isSpecialNode(current, start, target)) visitedOrder.push(current);
    if (sameNode(current, target)) {
      const path = reconstructPath(parentMap, current, start, target);
      return createResult(visitedOrder, path, target, grid, true);
    }

    for (const neighbor of getNeighbors(current, grid)) {
      const neighborKey = makeKey(neighbor.row, neighbor.col);
      if (closedSet.has(neighborKey)) continue;

      const tentativeG = (gScore.get(currentKey) ?? Infinity) + getCellCost(grid[neighbor.row][neighbor.col]);
      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        parentMap.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeG);
        fScore.set(neighborKey, tentativeG + manhattanDistance(neighbor, target));

        if (!openSet.has(neighborKey)) {
          openSet.add(neighborKey);
          openNodes.push(neighbor);
        }
      }
    }
  }

  return createResult(visitedOrder, [], target, grid, false);
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
  const calculationMs = Math.max(1, Math.round(performance.now() - startedAt));
  return { ...result, calculationMs };
}

import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const ROWS = 18;
const COLS = 32;
const START_NODE = { row: 8, col: 7 };
const TARGET_NODE = { row: 8, col: 24 };
const BASE_DELAY = 120;

const algorithms = [
  { id: 'bfs', name: 'BFS', description: 'Explores layer by layer and guarantees the shortest path on an unweighted grid.' },
  { id: 'dfs', name: 'DFS', description: 'Goes deep into one direction first. It is useful to understand search behavior, but not always shortest.' },
  { id: 'dijkstra', name: 'Dijkstra', description: 'Finds the shortest path by expanding the cheapest known cells first.' },
  { id: 'astar', name: 'A*', description: 'Uses a heuristic to search toward the target more directly.' }
];

const makeKey = (row, col) => `${row}-${col}`;

function createInitialGrid() {
  return Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => ({
      row,
      col,
      type:
        row === START_NODE.row && col === START_NODE.col
          ? 'start'
          : row === TARGET_NODE.row && col === TARGET_NODE.col
            ? 'target'
            : 'empty'
    }))
  );
}

function cloneGridWithClearedSearch(grid) {
  return grid.map((gridRow) =>
    gridRow.map((cell) => {
      if (cell.type === 'visited' || cell.type === 'path') return { ...cell, type: 'empty' };
      return cell;
    })
  );
}

function getNeighbors(node, grid) {
  const directions = [
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 0, col: -1 }
  ];

  return directions
    .map((direction) => ({ row: node.row + direction.row, col: node.col + direction.col }))
    .filter((next) => next.row >= 0 && next.row < ROWS && next.col >= 0 && next.col < COLS)
    .filter((next) => grid[next.row][next.col].type !== 'wall');
}

function reconstructPath(parentMap, endNode) {
  const path = [];
  let currentKey = makeKey(endNode.row, endNode.col);

  while (parentMap.has(currentKey)) {
    const [row, col] = currentKey.split('-').map(Number);
    path.unshift({ row, col });
    currentKey = parentMap.get(currentKey);
  }

  return path.filter((node) => {
    const isStart = node.row === START_NODE.row && node.col === START_NODE.col;
    const isTarget = node.row === TARGET_NODE.row && node.col === TARGET_NODE.col;
    return !isStart && !isTarget;
  });
}

function runBfs(grid) {
  const queue = [START_NODE];
  const visitedSet = new Set([makeKey(START_NODE.row, START_NODE.col)]);
  const parentMap = new Map();
  const visitedOrder = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (current.row === TARGET_NODE.row && current.col === TARGET_NODE.col) {
      return { visitedOrder, path: reconstructPath(parentMap, current), found: true };
    }

    for (const neighbor of getNeighbors(current, grid)) {
      const key = makeKey(neighbor.row, neighbor.col);
      if (visitedSet.has(key)) continue;
      visitedSet.add(key);
      parentMap.set(key, makeKey(current.row, current.col));
      if (!(neighbor.row === TARGET_NODE.row && neighbor.col === TARGET_NODE.col)) {
        visitedOrder.push(neighbor);
      }
      queue.push(neighbor);
    }
  }

  return { visitedOrder, path: [], found: false };
}

function runDfs(grid) {
  const stack = [START_NODE];
  const visitedSet = new Set([makeKey(START_NODE.row, START_NODE.col)]);
  const parentMap = new Map();
  const visitedOrder = [];

  while (stack.length > 0) {
    const current = stack.pop();
    if (current.row === TARGET_NODE.row && current.col === TARGET_NODE.col) {
      return { visitedOrder, path: reconstructPath(parentMap, current), found: true };
    }

    const neighbors = getNeighbors(current, grid).reverse();
    for (const neighbor of neighbors) {
      const key = makeKey(neighbor.row, neighbor.col);
      if (visitedSet.has(key)) continue;
      visitedSet.add(key);
      parentMap.set(key, makeKey(current.row, current.col));
      if (!(neighbor.row === TARGET_NODE.row && neighbor.col === TARGET_NODE.col)) {
        visitedOrder.push(neighbor);
      }
      stack.push(neighbor);
    }
  }

  return { visitedOrder, path: [], found: false };
}

function getSearchResult(algorithm, grid) {
  if (algorithm === 'dfs') return runDfs(grid);
  return runBfs(grid);
}

function applyCellType(grid, node, type) {
  return grid.map((gridRow) =>
    gridRow.map((cell) => {
      if (cell.row !== node.row || cell.col !== node.col) return cell;
      if (cell.type === 'start' || cell.type === 'target' || cell.type === 'wall') return cell;
      return { ...cell, type };
    })
  );
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function App() {
  const [grid, setGrid] = useState(createInitialGrid);
  const [tool, setTool] = useState('wall');
  const [algorithm, setAlgorithm] = useState('bfs');
  const [theme, setTheme] = useState('dark');
  const [speed, setSpeed] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Draw walls, choose an algorithm, then run the visualization.');
  const [stats, setStats] = useState({ visited: 0, pathLength: 0, runtime: 0 });

  const activeAlgorithm = useMemo(
    () => algorithms.find((item) => item.id === algorithm) ?? algorithms[0],
    [algorithm]
  );

  const counts = useMemo(() => {
    const flat = grid.flat();
    return {
      walls: flat.filter((cell) => cell.type === 'wall').length,
      empty: flat.filter((cell) => cell.type === 'empty').length
    };
  }, [grid]);

  const updateCell = (row, col) => {
    if (isRunning) return;
    setGrid((currentGrid) => {
      const clearedGrid = cloneGridWithClearedSearch(currentGrid);
      const selected = clearedGrid[row][col];
      if (selected.type === 'start' || selected.type === 'target') return clearedGrid;

      return clearedGrid.map((gridRow) =>
        gridRow.map((cell) => {
          if (cell.row !== row || cell.col !== col) return cell;
          if (tool === 'erase') return { ...cell, type: 'empty' };
          return { ...cell, type: 'wall' };
        })
      );
    });
  };

  const resetGrid = () => {
    if (isRunning) return;
    setGrid(createInitialGrid());
    setStatusMessage('Grid reset. Ready for a new visualization.');
    setStats({ visited: 0, pathLength: 0, runtime: 0 });
  };

  const clearWalls = () => {
    if (isRunning) return;
    setGrid((currentGrid) =>
      cloneGridWithClearedSearch(currentGrid).map((gridRow) =>
        gridRow.map((cell) => (cell.type === 'wall' ? { ...cell, type: 'empty' } : cell))
      )
    );
    setStatusMessage('Walls cleared.');
  };

  const clearPath = () => {
    if (isRunning) return;
    setGrid((currentGrid) => cloneGridWithClearedSearch(currentGrid));
    setStats({ visited: 0, pathLength: 0, runtime: 0 });
    setStatusMessage('Search result cleared.');
  };

  const visualize = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setStatusMessage(`${activeAlgorithm.name} is searching...`);
    const startedAt = performance.now();

    let preparedGrid = null;
    setGrid((currentGrid) => {
      preparedGrid = cloneGridWithClearedSearch(currentGrid);
      return preparedGrid;
    });

    await wait(20);
    const result = getSearchResult(algorithm, preparedGrid);
    const delay = Math.max(5, BASE_DELAY - speed);

    for (const node of result.visitedOrder) {
      setGrid((currentGrid) => applyCellType(currentGrid, node, 'visited'));
      await wait(delay);
    }

    for (const node of result.path) {
      setGrid((currentGrid) => applyCellType(currentGrid, node, 'path'));
      await wait(Math.max(8, delay * 1.6));
    }

    const runtime = Math.round(performance.now() - startedAt);
    setStats({ visited: result.visitedOrder.length, pathLength: result.path.length, runtime });
    setStatusMessage(
      result.found
        ? `${activeAlgorithm.name} found a path with ${result.path.length} cells.`
        : `${activeAlgorithm.name} could not reach the target.`
    );
    setIsRunning(false);
  };

  return (
    <main className={`app ${theme}`}>
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Interactive pathfinding visualizer</p>
          <h1>PathLab</h1>
          <p className="hero-text">
            Build walls, compare algorithms, and watch how a search moves from start to target.
          </p>
        </div>
        <button className="theme-toggle" disabled={isRunning} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </section>

      <section className="workspace">
        <aside className="panel controls-panel">
          <h2>Controls</h2>

          <label>
            Algorithm
            <select disabled={isRunning} value={algorithm} onChange={(event) => setAlgorithm(event.target.value)}>
              {algorithms.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>

          <div className="tool-row">
            <button disabled={isRunning} className={tool === 'wall' ? 'active' : ''} onClick={() => setTool('wall')}>Draw walls</button>
            <button disabled={isRunning} className={tool === 'erase' ? 'active' : ''} onClick={() => setTool('erase')}>Erase</button>
          </div>

          <label>
            Animation speed
            <input disabled={isRunning} type="range" min="1" max="100" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
          </label>

          <div className="action-grid">
            <button className="primary" disabled={isRunning} onClick={visualize}>{isRunning ? 'Running...' : 'Run visualization'}</button>
            <button disabled={isRunning} onClick={clearPath}>Clear path</button>
            <button disabled={isRunning} onClick={clearWalls}>Clear walls</button>
            <button disabled={isRunning} onClick={resetGrid}>Reset grid</button>
          </div>

          <p className="status-message">{statusMessage}</p>
        </aside>

        <section className="board-card">
          <div className="legend">
            <span><i className="legend-dot start" /> Start</span>
            <span><i className="legend-dot target" /> Target</span>
            <span><i className="legend-dot wall" /> Wall</span>
            <span><i className="legend-dot visited" /> Visited</span>
            <span><i className="legend-dot path" /> Path</span>
            <span><i className="legend-dot empty" /> Empty</span>
          </div>

          <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
            {grid.flat().map((cell) => (
              <button
                key={`${cell.row}-${cell.col}`}
                className={`cell ${cell.type}`}
                aria-label={`${cell.type} cell at row ${cell.row + 1}, column ${cell.col + 1}`}
                disabled={isRunning}
                onClick={() => updateCell(cell.row, cell.col)}
              />
            ))}
          </div>
        </section>

        <aside className="panel info-panel">
          <h2>{activeAlgorithm.name}</h2>
          <p>{activeAlgorithm.description}</p>

          <div className="stats-grid">
            <article><strong>{stats.visited}</strong><span>Visited cells</span></article>
            <article><strong>{stats.pathLength}</strong><span>Path cells</span></article>
            <article><strong>{stats.runtime} ms</strong><span>Runtime</span></article>
            <article><strong>{counts.walls}</strong><span>Walls</span></article>
          </div>

          <div className="tip-box">
            <strong>Beginner tip</strong>
            <p>Start with BFS, draw a few walls, then compare the behavior with DFS.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import en from './i18n/en.json';
import de from './i18n/de.json';
import './styles.css';

const ROWS = 18;
const COLS = 32;
const START_NODE = { row: 8, col: 7 };
const TARGET_NODE = { row: 8, col: 24 };
const BASE_DELAY = 120;
const dictionaries = { en, de };
const algorithmIds = ['bfs', 'dfs', 'dijkstra', 'astar'];

const makeKey = (row, col) => `${row}-${col}`;
const isTargetNode = (node) => node.row === TARGET_NODE.row && node.col === TARGET_NODE.col;
const isSpecialNode = (node) =>
  (node.row === START_NODE.row && node.col === START_NODE.col) || isTargetNode(node);

function translate(template, values = {}) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, String(value)),
    template
  );
}

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

  return path.filter((node) => !isSpecialNode(node));
}

function runBfs(grid) {
  const queue = [START_NODE];
  const visitedSet = new Set([makeKey(START_NODE.row, START_NODE.col)]);
  const parentMap = new Map();
  const visitedOrder = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (isTargetNode(current)) {
      return { visitedOrder, path: reconstructPath(parentMap, current), found: true };
    }

    for (const neighbor of getNeighbors(current, grid)) {
      const key = makeKey(neighbor.row, neighbor.col);
      if (visitedSet.has(key)) continue;
      visitedSet.add(key);
      parentMap.set(key, makeKey(current.row, current.col));
      if (!isTargetNode(neighbor)) visitedOrder.push(neighbor);
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
    if (isTargetNode(current)) {
      return { visitedOrder, path: reconstructPath(parentMap, current), found: true };
    }

    const neighbors = getNeighbors(current, grid).reverse();
    for (const neighbor of neighbors) {
      const key = makeKey(neighbor.row, neighbor.col);
      if (visitedSet.has(key)) continue;
      visitedSet.add(key);
      parentMap.set(key, makeKey(current.row, current.col));
      if (!isTargetNode(neighbor)) visitedOrder.push(neighbor);
      stack.push(neighbor);
    }
  }

  return { visitedOrder, path: [], found: false };
}

function getAllOpenNodes(grid) {
  return grid.flat().filter((cell) => cell.type !== 'wall');
}

function manhattanDistance(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function runDijkstra(grid) {
  const distances = new Map();
  const parentMap = new Map();
  const visitedSet = new Set();
  const visitedOrder = [];
  const openNodes = getAllOpenNodes(grid).map((cell) => ({ row: cell.row, col: cell.col }));

  for (const node of openNodes) distances.set(makeKey(node.row, node.col), Infinity);
  distances.set(makeKey(START_NODE.row, START_NODE.col), 0);

  while (openNodes.length > 0) {
    openNodes.sort((a, b) => distances.get(makeKey(a.row, a.col)) - distances.get(makeKey(b.row, b.col)));
    const current = openNodes.shift();
    const currentKey = makeKey(current.row, current.col);
    const currentDistance = distances.get(currentKey);

    if (currentDistance === Infinity) break;
    if (visitedSet.has(currentKey)) continue;
    visitedSet.add(currentKey);

    if (!isSpecialNode(current)) visitedOrder.push(current);
    if (isTargetNode(current)) {
      return { visitedOrder, path: reconstructPath(parentMap, current), found: true };
    }

    for (const neighbor of getNeighbors(current, grid)) {
      const neighborKey = makeKey(neighbor.row, neighbor.col);
      const nextDistance = currentDistance + 1;
      if (nextDistance < distances.get(neighborKey)) {
        distances.set(neighborKey, nextDistance);
        parentMap.set(neighborKey, currentKey);
      }
    }
  }

  return { visitedOrder, path: [], found: false };
}

function runAStar(grid) {
  const openNodes = [START_NODE];
  const openSet = new Set([makeKey(START_NODE.row, START_NODE.col)]);
  const closedSet = new Set();
  const parentMap = new Map();
  const gScore = new Map([[makeKey(START_NODE.row, START_NODE.col), 0]]);
  const fScore = new Map([[makeKey(START_NODE.row, START_NODE.col), manhattanDistance(START_NODE, TARGET_NODE)]]);
  const visitedOrder = [];

  while (openNodes.length > 0) {
    openNodes.sort((a, b) => (fScore.get(makeKey(a.row, a.col)) ?? Infinity) - (fScore.get(makeKey(b.row, b.col)) ?? Infinity));
    const current = openNodes.shift();
    const currentKey = makeKey(current.row, current.col);
    openSet.delete(currentKey);

    if (closedSet.has(currentKey)) continue;
    closedSet.add(currentKey);

    if (!isSpecialNode(current)) visitedOrder.push(current);
    if (isTargetNode(current)) {
      return { visitedOrder, path: reconstructPath(parentMap, current), found: true };
    }

    for (const neighbor of getNeighbors(current, grid)) {
      const neighborKey = makeKey(neighbor.row, neighbor.col);
      if (closedSet.has(neighborKey)) continue;

      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;
      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        parentMap.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeG);
        fScore.set(neighborKey, tentativeG + manhattanDistance(neighbor, TARGET_NODE));

        if (!openSet.has(neighborKey)) {
          openSet.add(neighborKey);
          openNodes.push(neighbor);
        }
      }
    }
  }

  return { visitedOrder, path: [], found: false };
}

function getSearchResult(algorithm, grid) {
  if (algorithm === 'dfs') return runDfs(grid);
  if (algorithm === 'dijkstra') return runDijkstra(grid);
  if (algorithm === 'astar') return runAStar(grid);
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
  const [language, setLanguage] = useState('de');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [speed, setSpeed] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const dictionary = dictionaries[language];
  const [statusMessage, setStatusMessage] = useState(dictionaries.de.status.initial);
  const [stats, setStats] = useState({ visited: 0, pathLength: 0, runtime: 0 });

  const activeAlgorithm = useMemo(
    () => ({ id: algorithm, ...dictionary.algorithms[algorithm] }),
    [algorithm, dictionary]
  );

  const counts = useMemo(() => {
    const flat = grid.flat();
    return {
      walls: flat.filter((cell) => cell.type === 'wall').length,
      empty: flat.filter((cell) => cell.type === 'empty').length
    };
  }, [grid]);

  const switchLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setStatusMessage(dictionaries[nextLanguage].status.initial);
  };

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
    setStatusMessage(dictionary.status.reset);
    setStats({ visited: 0, pathLength: 0, runtime: 0 });
  };

  const clearWalls = () => {
    if (isRunning) return;
    setGrid((currentGrid) =>
      cloneGridWithClearedSearch(currentGrid).map((gridRow) =>
        gridRow.map((cell) => (cell.type === 'wall' ? { ...cell, type: 'empty' } : cell))
      )
    );
    setStatusMessage(dictionary.status.wallsCleared);
  };

  const clearPath = () => {
    if (isRunning) return;
    setGrid((currentGrid) => cloneGridWithClearedSearch(currentGrid));
    setStats({ visited: 0, pathLength: 0, runtime: 0 });
    setStatusMessage(dictionary.status.pathCleared);
  };

  const visualize = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowOnboarding(false);
    setStatusMessage(translate(dictionary.status.searching, { algorithm: activeAlgorithm.name }));

    let preparedGrid = null;
    setGrid((currentGrid) => {
      preparedGrid = cloneGridWithClearedSearch(currentGrid);
      return preparedGrid;
    });

    await wait(20);
    const algorithmStartedAt = performance.now();
    const result = getSearchResult(algorithm, preparedGrid);
    const algorithmRuntime = Math.max(1, Math.round(performance.now() - algorithmStartedAt));
    const delay = Math.max(5, BASE_DELAY - speed);

    for (const node of result.visitedOrder) {
      setGrid((currentGrid) => applyCellType(currentGrid, node, 'visited'));
      await wait(delay);
    }

    for (const node of result.path) {
      setGrid((currentGrid) => applyCellType(currentGrid, node, 'path'));
      await wait(Math.max(8, delay * 1.6));
    }

    setStats({ visited: result.visitedOrder.length, pathLength: result.path.length, runtime: algorithmRuntime });
    setStatusMessage(
      result.found
        ? translate(dictionary.status.found, { algorithm: activeAlgorithm.name, count: result.path.length })
        : translate(dictionary.status.notFound, { algorithm: activeAlgorithm.name })
    );
    setIsRunning(false);
  };

  return (
    <main className={`app ${theme}`}>
      <section className="hero-panel">
        <div>
          <p className="eyebrow">{dictionary.app.eyebrow}</p>
          <h1>{dictionary.app.title}</h1>
          <p className="hero-text">{dictionary.app.heroText}</p>
        </div>
        <div className="top-actions">
          <div className="language-switch" aria-label="Language switch">
            <button className={language === 'de' ? 'active' : ''} disabled={isRunning} onClick={() => switchLanguage('de')}>DE</button>
            <button className={language === 'en' ? 'active' : ''} disabled={isRunning} onClick={() => switchLanguage('en')}>EN</button>
          </div>
          <button className="theme-toggle" disabled={isRunning} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? dictionary.app.lightMode : dictionary.app.darkMode}
          </button>
        </div>
      </section>

      {showOnboarding && (
        <section className="onboarding-card">
          <div>
            <p className="eyebrow">Tutorial</p>
            <h2>{dictionary.onboarding.title}</h2>
            <p>{dictionary.onboarding.text}</p>
            <ul>
              {dictionary.onboarding.steps.map((step) => <li key={step}>{step}</li>)}
            </ul>
          </div>
          <button className="primary" onClick={() => setShowOnboarding(false)}>{dictionary.onboarding.dismiss}</button>
        </section>
      )}

      <section className="workspace">
        <aside className="panel controls-panel">
          <h2>{dictionary.controls.title}</h2>

          <label>
            {dictionary.controls.algorithm}
            <select disabled={isRunning} value={algorithm} onChange={(event) => setAlgorithm(event.target.value)}>
              {algorithmIds.map((id) => (
                <option key={id} value={id}>{dictionary.algorithms[id].name}</option>
              ))}
            </select>
          </label>

          <div className="tool-row">
            <button disabled={isRunning} className={tool === 'wall' ? 'active' : ''} onClick={() => setTool('wall')}>{dictionary.controls.drawWalls}</button>
            <button disabled={isRunning} className={tool === 'erase' ? 'active' : ''} onClick={() => setTool('erase')}>{dictionary.controls.erase}</button>
          </div>

          <label>
            {dictionary.controls.animationSpeed}
            <input disabled={isRunning} type="range" min="1" max="100" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
          </label>

          <div className="action-grid">
            <button className="primary" disabled={isRunning} onClick={visualize}>{isRunning ? dictionary.controls.running : dictionary.controls.run}</button>
            <button disabled={isRunning} onClick={clearPath}>{dictionary.controls.clearPath}</button>
            <button disabled={isRunning} onClick={clearWalls}>{dictionary.controls.clearWalls}</button>
            <button disabled={isRunning} onClick={resetGrid}>{dictionary.controls.resetGrid}</button>
          </div>

          <p className="status-message">{statusMessage}</p>
        </aside>

        <section className="board-card">
          <div className="legend">
            <span><i className="legend-dot start" /> {dictionary.legend.start}</span>
            <span><i className="legend-dot target" /> {dictionary.legend.target}</span>
            <span><i className="legend-dot wall" /> {dictionary.legend.wall}</span>
            <span><i className="legend-dot visited" /> {dictionary.legend.visited}</span>
            <span><i className="legend-dot path" /> {dictionary.legend.path}</span>
            <span><i className="legend-dot empty" /> {dictionary.legend.empty}</span>
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
            <article><strong>{stats.visited}</strong><span>{dictionary.stats.visitedCells}</span></article>
            <article><strong>{stats.pathLength}</strong><span>{dictionary.stats.pathCells}</span></article>
            <article><strong>{stats.runtime} ms</strong><span>{dictionary.stats.runtime}</span></article>
            <article><strong>{counts.walls}</strong><span>{dictionary.stats.walls}</span></article>
          </div>

          <div className="tip-box">
            <strong>{dictionary.tip.title}</strong>
            <p>{dictionary.tip.text}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

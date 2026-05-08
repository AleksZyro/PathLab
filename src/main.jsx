import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const ROWS = 18;
const COLS = 32;
const START_NODE = { row: 8, col: 7 };
const TARGET_NODE = { row: 8, col: 24 };

const algorithms = [
  { id: 'bfs', name: 'BFS', description: 'Explores layer by layer and guarantees the shortest path on an unweighted grid.' },
  { id: 'dfs', name: 'DFS', description: 'Goes deep into one direction first. It is useful to understand search behavior, but not always shortest.' },
  { id: 'dijkstra', name: 'Dijkstra', description: 'Finds the shortest path by expanding the cheapest known cells first.' },
  { id: 'astar', name: 'A*', description: 'Uses a heuristic to search toward the target more directly.' }
];

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

function App() {
  const [grid, setGrid] = useState(createInitialGrid);
  const [tool, setTool] = useState('wall');
  const [algorithm, setAlgorithm] = useState('bfs');
  const [theme, setTheme] = useState('dark');
  const [speed, setSpeed] = useState(45);
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
    setGrid((currentGrid) => {
      const selected = currentGrid[row][col];
      if (selected.type === 'start' || selected.type === 'target') return currentGrid;

      return currentGrid.map((gridRow) =>
        gridRow.map((cell) => {
          if (cell.row !== row || cell.col !== col) return cell;
          if (tool === 'erase') return { ...cell, type: 'empty' };
          return { ...cell, type: 'wall' };
        })
      );
    });
  };

  const resetGrid = () => {
    setGrid(createInitialGrid());
    setStats({ visited: 0, pathLength: 0, runtime: 0 });
  };

  const clearWalls = () => {
    setGrid((currentGrid) =>
      currentGrid.map((gridRow) =>
        gridRow.map((cell) => (cell.type === 'wall' ? { ...cell, type: 'empty' } : cell))
      )
    );
  };

  const simulatePreviewStats = () => {
    const visited = Math.max(1, Math.round((ROWS * COLS - counts.walls) * (algorithm === 'dfs' ? 0.48 : 0.66)));
    const pathLength = Math.max(0, Math.abs(TARGET_NODE.col - START_NODE.col) + Math.abs(TARGET_NODE.row - START_NODE.row));
    const runtime = Math.round(visited * (101 - speed) * 0.08);
    setStats({ visited, pathLength, runtime });
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
        <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </section>

      <section className="workspace">
        <aside className="panel controls-panel">
          <h2>Controls</h2>

          <label>
            Algorithm
            <select value={algorithm} onChange={(event) => setAlgorithm(event.target.value)}>
              {algorithms.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>

          <div className="tool-row">
            <button className={tool === 'wall' ? 'active' : ''} onClick={() => setTool('wall')}>Draw walls</button>
            <button className={tool === 'erase' ? 'active' : ''} onClick={() => setTool('erase')}>Erase</button>
          </div>

          <label>
            Animation speed
            <input type="range" min="1" max="100" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
          </label>

          <div className="action-grid">
            <button className="primary" onClick={simulatePreviewStats}>Preview run</button>
            <button onClick={clearWalls}>Clear walls</button>
            <button onClick={resetGrid}>Reset grid</button>
          </div>
        </aside>

        <section className="board-card">
          <div className="legend">
            <span><i className="legend-dot start" /> Start</span>
            <span><i className="legend-dot target" /> Target</span>
            <span><i className="legend-dot wall" /> Wall</span>
            <span><i className="legend-dot empty" /> Empty</span>
          </div>

          <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
            {grid.flat().map((cell) => (
              <button
                key={`${cell.row}-${cell.col}`}
                className={`cell ${cell.type}`}
                aria-label={`${cell.type} cell at row ${cell.row + 1}, column ${cell.col + 1}`}
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
            <article><strong>{stats.pathLength}</strong><span>Path length</span></article>
            <article><strong>{stats.runtime} ms</strong><span>Runtime preview</span></article>
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

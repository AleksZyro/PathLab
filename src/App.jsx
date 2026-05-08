import { useMemo, useState } from 'react';
import { algorithmIds, measureAlgorithm } from './algorithms/pathfinding.js';
import Controls from './components/Controls.jsx';
import ComparePanel from './components/ComparePanel.jsx';
import GridBoard from './components/GridBoard.jsx';
import LanguageSwitch from './components/LanguageSwitch.jsx';
import Onboarding from './components/Onboarding.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import de from './i18n/de.json';
import en from './i18n/en.json';
import {
  DEFAULT_START,
  DEFAULT_TARGET,
  applySearchType,
  cloneGridWithClearedSearch,
  countCells,
  createGrid,
  isBlockedForSpecialTool,
  moveSpecialNode,
  sameNode
} from './utils/grid.js';

const dictionaries = { de, en };
const BASE_DELAY = 120;
const emptyStats = { visited: 0, pathLength: 0, pathCost: 0, calculationMs: 0, animationMs: 0 };

function translate(template, values = {}) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, String(value)),
    template
  );
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function App() {
  const [language, setLanguage] = useState('de');
  const dictionary = dictionaries[language];
  const [theme, setTheme] = useState('dark');
  const [startNode, setStartNode] = useState(DEFAULT_START);
  const [targetNode, setTargetNode] = useState(DEFAULT_TARGET);
  const [grid, setGrid] = useState(() => createGrid(DEFAULT_START, DEFAULT_TARGET));
  const [tool, setTool] = useState('wall');
  const [algorithm, setAlgorithm] = useState('bfs');
  const [speed, setSpeed] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [statusMessage, setStatusMessage] = useState(dictionaries.de.status.initial);
  const [stats, setStats] = useState(emptyStats);
  const [comparisonRows, setComparisonRows] = useState([]);

  const activeAlgorithm = useMemo(
    () => ({ id: algorithm, ...dictionary.algorithms[algorithm] }),
    [algorithm, dictionary]
  );

  const wallCount = useMemo(() => countCells(grid, 'wall'), [grid]);

  const switchLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setStatusMessage(dictionaries[nextLanguage].status.initial);
  };

  const updateCell = (row, col) => {
    if (isRunning) return;
    const selectedNode = { row, col };

    setGrid((currentGrid) => {
      const clearedGrid = cloneGridWithClearedSearch(currentGrid);
      const selectedCell = clearedGrid[row][col];

      if (tool === 'start') {
        if (sameNode(selectedNode, targetNode) || selectedCell.type === 'wall') return clearedGrid;
        setStartNode(selectedNode);
        return moveSpecialNode(clearedGrid, startNode, selectedNode, 'start');
      }

      if (tool === 'target') {
        if (sameNode(selectedNode, startNode) || selectedCell.type === 'wall') return clearedGrid;
        setTargetNode(selectedNode);
        return moveSpecialNode(clearedGrid, targetNode, selectedNode, 'target');
      }

      if (isBlockedForSpecialTool(selectedCell)) return clearedGrid;

      return clearedGrid.map((gridRow) =>
        gridRow.map((cell) => {
          if (cell.row !== row || cell.col !== col) return cell;
          if (tool === 'erase') return { ...cell, type: 'empty' };
          return { ...cell, type: tool };
        })
      );
    });

    setComparisonRows([]);
  };

  const resetGrid = () => {
    if (isRunning) return;
    setStartNode(DEFAULT_START);
    setTargetNode(DEFAULT_TARGET);
    setGrid(createGrid(DEFAULT_START, DEFAULT_TARGET));
    setStats(emptyStats);
    setComparisonRows([]);
    setStatusMessage(dictionary.status.reset);
  };

  const clearWalls = () => {
    if (isRunning) return;
    setGrid((currentGrid) =>
      cloneGridWithClearedSearch(currentGrid).map((gridRow) =>
        gridRow.map((cell) => (['wall', 'water', 'mud'].includes(cell.type) ? { ...cell, type: 'empty' } : cell))
      )
    );
    setComparisonRows([]);
    setStatusMessage(dictionary.status.wallsCleared);
  };

  const clearPath = () => {
    if (isRunning) return;
    setGrid((currentGrid) => cloneGridWithClearedSearch(currentGrid));
    setStats(emptyStats);
    setComparisonRows([]);
    setStatusMessage(dictionary.status.pathCleared);
  };

  const visualize = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowOnboarding(false);
    setComparisonRows([]);
    setStatusMessage(translate(dictionary.status.searching, { algorithm: activeAlgorithm.name }));

    let preparedGrid = null;
    setGrid((currentGrid) => {
      preparedGrid = cloneGridWithClearedSearch(currentGrid);
      return preparedGrid;
    });

    await wait(20);
    const result = measureAlgorithm(algorithm, preparedGrid, startNode, targetNode);
    const delay = Math.max(5, BASE_DELAY - speed);
    const animationStartedAt = performance.now();

    for (const node of result.visitedOrder) {
      setGrid((currentGrid) => applySearchType(currentGrid, node, 'visited'));
      await wait(delay);
    }

    for (const node of result.path) {
      setGrid((currentGrid) => applySearchType(currentGrid, node, 'path'));
      await wait(Math.max(8, delay * 1.6));
    }

    const animationMs = Math.round(performance.now() - animationStartedAt);
    setStats({
      visited: result.visitedOrder.length,
      pathLength: result.pathLength,
      pathCost: result.pathCost,
      calculationMs: result.calculationMs,
      animationMs
    });
    setStatusMessage(
      result.found
        ? translate(dictionary.status.found, { algorithm: activeAlgorithm.name, count: result.pathLength })
        : translate(dictionary.status.notFound, { algorithm: activeAlgorithm.name })
    );
    setIsRunning(false);
  };

  const compareAlgorithms = () => {
    if (isRunning) return;
    const preparedGrid = cloneGridWithClearedSearch(grid);
    const rows = algorithmIds.map((id) => {
      const result = measureAlgorithm(id, preparedGrid, startNode, targetNode);
      return {
        id,
        name: dictionary.algorithms[id].name,
        found: result.found,
        visited: result.visitedOrder.length,
        pathLength: result.pathLength,
        pathCost: result.pathCost,
        calculationMs: result.calculationMs
      };
    });
    setComparisonRows(rows);
    setStatusMessage(dictionary.status.compared);
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
          <LanguageSwitch language={language} disabled={isRunning} onChange={switchLanguage} />
          <button className="theme-toggle" disabled={isRunning} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? dictionary.app.lightMode : dictionary.app.darkMode}
          </button>
        </div>
      </section>

      {showOnboarding && <Onboarding dictionary={dictionary} onDismiss={() => setShowOnboarding(false)} />}

      <section className="workspace">
        <Controls
          dictionary={dictionary}
          algorithm={algorithm}
          tool={tool}
          speed={speed}
          isRunning={isRunning}
          statusMessage={statusMessage}
          onAlgorithmChange={setAlgorithm}
          onToolChange={setTool}
          onSpeedChange={setSpeed}
          onRun={visualize}
          onCompare={compareAlgorithms}
          onClearPath={clearPath}
          onClearWalls={clearWalls}
          onReset={resetGrid}
        />
        <GridBoard dictionary={dictionary} grid={grid} isRunning={isRunning} onCellClick={updateCell} />
        <StatsPanel dictionary={dictionary} activeAlgorithm={activeAlgorithm} stats={stats} wallCount={wallCount} />
      </section>

      <ComparePanel dictionary={dictionary} rows={comparisonRows} />
    </main>
  );
}

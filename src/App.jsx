import { useEffect, useMemo, useState } from 'react';
import { algorithmIds, measureAlgorithm } from './algorithms/pathfinding.js';
import ActionPanel from './components/ActionPanel.jsx';
import Controls from './components/Controls.jsx';
import ComparePanel from './components/ComparePanel.jsx';
import GridBoard from './components/GridBoard.jsx';
import LanguageSwitch from './components/LanguageSwitch.jsx';
import Onboarding from './components/Onboarding.jsx';
import PathLabLogo from './components/PathLabLogo.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import de from './i18n/de.json';
import en from './i18n/en.json';
import { createPreset } from './utils/presets.js';
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
const emptyBreakdown = {
  normal: { count: 0, cost: 0 },
  water: { count: 0, cost: 0 },
  mud: { count: 0, cost: 0 }
};
const emptyStats = { visited: 0, pathLength: 0, pathCost: 0, calculationMs: 0, animationMs: 0, costBreakdown: emptyBreakdown };

function translate(template, values = {}) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, String(value)),
    template
  );
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createSnapshot(grid, startNode, targetNode) {
  return { grid, startNode, targetNode };
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
  const [preset, setPreset] = useState('custom');
  const [speed, setSpeed] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [statusMessage, setStatusMessage] = useState(dictionaries.de.status.initial);
  const [stats, setStats] = useState(emptyStats);
  const [comparisonRows, setComparisonRows] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [liveExplanation, setLiveExplanation] = useState(dictionaries.de.live.ready);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const activeAlgorithm = useMemo(
    () => ({ id: algorithm, ...dictionary.algorithms[algorithm] }),
    [algorithm, dictionary]
  );

  const wallCount = useMemo(() => countCells(grid, 'wall'), [grid]);

  const pushHistory = (snapshot) => {
    setUndoStack((current) => [...current.slice(-24), snapshot]);
    setRedoStack([]);
  };

  const restoreSnapshot = (snapshot) => {
    setGrid(snapshot.grid);
    setStartNode(snapshot.startNode);
    setTargetNode(snapshot.targetNode);
    setStats(emptyStats);
    setComparisonRows([]);
  };

  const switchLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    setStatusMessage(dictionaries[nextLanguage].status.initial);
    setLiveExplanation(dictionaries[nextLanguage].live.ready);
  };

  const applyCellEdit = (currentGrid, row, col) => {
    const selectedNode = { row, col };
    const clearedGrid = cloneGridWithClearedSearch(currentGrid);
    const selectedCell = clearedGrid[row][col];

    if (tool === 'start') {
      if (sameNode(selectedNode, targetNode) || selectedCell.type === 'wall') return { nextGrid: clearedGrid };
      setStartNode(selectedNode);
      return { nextGrid: moveSpecialNode(clearedGrid, startNode, selectedNode, 'start') };
    }

    if (tool === 'target') {
      if (sameNode(selectedNode, startNode) || selectedCell.type === 'wall') return { nextGrid: clearedGrid };
      setTargetNode(selectedNode);
      return { nextGrid: moveSpecialNode(clearedGrid, targetNode, selectedNode, 'target') };
    }

    if (isBlockedForSpecialTool(selectedCell)) return { nextGrid: clearedGrid };

    return {
      nextGrid: clearedGrid.map((gridRow) =>
        gridRow.map((cell) => {
          if (cell.row !== row || cell.col !== col) return cell;
          if (tool === 'erase') return { ...cell, type: 'empty' };
          return { ...cell, type: tool };
        })
      )
    };
  };

  const updateCell = (row, col, options = { commitHistory: true }) => {
    if (isRunning) return;
    if (options.commitHistory) pushHistory(createSnapshot(grid, startNode, targetNode));

    setGrid((currentGrid) => applyCellEdit(currentGrid, row, col).nextGrid);
    setPreset('custom');
    setComparisonRows([]);
    setStats(emptyStats);
  };

  const undo = () => {
    if (!undoStack.length || isRunning) return;
    const previous = undoStack.at(-1);
    setUndoStack((current) => current.slice(0, -1));
    setRedoStack((current) => [...current, createSnapshot(grid, startNode, targetNode)]);
    restoreSnapshot(previous);
    setStatusMessage(dictionary.status.undo);
  };

  const redo = () => {
    if (!redoStack.length || isRunning) return;
    const next = redoStack.at(-1);
    setRedoStack((current) => current.slice(0, -1));
    setUndoStack((current) => [...current, createSnapshot(grid, startNode, targetNode)]);
    restoreSnapshot(next);
    setStatusMessage(dictionary.status.redo);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTyping = ['INPUT', 'SELECT', 'TEXTAREA'].includes(target?.tagName) || target?.isContentEditable;
      if (isTyping || isRunning) return;

      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      }

      if ((event.ctrlKey || event.metaKey) && (key === 'y' || (key === 'z' && event.shiftKey))) {
        event.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack, grid, startNode, targetNode, isRunning, dictionary]);

  const loadPreset = (presetId) => {
    if (isRunning) return;
    if (presetId === 'custom') {
      setPreset('custom');
      return;
    }
    pushHistory(createSnapshot(grid, startNode, targetNode));
    const nextPreset = createPreset(presetId);
    setGrid(nextPreset.grid);
    setStartNode(nextPreset.start);
    setTargetNode(nextPreset.target);
    setPreset(presetId);
    setStats(emptyStats);
    setComparisonRows([]);
    setStatusMessage(translate(dictionary.status.presetLoaded, { preset: dictionary.presets[presetId] }));
  };

  const resetGrid = () => {
    if (isRunning) return;
    pushHistory(createSnapshot(grid, startNode, targetNode));
    setStartNode(DEFAULT_START);
    setTargetNode(DEFAULT_TARGET);
    setGrid(createGrid(DEFAULT_START, DEFAULT_TARGET));
    setPreset('custom');
    setStats(emptyStats);
    setComparisonRows([]);
    setStatusMessage(dictionary.status.reset);
  };

  const clearWalls = () => {
    if (isRunning) return;
    pushHistory(createSnapshot(grid, startNode, targetNode));
    setGrid((currentGrid) =>
      cloneGridWithClearedSearch(currentGrid).map((gridRow) =>
        gridRow.map((cell) => (['wall', 'water', 'mud'].includes(cell.type) ? { ...cell, type: 'empty' } : cell))
      )
    );
    setPreset('custom');
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
    setLiveExplanation(dictionary.live[algorithm]);
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
      animationMs,
      costBreakdown: result.costBreakdown
    });
    setStatusMessage(
      result.found
        ? translate(dictionary.status.found, { algorithm: activeAlgorithm.name, count: result.pathLength })
        : translate(dictionary.status.notFound, { algorithm: activeAlgorithm.name })
    );
    setLiveExplanation(result.found ? dictionary.live.done : dictionary.live.noPath);
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
        <div className="hero-copy">
          <p className="eyebrow">{dictionary.app.eyebrow}</p>
          <div className="hero-title-row">
            <h1>{dictionary.app.title}</h1>
            <PathLabLogo />
          </div>
        </div>
        <div className="top-actions">
          <LanguageSwitch language={language} disabled={isRunning} onChange={switchLanguage} />
          <button
            className="theme-toggle icon-theme-toggle"
            aria-label={theme === 'dark' ? dictionary.app.lightMode : dictionary.app.darkMode}
            title={theme === 'dark' ? dictionary.app.lightMode : dictionary.app.darkMode}
            disabled={isRunning}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
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
          preset={preset}
          isRunning={isRunning}
          onAlgorithmChange={setAlgorithm}
          onToolChange={setTool}
          onSpeedChange={setSpeed}
          onPresetChange={loadPreset}
        />
        <div className="board-column">
          <GridBoard
            dictionary={dictionary}
            grid={grid}
            tool={tool}
            isRunning={isRunning}
            onCellAction={updateCell}
            onHoverCell={setHoveredCell}
            onLeaveGrid={() => setHoveredCell(null)}
          />
          <ActionPanel
            dictionary={dictionary}
            isRunning={isRunning}
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
            statusMessage={statusMessage}
            onRun={visualize}
            onCompare={compareAlgorithms}
            onUndo={undo}
            onRedo={redo}
            onClearPath={clearPath}
            onClearWalls={clearWalls}
            onReset={resetGrid}
          />
        </div>
        <StatsPanel
          dictionary={dictionary}
          activeAlgorithm={activeAlgorithm}
          stats={stats}
          wallCount={wallCount}
          hoveredCell={hoveredCell}
          liveExplanation={liveExplanation}
        />
      </section>

      <ComparePanel dictionary={dictionary} rows={comparisonRows} />
    </main>
  );
}

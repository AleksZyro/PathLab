import { useCallback, useEffect, useEffectEvent, useMemo, useState } from 'react';
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
import {
  playClickSound,
  playCompareSound,
  playGoalReachedSound,
  playNoPathSound,
  playRedoSound,
  playResetSound,
  playSimulationStartSound,
  playUndoSound
} from './utils/sound.js';
import { createRedoState, createUndoState, pushHistoryEntry } from './utils/history.js';
import { createPreset } from './utils/presets.js';
import {
  DEFAULT_START,
  DEFAULT_TARGET,
  applySearchType,
  cloneGridWithClearedSearch,
  countCells,
  createGrid,
  getTerrainCostTotal,
  isBlockedForSpecialTool,
  moveSpecialNode,
  sameNode,
  setCellType
} from './utils/grid.js';

const dictionaries = { de, en };
const BASE_DELAY = 120;
const PRIVACY_URL = `${import.meta.env.BASE_URL}privacy.html`;
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

function getRunMetrics(result) {
  return {
    visited: result.visitedOrder.length,
    pathLength: result.pathLength,
    pathCost: result.pathCost,
    calculationMs: result.calculationMs
  };
}

function createBoard(grid = createGrid(), startNode = DEFAULT_START, targetNode = DEFAULT_TARGET, preset = 'custom') {
  return { grid, startNode, targetNode, preset };
}

export default function App() {
  const [language, setLanguage] = useState('de');
  const dictionary = dictionaries[language];
  const [theme, setTheme] = useState('dark');
  const [board, setBoard] = useState(createBoard);
  const { grid, startNode, targetNode, preset } = board;
  const [tool, setTool] = useState('wall');
  const [algorithm, setAlgorithm] = useState('bfs');
  const [speed, setSpeed] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [statusMessage, setStatusMessage] = useState(dictionaries.de.status.initial);
  const [stats, setStats] = useState(emptyStats);
  const [comparisonRows, setComparisonRows] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [explanationKey, setExplanationKey] = useState('ready');
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const activeAlgorithm = { id: algorithm, ...dictionary.algorithms[algorithm] };
  const hoveredCell = hoveredNode ? grid[hoveredNode.row][hoveredNode.col] : null;

  const wallCount = useMemo(() => countCells(grid, 'wall'), [grid]);
  const boardCost = useMemo(() => getTerrainCostTotal(grid), [grid]);

  const clearResults = useCallback(() => {
    setStats(emptyStats);
    setComparisonRows([]);
    setExplanationKey('ready');
  }, []);

  const pushHistory = () => {
    setUndoStack((current) => pushHistoryEntry(current, board));
    setRedoStack([]);
  };

  const restoreSnapshot = useCallback((snapshot) => {
    setBoard(snapshot);
    clearResults();
  }, [clearResults]);

  const switchLanguage = (nextLanguage) => {
    playClickSound();
    setLanguage(nextLanguage);
    setStatusMessage(dictionaries[nextLanguage].status.initial);
    setExplanationKey('ready');
  };

  const updateCell = (row, col, { commitHistory = true } = {}) => {
    if (isRunning) return;
    playClickSound();
    if (commitHistory) pushHistory();

    const node = { row, col };
    setBoard((current) => {
      const cell = current.grid[row][col];
      if (tool === 'start' || tool === 'target') {
        const endpoint = tool === 'start' ? 'startNode' : 'targetNode';
        const other = tool === 'start' ? current.targetNode : current.startNode;
        if (!sameNode(node, other) && cell.type !== 'wall') {
          return { ...current, grid: moveSpecialNode(current.grid, current[endpoint], node, tool), [endpoint]: node, preset: 'custom' };
        }
      }

      const cleanGrid = cloneGridWithClearedSearch(current.grid);
      if (tool !== 'start' && tool !== 'target' && !isBlockedForSpecialTool(cell)) {
        return { ...current, grid: setCellType(cleanGrid, node, tool === 'erase' ? 'empty' : tool), preset: 'custom' };
      }
      return { ...current, grid: cleanGrid, preset: 'custom' };
    });
    clearResults();
  };

  const undo = () => {
    if (!undoStack.length || isRunning) return;
    playUndoSound();
    const nextState = createUndoState(undoStack, redoStack, board);
    setUndoStack(nextState.undoStack);
    setRedoStack(nextState.redoStack);
    restoreSnapshot(nextState.snapshot);
    setStatusMessage(dictionary.status.undo);
  };

  const redo = () => {
    if (!redoStack.length || isRunning) return;
    playRedoSound();
    const nextState = createRedoState(undoStack, redoStack, board);
    setUndoStack(nextState.undoStack);
    setRedoStack(nextState.redoStack);
    restoreSnapshot(nextState.snapshot);
    setStatusMessage(dictionary.status.redo);
  };

  const handleKeyDown = useEffectEvent((event) => {
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
  });

  useEffect(() => {
    const listener = (event) => handleKeyDown(event);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const loadPreset = (presetId) => {
    if (isRunning) return;
    playClickSound('action');
    if (presetId === 'custom') {
      setBoard({ ...board, preset: 'custom' });
      return;
    }
    pushHistory();
    const nextPreset = createPreset(presetId);
    restoreSnapshot(createBoard(nextPreset.grid, nextPreset.start, nextPreset.target, presetId));
    setStatusMessage(translate(dictionary.status.presetLoaded, { preset: dictionary.presets[presetId] }));
  };

  const resetGrid = () => {
    if (isRunning) return;
    playResetSound();
    pushHistory();
    restoreSnapshot(createBoard());
    setStatusMessage(dictionary.status.reset);
  };

  const clearWalls = () => {
    if (isRunning) return;
    playResetSound();
    pushHistory();
    restoreSnapshot(createBoard(createGrid(startNode, targetNode), startNode, targetNode));
    setStatusMessage(dictionary.status.wallsCleared);
  };

  const clearPath = () => {
    if (isRunning) return;
    playResetSound();
    restoreSnapshot({ ...board, grid: cloneGridWithClearedSearch(grid) });
    setStatusMessage(dictionary.status.pathCleared);
  };

  const visualize = async () => {
    if (isRunning) return;
    playSimulationStartSound();
    setIsRunning(true);
    setShowOnboarding(false);
    clearResults();
    setExplanationKey(algorithm);
    setStatusMessage(translate(dictionary.status.searching, { algorithm: activeAlgorithm.name }));

    const preparedGrid = cloneGridWithClearedSearch(grid);
    setBoard({ ...board, grid: preparedGrid });
    const result = measureAlgorithm(algorithm, preparedGrid, startNode, targetNode);
    const delay = Math.max(5, BASE_DELAY - speed);
    const animationStartedAt = performance.now();

    const events = result.explorationEvents ?? result.visitedOrder.map((node) => ({ node, type: 'visited' }));
    for (const event of events) {
      setBoard((current) => ({ ...current, grid: applySearchType(current.grid, event.node, event.type) }));
      await wait(delay);
    }

    for (const node of result.path) {
      setBoard((current) => ({ ...current, grid: applySearchType(current.grid, node, 'path') }));
      await wait(Math.max(8, delay * 1.6));
    }

    const animationMs = Math.round(performance.now() - animationStartedAt);
    setStats({ ...getRunMetrics(result), animationMs });
    setStatusMessage(
      result.found
        ? translate(dictionary.status.found, { algorithm: activeAlgorithm.name, count: result.pathLength })
        : translate(dictionary.status.notFound, { algorithm: activeAlgorithm.name })
    );
    if (result.found) {
      playGoalReachedSound();
    } else {
      playNoPathSound();
    }
    setExplanationKey(result.found ? 'done' : 'noPath');
    setIsRunning(false);
  };

  const compareAlgorithms = () => {
    if (isRunning) return;
    playCompareSound();
    const preparedGrid = cloneGridWithClearedSearch(grid);
    const rows = algorithmIds.map((id) => {
      const result = measureAlgorithm(id, preparedGrid, startNode, targetNode);
      return { id, found: result.found, ...getRunMetrics(result) };
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
            onClick={() => {
              playClickSound();
              setTheme(theme === 'dark' ? 'light' : 'dark');
            }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </section>

      {showOnboarding && <Onboarding dictionary={dictionary} onDismiss={() => { playClickSound(); setShowOnboarding(false); }} />}

      <section className="workspace">
        <Controls
          dictionary={dictionary}
          algorithm={algorithm}
          tool={tool}
          speed={speed}
          preset={preset}
          isRunning={isRunning}
          onAlgorithmChange={(nextAlgorithm) => { playClickSound(); setAlgorithm(nextAlgorithm); }}
          onToolChange={(nextTool) => { playClickSound(); setTool(nextTool); }}
          onSpeedChange={setSpeed}
          onPresetChange={loadPreset}
        />
        <div className="board-column">
          <GridBoard
            dictionary={dictionary}
            grid={grid}
            tool={tool}
            terrainCost={boardCost}
            isRunning={isRunning}
            onCellAction={updateCell}
            onHoverCell={setHoveredNode}
            onLeaveGrid={() => setHoveredNode(null)}
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
          liveExplanation={dictionary.live[explanationKey]}
        />
      </section>

      <ComparePanel dictionary={dictionary} rows={comparisonRows} />
      <footer className="app-footer">
        <span>PathLab berechnet alle Rasterdaten lokal im Browser.</span>
        <a href={PRIVACY_URL}>Datenschutz</a>
      </footer>
    </main>
  );
}

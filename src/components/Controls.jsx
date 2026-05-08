import { algorithmIds } from '../algorithms/pathfinding.js';
import { presetIds } from '../utils/presets.js';

export default function Controls({ dictionary, algorithm, tool, speed, preset, isRunning, canUndo, canRedo, onAlgorithmChange, onToolChange, onSpeedChange, onPresetChange, onRun, onCompare, onUndo, onRedo, onClearPath, onClearWalls, onReset, statusMessage }) {
  return (
    <aside className="panel controls-panel">
      <h2>{dictionary.controls.title}</h2>

      <label>
        {dictionary.controls.algorithm}
        <select disabled={isRunning} value={algorithm} onChange={(event) => onAlgorithmChange(event.target.value)}>
          {algorithmIds.map((id) => (
            <option key={id} value={id}>{dictionary.algorithms[id].name}</option>
          ))}
        </select>
      </label>

      <label>
        {dictionary.controls.preset}
        <select disabled={isRunning} value={preset} onChange={(event) => onPresetChange(event.target.value)}>
          <option value="custom">{dictionary.presets.custom}</option>
          {presetIds.map((id) => (
            <option key={id} value={id}>{dictionary.presets[id]}</option>
          ))}
        </select>
      </label>

      <div className="tool-grid">
        {['wall', 'water', 'mud', 'erase', 'start', 'target'].map((toolId) => (
          <button key={toolId} disabled={isRunning} className={tool === toolId ? 'active' : ''} onClick={() => onToolChange(toolId)}>
            {dictionary.tools[toolId]}
          </button>
        ))}
      </div>

      <label>
        {dictionary.controls.animationSpeed}
        <input disabled={isRunning} type="range" min="1" max="100" value={speed} onChange={(event) => onSpeedChange(Number(event.target.value))} />
      </label>

      <div className="action-grid">
        <button className="primary" disabled={isRunning} onClick={onRun}>{isRunning ? dictionary.controls.running : dictionary.controls.run}</button>
        <button disabled={isRunning} onClick={onCompare}>{dictionary.controls.compare}</button>
        <button disabled={isRunning || !canUndo} onClick={onUndo}>{dictionary.controls.undo}</button>
        <button disabled={isRunning || !canRedo} onClick={onRedo}>{dictionary.controls.redo}</button>
        <button disabled={isRunning} onClick={onClearPath}>{dictionary.controls.clearPath}</button>
        <button disabled={isRunning} onClick={onClearWalls}>{dictionary.controls.clearWalls}</button>
        <button disabled={isRunning} onClick={onReset}>{dictionary.controls.resetGrid}</button>
      </div>

      <p className="status-message">{statusMessage}</p>
    </aside>
  );
}

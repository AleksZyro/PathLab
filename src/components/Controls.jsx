import { algorithmIds } from '../algorithms/pathfinding.js';
import { presetIds } from '../utils/presets.js';

const toolIcons = {
  wall: '▦',
  water: '≈',
  mud: '●',
  erase: '⌫',
  start: '●',
  target: '●'
};

export default function Controls({ dictionary, algorithm, tool, speed, preset, isRunning, onAlgorithmChange, onToolChange, onSpeedChange, onPresetChange }) {
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

      <div className="tool-grid drawing-tools">
        {['wall', 'water', 'mud', 'erase'].map((toolId) => (
          <button key={toolId} disabled={isRunning} className={tool === toolId ? `active tool-button ${toolId}` : `tool-button ${toolId}`} onClick={() => onToolChange(toolId)}>
            <span aria-hidden="true">{toolIcons[toolId]}</span>
            {dictionary.tools[toolId]}
          </button>
        ))}
      </div>

      <div className="node-tools" aria-label={dictionary.controls.nodeTools}>
        {['start', 'target'].map((toolId) => (
          <button key={toolId} disabled={isRunning} className={tool === toolId ? `active node-tool ${toolId}` : `node-tool ${toolId}`} onClick={() => onToolChange(toolId)} title={dictionary.tools[toolId]} aria-label={dictionary.tools[toolId]}>
            <span aria-hidden="true">{toolIcons[toolId]}</span>
          </button>
        ))}
      </div>

      <div className="helper-card brush-card">
        <strong>{dictionary.brush.title}</strong>
        <p>{dictionary.brush.text}</p>
      </div>

      <div className="helper-card tip-card compact-tip">
        <strong>{dictionary.tip.title}</strong>
        <p>{dictionary.tip.text}</p>
      </div>

      <label>
        {dictionary.controls.animationSpeed}
        <input disabled={isRunning} type="range" min="1" max="100" value={speed} onChange={(event) => onSpeedChange(Number(event.target.value))} />
      </label>
    </aside>
  );
}

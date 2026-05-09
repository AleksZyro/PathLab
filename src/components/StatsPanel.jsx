import { useState } from 'react';
import { algorithmIds } from '../algorithms/pathfinding.js';

function CostLine({ label, entry, multiplier }) {
  return (
    <li>
      <span>{label}</span>
      <strong>{entry.count} × {multiplier} = {entry.cost}</strong>
    </li>
  );
}

export default function StatsPanel({ dictionary, activeAlgorithm, stats, wallCount, hoveredCell, liveExplanation }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationAlgorithm, setExplanationAlgorithm] = useState(activeAlgorithm.id);
  const hoveredCost = hoveredCell?.type === 'water' ? 5 : hoveredCell?.type === 'mud' ? 10 : hoveredCell?.type === 'wall' ? '∞' : 1;
  const hoveredType = hoveredCell ? (dictionary.legend[hoveredCell.type] ?? hoveredCell.type) : dictionary.hover.empty;
  const selectedExplanation = dictionary.algorithms[explanationAlgorithm];

  return (
    <aside className="panel info-panel">
      <div className="algorithm-header">
        <h2>{activeAlgorithm.name}</h2>
        <button
          className={`icon-button bulb-button ${showExplanation ? 'active' : ''}`}
          type="button"
          aria-label={dictionary.explain.toggle}
          title={dictionary.explain.toggle}
          onClick={() => {
            setExplanationAlgorithm(activeAlgorithm.id);
            setShowExplanation((current) => !current);
          }}
        >
          💡
        </button>
      </div>

      {showExplanation && (
        <div className="info-box explanation-box">
          <label>
            {dictionary.explain.label}
            <select value={explanationAlgorithm} onChange={(event) => setExplanationAlgorithm(event.target.value)}>
              {algorithmIds.map((id) => (
                <option key={id} value={id}>{dictionary.algorithms[id].name}</option>
              ))}
            </select>
          </label>
          <p>{selectedExplanation.description}</p>
        </div>
      )}

      <div className="stats-grid">
        <article><strong>{stats.visited}</strong><span>{dictionary.stats.visitedCells}</span></article>
        <article><strong>{stats.pathLength}</strong><span>{dictionary.stats.pathCells}</span></article>
        <article><strong>{stats.pathCost}</strong><span>{dictionary.stats.pathCost}</span></article>
        <article><strong>{stats.calculationMs} ms</strong><span>{dictionary.stats.calculation}</span></article>
        <article><strong>{stats.animationMs} ms</strong><span>{dictionary.stats.animation}</span></article>
        <article><strong>{wallCount}</strong><span>{dictionary.stats.walls}</span></article>
      </div>

      <div className="info-box">
        <strong>{dictionary.live.title}</strong>
        <p>{liveExplanation}</p>
      </div>

      <div className="info-box">
        <strong>{dictionary.hover.title}</strong>
        {hoveredCell ? (
          <p>{dictionary.hover.type}: {hoveredType}<br />{dictionary.hover.cost}: {hoveredCost}<br />{dictionary.hover.position}: {hoveredCell.row + 1}, {hoveredCell.col + 1}</p>
        ) : (
          <p>{dictionary.hover.empty}</p>
        )}
      </div>

      <div className="info-box">
        <strong>{dictionary.cost.title}</strong>
        <ul className="cost-list">
          <CostLine label={dictionary.cost.normal} entry={stats.costBreakdown.normal} multiplier={1} />
          <CostLine label={dictionary.cost.water} entry={stats.costBreakdown.water} multiplier={5} />
          <CostLine label={dictionary.cost.mud} entry={stats.costBreakdown.mud} multiplier={10} />
        </ul>
      </div>
    </aside>
  );
}

export default function StatsPanel({ dictionary, activeAlgorithm, stats, wallCount }) {
  return (
    <aside className="panel info-panel">
      <h2>{activeAlgorithm.name}</h2>
      <p>{activeAlgorithm.description}</p>

      <div className="stats-grid">
        <article><strong>{stats.visited}</strong><span>{dictionary.stats.visitedCells}</span></article>
        <article><strong>{stats.pathLength}</strong><span>{dictionary.stats.pathCells}</span></article>
        <article><strong>{stats.pathCost}</strong><span>{dictionary.stats.pathCost}</span></article>
        <article><strong>{stats.calculationMs} ms</strong><span>{dictionary.stats.calculation}</span></article>
        <article><strong>{stats.animationMs} ms</strong><span>{dictionary.stats.animation}</span></article>
        <article><strong>{wallCount}</strong><span>{dictionary.stats.walls}</span></article>
      </div>

      <div className="tip-box">
        <strong>{dictionary.tip.title}</strong>
        <p>{dictionary.tip.text}</p>
      </div>
    </aside>
  );
}

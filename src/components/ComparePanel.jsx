function getCompareText(dictionary, key, deFallback, enFallback) {
  if (dictionary.compare[key]) return dictionary.compare[key];
  return dictionary.compare.yes === 'Yes' ? enFallback : deFallback;
}

function getMetricStats(rows, key) {
  const values = rows.filter((row) => row.found).map((row) => row[key]).filter(Number.isFinite);
  return {
    best: values.length ? Math.min(...values) : null,
    worst: values.length ? Math.max(...values) : null,
    active: new Set(values).size > 1
  };
}

function MetricIcon({ type, icon, label }) {
  return (
    <span className={`metric-icon ${type}`} title={label} aria-label={label}>
      <span aria-hidden="true">{icon}</span>
    </span>
  );
}

const metrics = [
  ['cost', 'pathCost', '🪙', '💸', ['bestCost', 'Günstigste Kosten', 'Best cost'], ['worstCost', 'Teuerste Kosten', 'Highest cost']],
  ['length', 'pathLength', '📏', '📐', ['shortestPath', 'Kürzester Pfad', 'Shortest path'], ['longestPath', 'Längster Pfad', 'Longest path']],
  ['visited', 'visited', '🎯', '🔎', ['fewestVisited', 'Wenigste besucht', 'Fewest visited'], ['mostVisited', 'Meiste besucht', 'Most visited']],
  ['ms', 'calculationMs', '⚡', '🐢', ['fastest', 'Schnellste Berechnung', 'Fastest calculation'], ['slowest', 'Langsamste Berechnung', 'Slowest calculation']]
];

function Highlights({ dictionary, row, metricStats }) {
  const positive = [];
  const negative = [];

  if (row.found) {
    metrics.forEach(([key, rowKey, positiveIcon, negativeIcon, positiveLabel, negativeLabel]) => {
      const stats = metricStats[key];
      if (!stats.active) return;

      const metric = {
        key,
        positiveIcon,
        negativeIcon,
        positiveLabel: getCompareText(dictionary, ...positiveLabel),
        negativeLabel: getCompareText(dictionary, ...negativeLabel)
      };

      if (row[rowKey] === stats.best) positive.push(metric);
      if (row[rowKey] === stats.worst) negative.push(metric);
    });
  }

  const score = positive.length - negative.length;
  const scoreLabel = getCompareText(dictionary, 'score', 'Differenz', 'Score');

  return (
    <div className="highlight-scorecard">
      <div className="metric-groups">
        <div className="metric-group positive-group" aria-label={getCompareText(dictionary, 'positive', 'Positive Eigenschaften', 'Positive traits')}>
          {positive.map((metric) => <MetricIcon key={`positive-${metric.key}`} type="positive" icon={metric.positiveIcon} label={metric.positiveLabel} />)}
        </div>
        <div className="metric-divider" />
        <div className="metric-group negative-group" aria-label={getCompareText(dictionary, 'negative', 'Negative Eigenschaften', 'Negative traits')}>
          {negative.map((metric) => <MetricIcon key={`negative-${metric.key}`} type="negative" icon={metric.negativeIcon} label={metric.negativeLabel} />)}
        </div>
      </div>
      <span className={score >= 0 ? 'metric-score positive-score' : 'metric-score negative-score'} title={scoreLabel} aria-label={`${scoreLabel}: ${score}`}>
        {score > 0 ? `+${score}` : score}
      </span>
    </div>
  );
}

export default function ComparePanel({ dictionary, rows }) {
  if (!rows.length) return null;

  const metricStats = Object.fromEntries(metrics.map(([key, rowKey]) => [key, getMetricStats(rows, rowKey)]));

  return (
    <section className="compare-card">
      <div>
        <p className="eyebrow">{dictionary.compare.kicker}</p>
        <h2>{dictionary.compare.title}</h2>
      </div>
      <div className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th>{dictionary.compare.algorithm}</th>
              <th>{dictionary.compare.found}</th>
              <th>{dictionary.compare.cost}</th>
              <th>{dictionary.compare.length}</th>
              <th>{dictionary.compare.visited}</th>
              <th>{dictionary.compare.ms}</th>
              <th>{dictionary.compare.highlights}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.found ? dictionary.compare.yes : dictionary.compare.no}</td>
                <td>{row.pathCost}</td>
                <td>{row.pathLength}</td>
                <td>{row.visited}</td>
                <td>{row.calculationMs}</td>
                <td><Highlights dictionary={dictionary} row={row} metricStats={metricStats} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

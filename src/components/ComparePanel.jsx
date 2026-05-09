function finiteValues(rows, key) {
  return rows.filter((row) => row.found).map((row) => row[key]).filter((value) => Number.isFinite(value));
}

function minValue(rows, key) {
  const values = finiteValues(rows, key);
  return values.length ? Math.min(...values) : null;
}

function maxValue(rows, key) {
  const values = finiteValues(rows, key);
  return values.length ? Math.max(...values) : null;
}

function hasDifferentValues(rows, key) {
  return new Set(finiteValues(rows, key)).size > 1;
}

function getCompareText(dictionary, key, fallback) {
  return dictionary.compare[key] ?? fallback;
}

function MetricIcon({ type, icon, label }) {
  return (
    <span className={`metric-icon ${type}`} title={label} aria-label={label}>
      <span aria-hidden="true">{icon}</span>
    </span>
  );
}

function Highlights({ dictionary, row, best, worst, activeMetrics }) {
  const positive = [];
  const negative = [];

  const metricConfig = [
    {
      key: 'cost',
      value: row.pathCost,
      best: best.cost,
      worst: worst.cost,
      active: activeMetrics.cost,
      positiveIcon: '🪙',
      negativeIcon: '💸',
      positiveLabel: getCompareText(dictionary, 'bestCost', 'Günstigste Kosten'),
      negativeLabel: getCompareText(dictionary, 'worstCost', 'Teuerste Kosten')
    },
    {
      key: 'length',
      value: row.pathLength,
      best: best.length,
      worst: worst.length,
      active: activeMetrics.length,
      positiveIcon: '📏',
      negativeIcon: '↔️',
      positiveLabel: getCompareText(dictionary, 'shortestPath', 'Kürzester Pfad'),
      negativeLabel: getCompareText(dictionary, 'longestPath', 'Längster Pfad')
    },
    {
      key: 'visited',
      value: row.visited,
      best: best.visited,
      worst: worst.visited,
      active: activeMetrics.visited,
      positiveIcon: '🎯',
      negativeIcon: '🌊',
      positiveLabel: getCompareText(dictionary, 'fewestVisited', 'Wenigste besucht'),
      negativeLabel: getCompareText(dictionary, 'mostVisited', 'Meiste besucht')
    },
    {
      key: 'ms',
      value: row.calculationMs,
      best: best.ms,
      worst: worst.ms,
      active: activeMetrics.ms,
      positiveIcon: '⚡',
      negativeIcon: '🐢',
      positiveLabel: getCompareText(dictionary, 'fastest', 'Schnellste Berechnung'),
      negativeLabel: getCompareText(dictionary, 'slowest', 'Langsamste Berechnung')
    }
  ];

  if (row.found) {
    metricConfig.forEach((metric) => {
      if (!metric.active) return;
      if (metric.value === metric.best) positive.push(metric);
      if (metric.value === metric.worst) negative.push(metric);
    });
  }

  return (
    <div className="highlight-scorecard">
      <div className="metric-group positive-group" aria-label={getCompareText(dictionary, 'positive', 'Positive Eigenschaften')}>
        {positive.map((metric) => <MetricIcon key={`positive-${metric.key}`} type="positive" icon={metric.positiveIcon} label={metric.positiveLabel} />)}
        <span className="metric-counter positive-counter">+{positive.length}</span>
      </div>
      <div className="metric-divider" />
      <div className="metric-group negative-group" aria-label={getCompareText(dictionary, 'negative', 'Negative Eigenschaften')}>
        {negative.map((metric) => <MetricIcon key={`negative-${metric.key}`} type="negative" icon={metric.negativeIcon} label={metric.negativeLabel} />)}
        <span className="metric-counter negative-counter">-{negative.length}</span>
      </div>
    </div>
  );
}

export default function ComparePanel({ dictionary, rows }) {
  if (!rows.length) return null;

  const best = {
    cost: minValue(rows, 'pathCost'),
    length: minValue(rows, 'pathLength'),
    visited: minValue(rows, 'visited'),
    ms: minValue(rows, 'calculationMs')
  };

  const worst = {
    cost: maxValue(rows, 'pathCost'),
    length: maxValue(rows, 'pathLength'),
    visited: maxValue(rows, 'visited'),
    ms: maxValue(rows, 'calculationMs')
  };

  const activeMetrics = {
    cost: hasDifferentValues(rows, 'pathCost'),
    length: hasDifferentValues(rows, 'pathLength'),
    visited: hasDifferentValues(rows, 'visited'),
    ms: hasDifferentValues(rows, 'calculationMs')
  };

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
              <th>{dictionary.compare.visited}</th>
              <th>{dictionary.compare.length}</th>
              <th>{dictionary.compare.cost}</th>
              <th>{dictionary.compare.ms}</th>
              <th>{dictionary.compare.highlights}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.found ? dictionary.compare.yes : dictionary.compare.no}</td>
                <td>{row.visited}</td>
                <td>{row.pathLength}</td>
                <td>{row.pathCost}</td>
                <td>{row.calculationMs}</td>
                <td><Highlights dictionary={dictionary} row={row} best={best} worst={worst} activeMetrics={activeMetrics} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

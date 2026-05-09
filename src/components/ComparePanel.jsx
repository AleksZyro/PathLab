function minValue(rows, key) {
  const values = rows.filter((row) => row.found).map((row) => row[key]).filter((value) => Number.isFinite(value));
  return values.length ? Math.min(...values) : null;
}

function hasDifferentValues(rows, key) {
  const values = rows.filter((row) => row.found).map((row) => row[key]).filter((value) => Number.isFinite(value));
  return new Set(values).size > 1;
}

function Badges({ dictionary, row, best, showBestCost }) {
  const badges = [];
  if (showBestCost && row.found && row.pathCost === best.cost) badges.push(dictionary.compare.bestCost);
  if (row.found && row.pathLength === best.length) badges.push(dictionary.compare.shortestPath);
  if (row.found && row.visited === best.visited) badges.push(dictionary.compare.fewestVisited);
  if (row.found && row.calculationMs === best.ms) badges.push(dictionary.compare.fastest);

  return (
    <div className="badge-row">
      {badges.map((badge) => <span className="result-badge" key={badge}>{badge}</span>)}
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
  const showBestCost = hasDifferentValues(rows, 'pathCost');

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
                <td><Badges dictionary={dictionary} row={row} best={best} showBestCost={showBestCost} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function ComparePanel({ dictionary, rows }) {
  if (!rows.length) return null;



  return (
    <section className="compare-card">
      <div>
        <p className="eyebrow">{dictionary.compare.kicker}</p>
        <h2>{dictionary.compare.title}</h2>
      </div>
      <div className="compare-table-wrap">
        <table className="compare-table">
          <caption>{dictionary.compare.timingNote}</caption>
          <thead>
            <tr>
              <th>{dictionary.compare.algorithm}</th>
              <th>{dictionary.compare.found}</th>
              <th>{dictionary.compare.cost}</th>
              <th>{dictionary.compare.length}</th>
              <th>{dictionary.compare.visited}</th>
              <th>{dictionary.compare.ms}</th>
              <th>{dictionary.compare.optimality}</th>
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
                <td>{dictionary.algorithms[row.id].optimality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

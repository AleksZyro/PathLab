export default function ActionPanel({ dictionary, isRunning, canUndo, canRedo, statusMessage, onRun, onCompare, onUndo, onRedo, onClearPath, onClearWalls, onReset }) {
  return (
    <section className="action-panel">
      <div className="action-panel-head">
        <p className="eyebrow">{dictionary.actions.kicker}</p>
        <h2>{dictionary.actions.title}</h2>
      </div>

      <div className="action-panel-grid">
        <div className="top-action-row">
          <button className="primary" disabled={isRunning} onClick={onRun}>{isRunning ? dictionary.controls.running : dictionary.controls.run}</button>
          <button disabled={isRunning} onClick={onCompare}>{dictionary.controls.compare}</button>
          <button className="history-button" disabled={isRunning || !canUndo} onClick={onUndo} title={dictionary.controls.undo} aria-label={dictionary.controls.undo}>↶</button>
          <button className="history-button" disabled={isRunning || !canRedo} onClick={onRedo} title={dictionary.controls.redo} aria-label={dictionary.controls.redo}>↷</button>
        </div>

        <div className="maintenance-actions">
          <button disabled={isRunning} onClick={onClearPath}>{dictionary.controls.clearPath}</button>
          <button disabled={isRunning} onClick={onClearWalls}>{dictionary.controls.clearWalls}</button>
          <button disabled={isRunning} onClick={onReset}>{dictionary.controls.resetGrid}</button>
        </div>
      </div>

      <p className="status-message action-status">{statusMessage}</p>
    </section>
  );
}

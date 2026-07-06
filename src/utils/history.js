export const HISTORY_LIMIT = 25;

export function pushHistoryEntry(stack, snapshot) {
  return [...stack.slice(-(HISTORY_LIMIT - 1)), snapshot];
}

export function createUndoState(undoStack, redoStack, currentSnapshot) {
  if (!undoStack.length) return null;
  return {
    snapshot: undoStack.at(-1),
    undoStack: undoStack.slice(0, -1),
    redoStack: [...redoStack, currentSnapshot]
  };
}

export function createRedoState(undoStack, redoStack, currentSnapshot) {
  if (!redoStack.length) return null;
  return {
    snapshot: redoStack.at(-1),
    undoStack: [...undoStack, currentSnapshot],
    redoStack: redoStack.slice(0, -1)
  };
}

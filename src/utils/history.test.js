import { describe, expect, it } from 'vitest';
import { HISTORY_LIMIT, createRedoState, createUndoState, pushHistoryEntry } from './history.js';

describe('history stack helpers', () => {
  it('keeps the undo history within the configured limit', () => {
    const stack = Array.from({ length: HISTORY_LIMIT + 4 }, (_, index) => ({ id: index }))
      .reduce((current, snapshot) => pushHistoryEntry(current, snapshot), []);

    expect(stack).toHaveLength(HISTORY_LIMIT);
    expect(stack[0]).toEqual({ id: 4 });
  });

  it('creates the next undo state and stores the current snapshot for redo', () => {
    const result = createUndoState([{ id: 'first' }, { id: 'second' }], [], { id: 'current' });

    expect(result.snapshot).toEqual({ id: 'second' });
    expect(result.undoStack).toEqual([{ id: 'first' }]);
    expect(result.redoStack).toEqual([{ id: 'current' }]);
  });

  it('creates the next redo state and stores the current snapshot for undo', () => {
    const result = createRedoState([{ id: 'old' }], [{ id: 'next' }], { id: 'current' });

    expect(result.snapshot).toEqual({ id: 'next' });
    expect(result.undoStack).toEqual([{ id: 'old' }, { id: 'current' }]);
    expect(result.redoStack).toEqual([]);
  });
});

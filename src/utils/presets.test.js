import { describe, expect, it } from 'vitest';
import { runAStar } from '../algorithms/pathfinding.js';
import { createPreset, presetIds } from './presets.js';

describe('preset maps', () => {
  it('creates every preset with one start and one target node', () => {
    for (const presetId of presetIds) {
      const { grid, start, target } = createPreset(presetId);

      expect(grid[start.row][start.col].type).toBe('start');
      expect(grid[target.row][target.col].type).toBe('target');
      expect(grid.flat().filter((cell) => cell.type === 'start')).toHaveLength(1);
      expect(grid.flat().filter((cell) => cell.type === 'target')).toHaveLength(1);
    }
  });

  it('keeps all playable presets solvable and the no-path preset blocked', () => {
    for (const presetId of presetIds) {
      const { grid, start, target } = createPreset(presetId);
      const result = runAStar(grid, start, target);

      expect(result.found).toBe(presetId !== 'noPath');
    }
  });
});

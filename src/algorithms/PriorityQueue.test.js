import { describe, expect, it } from 'vitest';
import { MinPriorityQueue } from './PriorityQueue.js';

describe('binary min heap', () => {
  it('handles an empty queue', () => {
    const queue = new MinPriorityQueue();
    expect(queue.size).toBe(0);
    expect(queue.pop()).toBeUndefined();
  });

  it('handles one entry and reuse after emptying', () => {
    const queue = new MinPriorityQueue();
    const entry = { priority: 7 };
    queue.push(entry);
    expect(queue.size).toBe(1);
    expect(queue.pop()).toBe(entry);
    expect(queue.size).toBe(0);
    queue.push({ priority: -1 });
    expect(queue.pop().priority).toBe(-1);
  });

  it.each([
    ['ascending', [1, 2, 3, 4, 5]],
    ['descending', [5, 4, 3, 2, 1]],
    ['equal', [3, 3, 3, 3]],
    ['many', Array.from({ length: 10000 }, (_, i) => (i * 7919) % 10007)]
  ])('orders %s priorities without losing entries', (_, priorities) => {
    const queue = new MinPriorityQueue();
    priorities.forEach((priority) => queue.push({ priority }));
    const output = [];
    while (queue.size) output.push(queue.pop().priority);
    expect(output).toEqual([...priorities].sort((a, b) => a - b));
    expect(queue.pop()).toBeUndefined();
  });

  it('supports a stable caller-defined tie breaker and interleaved operations', () => {
    const queue = new MinPriorityQueue((a, b) => a.priority - b.priority || a.sequence - b.sequence);
    queue.push({ priority: 2, sequence: 2 });
    queue.push({ priority: 2, sequence: 1 });
    expect(queue.pop().sequence).toBe(1);
    queue.push({ priority: 1, sequence: 3 });
    expect(queue.pop().sequence).toBe(3);
    expect(queue.pop().sequence).toBe(2);
  });
});

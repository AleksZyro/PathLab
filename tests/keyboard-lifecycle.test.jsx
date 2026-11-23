// @vitest-environment jsdom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import App from '../src/App.jsx';

function pressUndo() {
  const event = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, cancelable: true });
  window.dispatchEvent(event);
  return event.defaultPrevented;
}

it('handles undo only while the board is mounted', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  const root = createRoot(document.createElement('div'));
  try {
    await act(() => root.render(createElement(App)));
    expect(pressUndo()).toBe(true);
  } finally {
    await act(() => root.unmount());
    vi.unstubAllGlobals();
  }
  expect(pressUndo()).toBe(false);
});

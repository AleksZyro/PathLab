# PathLab

PathLab is an interactive pathfinding visualizer for learning and comparing search algorithms on a weighted grid.

## Status

Current status: **stable portfolio version**

Optional future improvements are listed at the end of this document and are not required for the current version.

## What the App Does

Users can place walls, move the start and target nodes, and draw weighted terrain. Normal cells cost 1, water costs 5, and mud costs 10.

PathLab visualizes four algorithms:

- **BFS** finds the shortest route by number of steps on an unweighted grid.
- **DFS** demonstrates depth-first exploration but does not guarantee the shortest path.
- **Dijkstra** finds the cheapest route when terrain costs differ.
- **A\*** combines travelled cost with a Manhattan-distance estimate.

## Main Features

- interactive grid with mouse, trackpad, touchscreen, and stylus input
- movable start and target nodes
- walls, water, and mud terrain
- animated algorithm visualization
- live explanations during a run
- speed controls and preset scenarios
- algorithm comparison table
- result badges and path-cost breakdown
- undo and redo
- calculation and animation timing shown separately
- German and English content
- light and dark mode
- beginner guides
- automated tests for algorithms and grid-state restoration

## Timing

PathLab distinguishes between:

- **Calculation time:** the time needed to compute the result
- **Animation time:** the intentionally slower visual playback

This prevents the animation duration from being presented as algorithm runtime.

## Tech Stack

- React
- JavaScript
- Vite
- CSS
- Vitest

## Setup

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

## Documentation

- [English beginner guide](USER_GUIDE_EN.md)
- [Deutsche Benutzeranleitung](BENUTZERANLEITUNG_DE.md)

## Project Structure

```text
src/
  algorithms/
    pathfinding.js
    pathfinding.test.js
  components/
    ComparePanel.jsx
    Controls.jsx
    GridBoard.jsx
    LanguageSwitch.jsx
    Onboarding.jsx
    StatsPanel.jsx
  i18n/
    de.json
    en.json
  utils/
    grid.js
    grid.test.js
    presets.js
  App.jsx
  main.jsx
```

## Optional Future Improvements

- portfolio case study
- keyboard shortcuts
- optional step-by-step playback

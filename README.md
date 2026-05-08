# PathLab

PathLab is an interactive pathfinding visualizer for learning and comparing search algorithms on a grid.

The project is designed as a portfolio project for application development. It focuses on algorithm visualization, clean UI, state management, bilingual content, weighted pathfinding, beginner-friendly explanations, and practical usability features.

## What the App Does

PathLab shows how an algorithm searches for a route from a green start cell to a red target cell.

Users can draw walls and weighted terrain. Water costs 5, mud costs 10, and normal cells cost 1. Dijkstra and A* use these real costs to search for the cheapest route, while BFS and DFS are mainly useful for understanding basic search behavior.

## Implemented Algorithms

### BFS

Breadth-First Search spreads out from the start in layers. It checks nearby cells first and then moves farther away. On an unweighted grid, BFS finds the shortest path by number of steps. It does not consider water or mud costs.

### DFS

Depth-First Search follows one direction as far as possible before it backtracks. DFS is useful to understand search behavior, but it does not guarantee the shortest or cheapest path.

### Dijkstra

Dijkstra always expands the currently cheapest known cell. In PathLab, this means Dijkstra can avoid expensive terrain such as water or mud when a longer route is cheaper overall.

### A*

A* combines the cost already travelled with an estimate of the remaining distance to the target. It uses terrain costs like Dijkstra, but often reaches the goal with fewer visited cells.

## Current Features

- Interactive grid
- Brush drawing with pointer events
- Mouse, trackpad, touchscreen, and stylus-friendly input
- Movable start and target nodes
- Draw and erase walls
- Draw weighted terrain: water and mud
- Preset example scenarios
- Select BFS, DFS, Dijkstra or A*
- Animated visualization
- Live explanation panel during algorithm runs
- Hover cell information with type, cost, and position
- Speed control
- Algorithm comparison table
- Result badges for best cost, shortest path, fewest visited cells, and fastest calculation
- Path cost breakdown
- Undo and redo
- Clear path, clear obstacles, and reset grid actions
- Statistics panel with visited cells, path cells, path cost, calculation time, animation time, and wall count
- German default language
- DE/EN language switch
- Light and dark mode
- Beginner guides in German and English
- Unit tests for pathfinding algorithms and grid state restoration

## Important Note About Timing

PathLab separates two different values:

- **Calculation time:** how long the algorithm needs to compute the result
- **Animation time:** how long the visual playback takes on screen

The animation is intentionally slower so users can see what happens. The algorithm calculation itself usually takes only a few milliseconds.

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Vitest
- GitHub

## Installation

```bash
git clone https://github.com/Aleksandros2/PathLab.git
cd PathLab
npm install
```

## Start

```bash
npm run dev
```

Vite will show a local development URL, usually:

```text
http://localhost:5173
```

Open that URL in your browser.

## Run Tests

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
  styles.css
```

## Next Useful Improvements

- Add a case study for portfolio presentation
- Add keyboard shortcuts for tools
- Add optional step-by-step playback

## Status

Current status: **advanced functional MVP in development**

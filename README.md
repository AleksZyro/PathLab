# PathLab

PathLab is an interactive pathfinding visualizer for learning and comparing search algorithms on a grid.

The project is designed as a portfolio project for application development. It focuses on algorithm visualization, clean UI, state management, bilingual content, and beginner-friendly explanations.

## What the App Does

PathLab shows how an algorithm searches for a route from a green start cell to a red target cell.

Users can draw walls on the grid. The algorithm then has to search around these walls. During the visualization, blue cells show where the algorithm has searched, and yellow cells show the final path.

## Implemented Algorithms

### BFS

Breadth-First Search spreads out from the start in layers. It checks nearby cells first and then moves farther away. On an unweighted grid, BFS finds the shortest path.

### DFS

Depth-First Search follows one direction as far as possible before it backtracks. DFS is useful to understand search behavior, but it does not always find the shortest path.

### Dijkstra

Dijkstra always expands the currently cheapest known cell. On the current grid all moves have the same cost, so it behaves similarly to BFS. It becomes more important when weighted cells are added later.

### A*

A* combines the distance already travelled with an estimate of the remaining distance to the target. This makes it search more directly toward the goal and often visit fewer cells than Dijkstra.

## Current Features

- Interactive grid
- Fixed start and target nodes
- Draw and erase walls
- Select BFS, DFS, Dijkstra or A*
- Animated visualization
- Speed control
- Clear path, clear walls, and reset grid actions
- Statistics panel with visited cells, path cells, calculation time, and wall count
- German default language
- DE/EN language switch
- Light and dark mode
- Beginner guides in German and English

## Important Note About Calculation Time

The displayed `ms` value measures the real algorithm calculation time. It does **not** include the animation time.

The animation is intentionally slower so users can see what happens. The calculation itself usually takes only a few milliseconds.

## Tech Stack

- React
- Vite
- JavaScript
- CSS
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

## Documentation

- [English beginner guide](USER_GUIDE_EN.md)
- [Deutsche Benutzeranleitung](BENUTZERANLEITUNG_DE.md)

## Next Useful Improvements

- Move start and target nodes by clicking or dragging
- Add weighted cells for Dijkstra and A*
- Add a maze generator
- Add step-by-step mode
- Add algorithm comparison mode

## Status

Current status: **functional MVP in development**

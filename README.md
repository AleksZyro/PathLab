# PathLab

PathLab is an interactive pathfinding visualizer for learning and comparing graph search algorithms on a grid.

The project is designed as a portfolio project for application development. It focuses on algorithm visualization, clean UI, state management, and beginner-friendly explanations.

## Project Goals

- Visualize pathfinding algorithms step by step
- Make algorithm behavior understandable for beginners
- Compare different search strategies
- Provide a modern light and dark interface
- Build a clean React/Vite codebase suitable for portfolio presentation

## Implemented Algorithms

- Breadth-First Search (BFS)
- Depth-First Search (DFS)
- Dijkstra's Algorithm
- A* Search

## Current Features

- Interactive grid
- Fixed start and target nodes
- Draw and erase walls
- Select algorithm
- Animated visualization
- Speed control
- Clear path, clear walls, and reset grid actions
- Statistics panel with visited cells, path cells, runtime, and wall count
- Algorithm explanations
- Light and dark mode
- Beginner guides in German and English

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

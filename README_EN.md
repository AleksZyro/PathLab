# PathLab

[Deutsch](./README.md) | **English**

PathLab is an interactive visualizer for learning and comparing pathfinding algorithms on a weighted grid. The project is prepared as an IMS portfolio project and demonstrates algorithms, UI state, animations, internationalization, and automated tests in a compact React application.

## Project Status

Current status: **portfolio preparation on a separate working branch**.

The app runs locally and is covered with Vitest tests. A public live demo is not configured yet. The screenshot folder is prepared, but no screenshots are committed yet.

## Main Features

- interactive grid with start and target nodes
- tools for walls, water, mud, and erase
- weighted cells with fixed costs: normal 1, water 5, mud 10
- animated search visualization
- BFS, DFS, Dijkstra, and A*
- comparison of all algorithms on the same grid
- path cost breakdown
- separate calculation time and animation time
- undo and redo for grid edits
- prepared example scenarios
- German and English content
- light and dark mode

## Algorithms

- **BFS** searches layer by layer and finds the shortest path by number of steps on unweighted grids.
- **DFS** demonstrates depth-first search, but does not guarantee the shortest or cheapest path.
- **Dijkstra** considers cell costs and finds the cheapest path.
- **A\*** also considers cell costs and adds a Manhattan distance estimate toward the target.

Dijkstra and A* currently use simple array sorting for open nodes. This implementation is sufficient for the fixed educational grid, but it is not optimized for very large graphs.

## Tech Stack

- React 19
- JavaScript
- Vite
- CSS
- Vitest

## Installation

```bash
npm install
```

## Development and Production Build

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Tests

```bash
npm test
```

The tests cover, among other things:

- unreachable targets
- weighted water and mud cells
- cost breakdowns
- A* compared with Dijkstra
- restoration of terrain types after search overlays
- start and target nodes
- undo and redo stack logic

## Project Structure

```text
src/
  algorithms/
    pathfinding.js
    pathfinding.test.js
  components/
    ActionPanel.jsx
    ComparePanel.jsx
    Controls.jsx
    GridBoard.jsx
    LanguageSwitch.jsx
    Onboarding.jsx
    PathLabLogo.jsx
    StatsPanel.jsx
  i18n/
    de.json
    en.json
  utils/
    grid.js
    grid.test.js
    history.js
    history.test.js
    presets.js
    sound.js
  App.jsx
  main.jsx
docs/
  screenshots/
```

## Technical Decisions

- The algorithms are separated from the React components so they can be tested independently.
- Terrain costs are maintained centrally in `src/utils/grid.js`.
- Search overlays remember the previous terrain type so water and mud can be restored after the animation.
- Calculation time and animation time are handled separately. The animation is intentionally slowed down and is therefore not algorithm runtime.
- Undo and redo use small history helpers in `src/utils/history.js`, which makes the stack logic testable in isolation.

## Known Limitations

- Dijkstra and A* use array sorting instead of a priority queue.
- The grid has a fixed size and is designed as a learning environment.
- There is no CI pipeline yet.
- There is no configured live demo yet.
- Screenshots still need to be captured manually.

## Screenshot Section

The [docs/screenshots](./docs/screenshots/) folder is prepared. It currently contains no screenshots.

Recommended screenshots:

- initial dark-mode view with an empty grid
- loaded `A* vs Dijkstra Demo` preset
- visualization result with final path and statistics
- algorithm comparison table
- mobile view at about 375 px width

## Demo Section

No live demo is configured yet.

Recommendation: **Vercel** is the simplest option for this Vite project because it does not need special routing configuration. Netlify and GitHub Pages are also possible. For GitHub Pages, a `base` setting in `vite.config.js` would likely be needed, for example `/PathLab/`.

## Documentation

- [German user guide](BENUTZERANLEITUNG_DE.md)
- [English beginner guide](USER_GUIDE_EN.md)

## License

No explicit license has been chosen for this repository yet. Until a license is selected and added, no usage rights are granted beyond GitHub's default repository viewing behaviour.

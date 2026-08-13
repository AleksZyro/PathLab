# PathLab

**Deutsch** | [English](./README_EN.md)

PathLab ist ein interaktiver React-Visualizer für Wegfindungsalgorithmen auf einem gewichteten Raster. Das Projekt zeigt Graph-Suche, Terrain-Kosten, UI-State, Animationen, Mehrsprachigkeit und automatisierte Tests in einer kompakten Vite-Anwendung.

- Live-Demo: [https://alekszyro.github.io/PathLab/](https://alekszyro.github.io/PathLab/)
- Benutzeranleitung: [Deutsche Benutzeranleitung](BENUTZERANLEITUNG_DE.md)
- Status: **stabile Portfolio-Version**
- Tech-Stack: React 19, JavaScript, Vite, CSS, Vitest, GitHub Actions, GitHub Pages

![PathLab Übersicht](./docs/screenshots/pathlab-overview.png)

## Demo

![PathLab Demo](./docs/screenshots/pathlab-demo.gif)

## Hauptfunktionen

- interaktives Raster mit Start- und Zielknoten
- Werkzeuge für Wände, Wasser, Schlamm und Löschen
- gewichtete Felder mit festen Kosten: normal 1, Wasser 5, Schlamm 10
- animierte Visualisierung der Suche
- BFS, DFS, Dijkstra und A*
- Vergleich aller Algorithmen auf demselben Raster
- Kostenaufschlüsselung des gefundenen Pfads
- getrennte Anzeige von Berechnungszeit und Animationszeit
- Undo und Redo für Rasteränderungen
- Beispiel-Szenarien
- deutscher und englischer Inhalt
- Hell- und Dunkelmodus

## Schnellstart

```bash
npm install
npm run dev
```

## Tests und Build

```bash
npm test
npm run build
npm run preview
```

<details>
<summary>Algorithmen</summary>

- **BFS** sucht schichtweise und findet auf ungewichteten Rastern den kürzesten Weg nach Anzahl Schritten.
- **DFS** zeigt Tiefensuche, garantiert aber keinen kürzesten oder günstigsten Weg.
- **Dijkstra** berücksichtigt Feldkosten und findet den günstigsten Pfad.
- **A\*** berücksichtigt ebenfalls Feldkosten und nutzt zusätzlich eine Manhattan-Distanzschätzung zum Ziel.

Dijkstra und A* verwenden aktuell eine einfache Array-Sortierung für offene Knoten. Diese Umsetzung ist für das feste Lernraster ausreichend, aber nicht für sehr grosse Graphen optimiert.

</details>

<details>
<summary>Qualitätssicherung</summary>

Die automatisierte GitHub-Actions-Prüfung führt aus:

```bash
npm ci
npm test
npm run build
```

Die Tests prüfen unter anderem:

- unerreichbare Ziele
- gewichtete Wasser- und Schlammfelder
- Kostenaufschlüsselung
- A* im Vergleich zu Dijkstra
- Wiederherstellung von Geländetypen nach Such-Overlays
- Start- und Zielknoten
- Undo- und Redo-Stack-Logik

</details>

<details>
<summary>Projektstruktur</summary>

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
tests/
  pathfinding.behavior.test.js
docs/
  screenshots/
    pathlab-demo.gif
    pathlab-overview.png
```

</details>

<details>
<summary>Technische Entscheidungen</summary>

- Die Algorithmen sind von den React-Komponenten getrennt, damit sie unabhängig testbar bleiben.
- Terrain-Kosten werden zentral in `src/utils/grid.js` gepflegt.
- Such-Overlays merken sich den vorherigen Geländetyp, damit Wasser und Schlamm nach der Animation wiederhergestellt werden können.
- Berechnungszeit und Animationszeit werden getrennt behandelt. Die Animation wird bewusst verlangsamt und ist deshalb keine Algorithmus-Laufzeit.
- Undo und Redo verwenden kleine History-Helfer in `src/utils/history.js`, damit die Stack-Logik isoliert testbar ist.
- Das Deployment erfolgt über GitHub Pages.

</details>

<details>
<summary>Bekannte Einschränkungen</summary>

- Dijkstra und A* nutzen Array-Sortierung statt Priority Queue.
- Das Raster hat eine feste Grösse und ist als Lernumgebung gedacht.
- Screenshots und GIFs müssen bei UI-Änderungen manuell aktualisiert werden.

</details>

<details>
<summary>Repository-Metadaten Vorschlag</summary>

- Description: `Interactive React pathfinding visualizer for BFS, DFS, Dijkstra and A* on a weighted grid.`
- Website: `https://alekszyro.github.io/PathLab/`
- Topics: `react`, `pathfinding`, `algorithm-visualizer`, `bfs`, `dfs`, `dijkstra`, `astar`, `weighted-grid`, `portfolio-project`

</details>

## Dokumentation

- [Deutsche Benutzeranleitung](BENUTZERANLEITUNG_DE.md)
- [English beginner guide](USER_GUIDE_EN.md)

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz veröffentlicht. Details stehen in [LICENSE](./LICENSE).

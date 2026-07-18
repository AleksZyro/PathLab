# PathLab

**Deutsch** | [English](./README_EN.md)

PathLab ist ein interaktiver Visualizer zum Lernen und Vergleichen von Wegfindungsalgorithmen auf einem gewichteten Raster. Das Projekt ist als IMS-Portfolio-Projekt aufgebaut und zeigt Algorithmen, UI-State, Animationen, Mehrsprachigkeit und automatisierte Tests in einer kleinen React-Anwendung.

- Live-Demo: [https://alekszyro.github.io/PathLab/](https://alekszyro.github.io/PathLab/)
- Benutzeranleitung: [Deutsche Benutzeranleitung](BENUTZERANLEITUNG_DE.md)

![PathLab overview](./docs/screenshots/pathlab-overview.png)

## Projektstatus

Aktueller Stand: **stabile Portfolio-Version**.

Die Anwendung ist über GitHub Pages veröffentlicht. GitHub Actions wurde erfolgreich mit `npm ci`, `npm test` und `npm run build` ausgeführt.

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

## Algorithmen

- **BFS** sucht schichtweise und findet auf ungewichteten Rastern den kürzesten Weg nach Anzahl Schritten.
- **DFS** zeigt Tiefensuche, garantiert aber keinen kürzesten oder günstigsten Weg.
- **Dijkstra** berücksichtigt Feldkosten und findet den günstigsten Pfad.
- **A\*** berücksichtigt ebenfalls Feldkosten und nutzt zusätzlich eine Manhattan-Distanzschätzung zum Ziel.

Dijkstra und A* verwenden aktuell eine einfache Array-Sortierung für offene Knoten. Diese Umsetzung ist für das feste Lernraster ausreichend, aber nicht für sehr grosse Graphen optimiert.

## Tech-Stack

- React 19
- JavaScript
- Vite
- CSS
- Vitest
- GitHub Actions
- GitHub Pages

## Installation

```bash
npm install
```

## Entwicklung und Produktions-Build

Entwicklungsserver starten:

```bash
npm run dev
```

Produktions-Build erstellen:

```bash
npm run build
```

Build lokal prüfen:

```bash
npm run preview
```

## Tests

```bash
npm test
```

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

## Projektstruktur

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

## Technische Entscheidungen

- Die Algorithmen sind von den React-Komponenten getrennt, damit sie unabhängig testbar bleiben.
- Terrain-Kosten werden zentral in `src/utils/grid.js` gepflegt.
- Such-Overlays merken sich den vorherigen Geländetyp, damit Wasser und Schlamm nach der Animation wiederhergestellt werden können.
- Berechnungszeit und Animationszeit werden getrennt behandelt. Die Animation wird bewusst verlangsamt und ist deshalb keine Algorithmus-Laufzeit.
- Undo und Redo verwenden kleine History-Helfer in `src/utils/history.js`, damit die Stack-Logik isoliert testbar ist.
- Das Deployment erfolgt über GitHub Pages.

## Bekannte Einschränkungen

- Dijkstra und A* nutzen Array-Sortierung statt Priority Queue.
- Das Raster hat eine feste Grösse und ist als Lernumgebung gedacht.
- Screenshots müssen bei UI-Änderungen manuell aktualisiert werden.

## Screenshot-Bereich

Der Screenshot liegt unter [docs/screenshots/pathlab-overview.png](./docs/screenshots/pathlab-overview.png) und zeigt ein A*-Beispiel mit gewichteten Feldern, Hindernissen, gefundenem Pfad und sichtbaren Controls.

## Demo-Bereich

Die Live-Demo wird über GitHub Pages veröffentlicht:

[https://alekszyro.github.io/PathLab/](https://alekszyro.github.io/PathLab/)

Ein separates Demo-Video ist aktuell nicht im Repository enthalten. Die Live-Demo und der aktuelle Screenshot decken den wichtigsten Portfolio-Eindruck ab.

## Dokumentation

- [Deutsche Benutzeranleitung](BENUTZERANLEITUNG_DE.md)
- [English beginner guide](USER_GUIDE_EN.md)

## Lizenz

Es wurde keine Open-Source-Lizenz vergeben. Der Code ist öffentlich einsehbar, aber es werden keine zusätzlichen Nutzungsrechte eingeräumt.

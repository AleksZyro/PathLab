# PathLab

**Deutsch** | [English](./README_EN.md)

PathLab ist ein interaktiver Visualizer zum Lernen und Vergleichen von Wegfindungsalgorithmen auf einem gewichteten Raster. Das Projekt ist als IMS-Portfolio-Projekt aufgebaut und zeigt Algorithmen, UI-State, Animationen, Mehrsprachigkeit und automatisierte Tests in einer kleinen React-Anwendung.

## Projektstatus

Aktueller Stand: **Portfolio-Vorbereitung auf eigenem Arbeitsbranch**.

Die Anwendung ist lokal lauffähig und wird mit Vitest getestet. Eine öffentliche Live-Demo ist noch nicht eingerichtet. Screenshots sind vorbereitet, aber noch nicht im Repository abgelegt.

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

## Bekannte Einschränkungen

- Dijkstra und A* nutzen Array-Sortierung statt Priority Queue.
- Das Raster hat eine feste Grösse und ist als Lernumgebung gedacht.
- Es gibt noch keine CI-Pipeline.
- Es gibt noch keine eingerichtete Live-Demo.
- Screenshots müssen noch manuell aufgenommen werden.

## Screenshot-Bereich

Der Ordner [docs/screenshots](./docs/screenshots/) ist vorbereitet. Aktuell sind dort keine Screenshots enthalten.

Empfohlene Screenshots:

- Startansicht im Dunkelmodus mit leerem Raster
- Beispiel `A* vs Dijkstra Demo` nach dem Laden
- Ergebnis nach einer Visualisierung mit Pfad und Statistik
- Algorithmus-Vergleichstabelle
- mobile Ansicht bei etwa 375 px Breite

## Demo-Bereich

Noch keine Live-Demo eingerichtet.

Empfehlung: Für dieses Vite-Projekt ist **Vercel** am einfachsten, weil keine spezielle Routing-Konfiguration nötig ist. Alternativ funktionieren Netlify oder GitHub Pages ebenfalls. Für GitHub Pages wäre voraussichtlich eine `base`-Konfiguration in `vite.config.js` nötig, zum Beispiel `/PathLab/`.

## Dokumentation

- [Deutsche Benutzeranleitung](BENUTZERANLEITUNG_DE.md)
- [English beginner guide](USER_GUIDE_EN.md)

## Lizenz

Für dieses Repository wurde noch keine ausdrückliche Lizenz festgelegt. Bis eine Lizenz gewählt und ergänzt wurde, gelten keine automatisch eingeräumten Nutzungsrechte ausserhalb der GitHub-Standardanzeige.

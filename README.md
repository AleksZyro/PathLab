# PathLab

**Deutsch** | [English](./README_EN.md)

PathLab ist ein interaktiver Visualizer zum Lernen und Vergleichen von Wegfindungsalgorithmen auf einem gewichteten Raster.

## Status

Aktueller Stand: **stabile Portfolio-Version**

Optionale spätere Verbesserungen sind am Ende aufgeführt und keine Voraussetzung für den aktuellen Projektstand.

## Funktionsweise

Nutzer können Wände platzieren, Start- und Zielknoten verschieben und gewichtete Felder einzeichnen. Normale Felder kosten 1, Wasser kostet 5 und Schlamm kostet 10.

PathLab visualisiert vier Algorithmen:

- **BFS** findet auf einem ungewichteten Raster den kürzesten Weg nach Anzahl Schritte.
- **DFS** zeigt die Tiefensuche, garantiert aber nicht den kürzesten Weg.
- **Dijkstra** findet bei unterschiedlichen Feldkosten den günstigsten Weg.
- **A\*** kombiniert die bisherigen Wegkosten mit einer Manhattan-Distanzschätzung.

## Hauptfunktionen

- interaktives Raster für Maus, Trackpad, Touchscreen und Stylus
- verschiebbare Start- und Zielknoten
- Wände, Wasser und Schlamm
- animierte Algorithmusvisualisierung
- Live-Erklärungen während eines Durchlaufs
- Geschwindigkeitssteuerung und Beispielszenarien
- Vergleichstabelle für Algorithmen
- Ergebniskennzeichnungen und Kostenaufschlüsselung
- Rückgängig und Wiederholen
- getrennte Anzeige von Berechnungs- und Animationszeit
- deutsche und englische Inhalte
- Hell- und Dunkelmodus
- Einsteigeranleitungen
- automatisierte Tests für Algorithmen und Rasterzustände

## Zeitmessung

PathLab unterscheidet zwischen:

- **Berechnungszeit:** Zeit für die eigentliche Algorithmusberechnung
- **Animationszeit:** bewusst langsamere visuelle Wiedergabe

Dadurch wird die Animationsdauer nicht als Laufzeit des Algorithmus dargestellt.

## Tech-Stack

- React
- JavaScript
- Vite
- CSS
- Vitest

## Einrichtung

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

## Dokumentation

- [Deutsche Benutzeranleitung](BENUTZERANLEITUNG_DE.md)
- [English beginner guide](USER_GUIDE_EN.md)

## Projektstruktur

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

## Optionale spätere Verbesserungen

- Portfolio-Fallstudie
- Tastenkürzel für Werkzeuge
- optionale Schritt-für-Schritt-Wiedergabe

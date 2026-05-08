# PathLab Benutzeranleitung für Anfänger

Diese Anleitung ist für Personen gedacht, die Wegfindungsalgorithmen noch nicht kennen oder keine Informatik-Erfahrung haben.

## Was ist PathLab?

PathLab ist eine interaktive Website, die zeigt, wie ein Computer einen Weg von einem Startpunkt zu einem Zielpunkt sucht.

Das Spielfeld besteht aus vielen kleinen Feldern. Einige Felder können Wände sein. Durch Wände darf der Algorithmus nicht laufen.

## Was kann man damit lernen?

Mit PathLab kann man verstehen:

- wie Wegfindung grundsätzlich funktioniert
- wie verschiedene Algorithmen suchen
- warum manche Algorithmen kürzere Wege finden
- warum manche Algorithmen mehr Felder durchsuchen
- wie Hindernisse die Suche verändern

## Grundidee

1. Startfeld auswählen.
2. Zielfeld auswählen.
3. Wände zeichnen.
4. Algorithmus auswählen.
5. Visualisierung starten.
6. Beobachten, wie der Algorithmus sucht.

## Wichtige Begriffe

### Grid

Das Grid ist das Feld aus vielen kleinen Zellen.

### Start

Der Start ist das Feld, bei dem die Suche beginnt.

### Ziel

Das Ziel ist das Feld, das der Algorithmus erreichen soll.

### Wand

Eine Wand blockiert den Weg. Der Algorithmus darf nicht durch Wände laufen.

### Besuchtes Feld

Ein besuchtes Feld wurde vom Algorithmus bereits überprüft.

### Pfad

Der Pfad ist die fertige Route vom Start zum Ziel.

## Algorithmen

### BFS

BFS sucht Schicht für Schicht. Wenn alle Schritte gleich teuer sind, findet BFS den kürzesten Weg.

### DFS

DFS geht zuerst tief in eine Richtung, bevor andere Möglichkeiten getestet werden. DFS findet nicht immer den kürzesten Weg.

### Dijkstra

Dijkstra findet den kürzesten Weg, auch wenn Felder unterschiedliche Kosten haben können.

### A*

A* nutzt eine Schätzung in Richtung Ziel. Dadurch ist A* oft schneller als Dijkstra.

## Empfohlene Reihenfolge zum Lernen

1. Starte mit BFS.
2. Zeichne ein paar Wände.
3. Vergleiche BFS mit DFS.
4. Teste danach Dijkstra und A*.
5. Beobachte die Statistiken.

## Ziel

Am Ende sollst du verstehen, wie verschiedene Algorithmen einen Weg suchen und warum sie sich unterschiedlich verhalten.

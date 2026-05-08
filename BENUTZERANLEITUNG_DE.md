# PathLab Benutzeranleitung für Anfänger

Diese Anleitung ist für Personen gedacht, die Wegfindungsalgorithmen noch nicht kennen oder keine Informatik-Erfahrung haben.

## Was ist PathLab?

PathLab ist eine interaktive Website, die zeigt, wie ein Computer einen Weg von einem Startpunkt zu einem Zielpunkt sucht.

Das Spielfeld besteht aus vielen kleinen Feldern. Einige Felder können Wände oder schwieriger Boden sein. Der Algorithmus muss einen Weg finden, der vom Start zum Ziel führt.

## Was bedeuten die Farben?

- Grün: Start
- Rot: Ziel
- Dunkelgrau: Wand, nicht begehbar
- Blau: Wasser, kostet 5
- Braun: Schlamm, kostet 10
- Hellblau: besuchtes Feld
- Gelb: gefundener Pfad
- Leeres Feld: normaler Boden, kostet 1

## Bedienung

1. Wähle links ein Werkzeug aus.
2. Zeichne Wände, Wasser oder Schlamm ins Grid.
3. Setze bei Bedarf Start und Ziel neu.
4. Wähle einen Algorithmus aus.
5. Klicke auf **Visualisierung starten**.
6. Beobachte, wie sich die Suche ausbreitet.
7. Am Ende zeigt der gelbe Pfad den gefundenen Weg.

## Werkzeuge

- **Wand:** blockiert ein Feld komplett
- **Wasser:** begehbar, aber teurer als normaler Boden
- **Schlamm:** begehbar, aber noch teurer als Wasser
- **Löschen:** macht ein Feld wieder frei
- **Start setzen:** verschiebt den Startpunkt
- **Ziel setzen:** verschiebt den Zielpunkt

## Algorithmus-Vergleich

Mit **Alle vergleichen** werden BFS, DFS, Dijkstra und A* auf demselben Grid berechnet. Die Tabelle zeigt dann:

- ob ein Weg gefunden wurde
- wie viele Felder besucht wurden
- wie lang der Pfad ist
- wie teuer der Pfad ist
- wie lange die Berechnung gedauert hat

Das hilft, die Algorithmen direkt miteinander zu vergleichen.

## Was misst die Zeit in ms?

PathLab unterscheidet zwei Zeiten:

- **Berechnung:** echte Rechenzeit des Algorithmus
- **Animation:** Dauer der sichtbaren Animation

Die Animation wird absichtlich langsamer abgespielt, damit man die Suche sehen kann. Diese Wartezeit ist nicht dasselbe wie die Berechnungszeit.

## Algorithmen einfach erklärt

### BFS

BFS steht für Breadth-First Search. Man kann es sich wie eine Wasserwelle vorstellen: Die Suche breitet sich vom Startpunkt gleichmäßig in alle Richtungen aus.

BFS findet auf einem normalen Grid den kürzesten Weg nach Anzahl Schritten. Wasser und Schlamm werden aber nicht als teurer verstanden.

### DFS

DFS steht für Depth-First Search. DFS geht zuerst so weit wie möglich in eine Richtung. Wenn es nicht mehr weiterkommt, geht es zurück und versucht eine andere Richtung.

DFS ist gut, um Tiefensuche zu verstehen. Für den besten Weg ist DFS aber nicht zuverlässig.

### Dijkstra

Dijkstra sucht immer dort weiter, wo der bisher bekannte Weg am günstigsten ist.

Wenn Wasser oder Schlamm im Weg liegt, kann Dijkstra einen längeren Weg wählen, der insgesamt weniger kostet.

### A*

A* ist ähnlich wie Dijkstra, aber zielgerichteter.

A* schaut auf die bisherigen Kosten und schätzt zusätzlich, wie weit es noch bis zum Ziel ist. Dadurch besucht A* oft weniger Felder als Dijkstra.

## Empfohlene Reihenfolge zum Lernen

1. Starte mit BFS ohne Wasser oder Schlamm.
2. Zeichne ein paar Wände.
3. Vergleiche BFS mit DFS.
4. Zeichne Wasser oder Schlamm in den direkten Weg.
5. Vergleiche Dijkstra und A* mit BFS.
6. Nutze **Alle vergleichen**, um die Zahlen nebeneinander zu sehen.

## Ziel

Am Ende sollst du verstehen, wie verschiedene Algorithmen einen Weg suchen und warum Gewichtung den besten Weg verändern kann.

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
2. Halte die Maustaste gedrückt und ziehe über das Grid, um mehrere Felder wie mit einem Pinsel zu bearbeiten.
3. Zeichne Wände, Wasser oder Schlamm ins Grid.
4. Setze bei Bedarf Start und Ziel neu.
5. Wähle einen Algorithmus aus.
6. Klicke auf **Visualisierung starten**.
7. Beobachte, wie sich die Suche ausbreitet.
8. Am Ende zeigt der gelbe Pfad den gefundenen Weg.

## Werkzeuge

- **Wand:** blockiert ein Feld komplett
- **Wasser:** begehbar, aber teurer als normaler Boden
- **Schlamm:** begehbar, aber noch teurer als Wasser
- **Löschen:** macht ein Feld wieder frei
- **Start setzen:** verschiebt den Startpunkt
- **Ziel setzen:** verschiebt den Zielpunkt

Start und Ziel werden bewusst nur per Klick gesetzt. Für Wand, Wasser, Schlamm und Löschen funktioniert das Zeichnen per Drag-Bewegung.

## Beispiele laden

Über **Beispiel laden** kannst du vorbereitete Szenarien auswählen, zum Beispiel:

- Einfacher Weg
- Wasser-Barriere
- Schlamm-Falle
- Kein möglicher Weg
- A* vs Dijkstra Demo

Damit kann man sofort testen, ohne zuerst selbst ein gutes Grid bauen zu müssen.

## Undo und Redo

Mit **Undo** kannst du die letzte Änderung rückgängig machen. Mit **Redo** kannst du sie wiederherstellen.

Das ist besonders nützlich, wenn man mit dem Pinsel versehentlich zu viele Felder verändert.

## Feld-Info

Wenn du mit der Maus über ein Feld fährst, zeigt PathLab den Typ, die Kosten und die Position des Feldes an.

Beispiel:

```text
Typ: Wasser
Kosten: 5
Position: 8, 14
```

## Algorithmus-Vergleich

Mit **Alle vergleichen** werden BFS, DFS, Dijkstra und A* auf demselben Grid berechnet. Die Tabelle zeigt dann:

- ob ein Weg gefunden wurde
- wie viele Felder besucht wurden
- wie lang der Pfad ist
- wie teuer der Pfad ist
- wie lange die Berechnung gedauert hat
- welcher Algorithmus in einer Kategorie am besten war

## Pfadkosten-Aufschlüsselung

PathLab zeigt, wie sich die Kosten eines Pfades zusammensetzen:

```text
Normal: 12 × 1 = 12
Wasser: 3 × 5 = 15
Schlamm: 1 × 10 = 10
Gesamtkosten: 37
```

Dadurch versteht man besser, warum ein längerer Weg manchmal günstiger ist.

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

# PathLab Benutzeranleitung für Anfänger

Diese Anleitung ist für Personen gedacht, die Wegfindungsalgorithmen noch nicht kennen oder keine Informatik-Erfahrung haben.

## Was ist PathLab?

PathLab ist eine interaktive Website, die zeigt, wie ein Computer einen Weg von einem Startpunkt zu einem Zielpunkt sucht.

Das Spielfeld besteht aus vielen kleinen Feldern. Einige Felder können Wände sein. Durch Wände darf der Algorithmus nicht laufen.

## Was bedeuten die Farben?

- Grün: Start
- Rot: Ziel
- Dunkelgrau: Wand
- Blau: besuchtes Feld
- Gelb: gefundener Pfad
- Leeres Feld: frei begehbar

## Bedienung

1. Zeichne zuerst Wände in das Grid.
2. Wähle einen Algorithmus aus.
3. Stelle die Geschwindigkeit ein.
4. Klicke auf **Visualisierung starten**.
5. Beobachte, wie sich die Suche ausbreitet.
6. Am Ende zeigt der gelbe Pfad den gefundenen Weg.

## Was misst die Zeit in ms?

Die Zeit in Millisekunden misst nur die eigentliche Berechnung des Algorithmus.

Die Animation wird absichtlich langsamer abgespielt, damit man die Suche sehen kann. Diese Wartezeit zählt nicht zur Berechnungszeit.

Wenn dort also zum Beispiel `2 ms` steht, bedeutet das: Der Algorithmus hat den Weg in etwa 2 Millisekunden berechnet. Die Anzeige auf dem Bildschirm kann trotzdem mehrere Sekunden dauern, weil die Animation künstlich verlangsamt wird.

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

## Algorithmen einfach erklärt

### BFS

BFS steht für Breadth-First Search. Man kann es sich wie eine Wasserwelle vorstellen: Die Suche breitet sich vom Startpunkt gleichmäßig in alle Richtungen aus.

BFS prüft zuerst alle Felder, die sehr nahe am Start sind. Danach prüft es die Felder, die etwas weiter weg sind. Deshalb findet BFS auf diesem Grid den kürzesten Weg.

### DFS

DFS steht für Depth-First Search. DFS geht zuerst so weit wie möglich in eine Richtung. Wenn es nicht mehr weiterkommt, geht es zurück und versucht eine andere Richtung.

DFS kann schnell irgendwo tief hineinlaufen. Deshalb wirkt es manchmal chaotischer und findet nicht immer den kürzesten Weg.

### Dijkstra

Dijkstra sucht immer dort weiter, wo der bisher bekannte Weg am günstigsten ist.

In PathLab sind aktuell alle Felder gleich teuer. Deshalb sieht Dijkstra ähnlich aus wie BFS. Später wird Dijkstra besonders interessant, wenn es Felder mit unterschiedlichen Kosten gibt, zum Beispiel Schlamm oder Wasser.

### A*

A* ist ähnlich wie Dijkstra, aber etwas zielgerichteter.

A* schaut nicht nur auf den bisherigen Weg, sondern schätzt zusätzlich, wie weit es noch bis zum Ziel ist. Dadurch läuft A* meistens direkter in Richtung Ziel und besucht oft weniger Felder.

## Empfohlene Reihenfolge zum Lernen

1. Starte mit BFS.
2. Zeichne ein paar Wände.
3. Vergleiche BFS mit DFS.
4. Teste danach Dijkstra.
5. Teste am Schluss A* und achte darauf, ob weniger blaue Felder entstehen.

## Ziel

Am Ende sollst du verstehen, wie verschiedene Algorithmen einen Weg suchen und warum sie sich unterschiedlich verhalten.

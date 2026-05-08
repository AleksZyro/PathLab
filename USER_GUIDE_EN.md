# PathLab Beginner Guide

This guide is for people who do not yet know pathfinding algorithms.

## What is PathLab?

PathLab is an interactive website that shows how a computer can search for a path from a start point to a target point.

The grid is made of cells. Some cells can be walls, which means the algorithm is not allowed to move through them.

## What can you learn?

With PathLab you can learn:

- how pathfinding works
- how different algorithms search
- why some algorithms find shorter paths
- why some algorithms visit more cells than others
- how walls and obstacles change the search

## Basic use

1. Choose an algorithm.
2. Draw walls on the grid.
3. Use the speed slider to choose how fast the animation should run.
4. Click **Run visualization**.
5. Watch the visited cells and the final path.
6. Use **Clear path**, **Clear walls**, or **Reset grid** when needed.

## Important terms

### Grid

The grid is the area made of many small cells.

### Start

The start is the cell where the search begins.

### Target

The target is the cell the algorithm tries to reach.

### Wall

A wall blocks the path. The algorithm cannot move through walls.

### Visited cell

A visited cell is a cell that the algorithm has already checked.

### Path

The path is the final route from the start to the target.

## Algorithms

### BFS

BFS checks the grid layer by layer. It is good for finding the shortest path when all moves have the same cost.

### DFS

DFS goes deep into one direction before trying another direction. It does not always find the shortest path.

### Dijkstra

Dijkstra finds the shortest path by always expanding the currently cheapest known cell.

### A*

A* uses a heuristic to move more directly toward the target. It often visits fewer cells than Dijkstra on a simple grid.

## Statistics

PathLab shows:

- visited cells
- path cells
- runtime
- wall count

These values help you compare algorithms.

## Recommended learning order

1. Start with BFS.
2. Add a few walls.
3. Compare BFS with DFS.
4. Then try Dijkstra and A*.
5. Watch the statistics panel.

## Goal

At the end, you should understand how different algorithms search for a path and why their behavior is different.

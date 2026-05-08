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

## Basic idea

1. Choose a start cell.
2. Choose a target cell.
3. Draw walls.
4. Select an algorithm.
5. Start the visualization.
6. Watch how the algorithm searches.

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

Dijkstra finds the shortest path when cells can have different costs.

### A*

A* uses a heuristic to move more directly toward the target. It is often faster than Dijkstra.

## Recommended learning order

1. Start with BFS.
2. Add a few walls.
3. Compare BFS with DFS.
4. Then try Dijkstra and A*.
5. Watch the statistics panel.

## Goal

At the end, you should understand how different algorithms search for a path and why their behavior is different.

# PathLab Beginner Guide

This guide is for people who do not yet know pathfinding algorithms.

## What is PathLab?

PathLab is an interactive website that shows how a computer searches for a path from a start point to a target point.

The board is made of small cells. Some cells can be walls. The algorithm is not allowed to move through walls.

## What do the colors mean?

- Green: start
- Red: target
- Dark gray: wall
- Blue: visited cell
- Yellow: final path
- Empty cell: open cell

## Basic use

1. Draw walls on the grid.
2. Choose an algorithm.
3. Set the animation speed.
4. Click **Run visualization**.
5. Watch how the search spreads.
6. At the end, the yellow cells show the found path.

## What does the ms value measure?

The time in milliseconds measures only the actual algorithm calculation.

The animation is intentionally slowed down so users can see the search. This waiting time is not part of the calculation time.

For example, if PathLab shows `2 ms`, it means the algorithm calculated the result in about 2 milliseconds. The on-screen animation can still take several seconds because it is slowed down on purpose.

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

## Algorithms explained simply

### BFS

BFS means Breadth-First Search. You can imagine it like a water wave. The search spreads evenly from the start point in all directions.

BFS checks nearby cells first. Then it checks cells that are farther away. On this grid, BFS finds the shortest path.

### DFS

DFS means Depth-First Search. DFS goes as far as possible in one direction first. If it gets stuck, it goes back and tries another direction.

DFS can quickly move deep into one part of the grid. That is why it can look less organized and does not always find the shortest path.

### Dijkstra

Dijkstra always continues from the cheapest known path so far.

In PathLab, all cells currently have the same cost. That is why Dijkstra looks similar to BFS. Later, Dijkstra becomes more interesting when weighted cells are added, such as mud or water.

### A*

A* is similar to Dijkstra, but more goal-oriented.

A* looks at the path cost so far and also estimates how far it still is from the target. This usually makes A* search more directly toward the target and visit fewer cells.

## Recommended learning order

1. Start with BFS.
2. Draw a few walls.
3. Compare BFS with DFS.
4. Then try Dijkstra.
5. Finally try A* and check whether it creates fewer blue visited cells.

## Goal

At the end, you should understand how different algorithms search for a path and why their behavior is different.

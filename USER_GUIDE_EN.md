# PathLab Beginner Guide

This guide is for people who do not yet know pathfinding algorithms.

## What is PathLab?

PathLab is an interactive website that shows how a computer searches for a path from a start point to a target point.

The board is made of small cells. Some cells can be walls or weighted terrain. The algorithm has to find a route from the start to the target.

## What do the colors mean?

- Green: start
- Red: target
- Dark gray: wall, not walkable
- Blue: water, cost 5
- Brown: mud, cost 10
- Light blue: visited cell
- Yellow: final path
- Empty cell: normal ground, cost 1

## Basic use

1. Choose a tool on the left.
2. Draw walls, water, or mud on the grid.
3. Move the start or target if needed.
4. Choose an algorithm.
5. Click **Run visualization**.
6. Watch how the search spreads.
7. At the end, the yellow cells show the found path.

## Tools

- **Wall:** blocks a cell completely
- **Water:** walkable, but more expensive than normal ground
- **Mud:** walkable, but more expensive than water
- **Erase:** turns a cell back into normal ground
- **Set start:** moves the start point
- **Set target:** moves the target point

## Algorithm Comparison

With **Compare all**, PathLab calculates BFS, DFS, Dijkstra and A* on the same grid. The table shows:

- whether a path was found
- how many cells were visited
- how long the path is
- how expensive the path is
- how long the calculation took

This helps compare algorithms directly.

## What does the ms value measure?

PathLab separates two different times:

- **Calculation:** real algorithm computation time
- **Animation:** visible playback duration

The animation is intentionally slowed down so users can see the search. This waiting time is not the same as the calculation time.

## Algorithms explained simply

### BFS

BFS means Breadth-First Search. You can imagine it like a water wave. The search spreads evenly from the start point in all directions.

BFS finds the shortest path by number of steps on a normal grid. It does not understand that water or mud is more expensive.

### DFS

DFS means Depth-First Search. DFS goes as far as possible in one direction first. If it gets stuck, it goes back and tries another direction.

DFS is good for understanding depth-first behavior. It is not reliable for finding the best path.

### Dijkstra

Dijkstra always continues from the cheapest known path so far.

If water or mud is in the way, Dijkstra can choose a longer path that is cheaper overall.

### A*

A* is similar to Dijkstra, but more goal-oriented.

A* looks at the path cost so far and also estimates how far it still is from the target. This often makes A* visit fewer cells than Dijkstra.

## Recommended learning order

1. Start with BFS without water or mud.
2. Draw a few walls.
3. Compare BFS with DFS.
4. Draw water or mud into the direct path.
5. Compare Dijkstra and A* with BFS.
6. Use **Compare all** to see the numbers side by side.

## Goal

At the end, you should understand how different algorithms search for a path and why weighted terrain can change the best route.

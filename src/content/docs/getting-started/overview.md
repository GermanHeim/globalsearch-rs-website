---
title: Overview
description: Learn about GlobalSearch-rs and how it works
---

`globalsearch-rs` is a Rust implementation of the _OQNLP_ (OptQuest/NLP) algorithm, a global
optimization algorithm that combines scatter search with local nonlinear programming (NLP) solvers.

The algorithm follows a multistart strategy, where an initial set of points (also known as reference
set) is generated using scatter search techniques. Promising candidates are selected and refined
using local solvers, allowing for efficient navigation of the search space.

## How the Algorithm Works

The _OQNLP_ algorithm operates in the following steps:

### Scatter Search (Exploration)

The algorithm begins by sampling a diverse population of candidate points within the variable
bounds. This stage explores the full search space broadly and heuristically selects promising
starting points.

### Local Optimization (Exploitation)

Each selected candidate is refined using a local NLP solver—provided by the [`cobyla`](https://github.com/relf/cobyla) and [`argmin`](https://github.com/argmin-rs/argmin) crate—with optional gradient or Hessian information.
These local optimizers aim to drive solutions towards local minima of your objective function.

### Multistart Coordination

The algorithm alternates between scatter search steps and localized refinements through distance and
merit filters.

Merit filtering applies a threshold-based cutoff, where only points whose objective function (i.e.
"merit") is within a certain relative range of the best-known solution are eligible for further
processing. The better candidate's merit establishes a baseline.

On the other hand, distance filtering enforces spatial diversity among selected candidates. It uses
a parameter `distance_factor` along with the population’s reference set to measure how far each new
candidate is from existing ones.

Merit filtering ensures computational effort is focused on reasonably strong candidates, improving
efficiency, while distance filtering avoids redundant local searches from near-identical
points—reducing wasted computation and increasing the probability of hitting the global optimum.

This multistart design reduces the impact of poor initialization and helps uncover global optima.

### Construction of Solution Set

After running for the selected amount of iterations, optimal solutions are collected from the local
refinements and combined into a final solution set. This set represents the best-found solutions
across all multistart attempts, providing a diverse range of high-quality candidates for further
analysis or deployment.

Equal solutions are defined as solutions that have the same objective function value with a relative
tolerance of `1e-6` and an absolute tolerance of `1e-8`.

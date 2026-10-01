---
title: Running an Optimization Problem
description: Learn how to set up and run an optimization problem using PyGlobalSearch
---

This guide will walk you through the steps to set up and run an optimization problem using the
`PyGlobalSearch` package in Python. We will cover defining the objective function, setting variable
bounds, configuring the optimization parameters, and executing the optimization process.

## Setting Up the Environment

Install `PyGlobalSearch` v0.7.0 as described in [Installation](../installation):

```bash
pip install pyglobalsearch==0.7.0
```

You will also need `numpy` for handling arrays. If you don't have it installed, you can install it
using pip:

```bash
pip install numpy
```

## Defining your Problem

First, we need to define our optimization problem. We will create a `Problem` instance using the
provided function by `pyglobalsearch`. We will implement the `objective` method to define our
objective function and the `variable_bounds` method to set the bounds for each variable.

```python
import pyglobalsearch as gs
import numpy as np

def objective_function(x):
    # Define your objective function here
    return x[0]**2 + x[1]**2

def variable_bounds():
    # Define the bounds for each variable
    return [(-10, 10), (-10, 10)]

problem = gs.PyProblem(objective=objective_function, variable_bounds=variable_bounds)
```

In the example above, we define an objective function that computes the sum of squares of the
variables and set the variable bounds to be between -10 and 10 for both variables.

## Configuring the Optimization Parameters

After setting up the problem, we need to configure the optimization parameters. This includes
setting the population size, number of iterations, and other algorithm-specific parameters. We can
do this using the `OQNLPParams` class.

We recommend reading the [Overview documentation](../../getting-started/overview) to understand how
the algorithm works.

```python
params = gs.PyOQNLPParams(
 iterations=100,
 population_size=500,
 wait_cycle=10,
 threshold_factor=0.75,
 distance_factor=0.1,
)
```

Make sure to adjust the parameters according to your specific optimization problem and requirements.

## Running the Optimization

Now that we have defined our problem and configured the parameters, we can create an `OQNLP`
instance and run the optimization process.

```python
result = gs.optimize(problem, params, local_solver="COBYLA", seed=0)
print(result)
```

All solvers use Basin. `local_solver` accepts `cobyla` (default), `lbfgs`, `gradient_descent`,
`trust_region`, `nelder_mead`, `lbfgsb`, `bounded_nelder_mead`, `bobyqa`, `slsqp`, `barrier`, and
`augmented_lagrangian` (case-insensitive; hyphens or compact spelling also work). For custom
settings, pass a builder config which must match the solver name when both are given:

```python
def gradient(x):
    return 2.0 * np.asarray(x)

problem = gs.PyProblem(objective_function, variable_bounds, gradient=gradient)
config = gs.builders.lbfgsb(max_iter=500, tolerance_projected_grad=1e-8)
result = gs.optimize(problem, params, local_solver_config=config)
```

`cobyla` and `slsqp` support nonlinear constraints. SLSQP needs a gradient and a Jacobian for
nonlinear constraint blocks. `barrier` handles linear inequalities and box bounds;
`augmented_lagrangian` handles linear equalities but does not enforce box bounds locally. See
[Local Solvers](../../local-solvers) for all requirements.

Your complete code should look like this:

```python
import pyglobalsearch as gs
import numpy as np

def objective_function(x):
    # Define your objective function here
    return x[0]**2 + x[1]**2

def variable_bounds():
    # Define the bounds for each variable
    return [(-10, 10), (-10, 10)]

problem = gs.PyProblem(objective=objective_function, variable_bounds=variable_bounds)
params = gs.PyOQNLPParams(
 iterations=100,
 population_size=500,
 wait_cycle=10,
 threshold_factor=0.75,
 distance_factor=0.1,
)

result = gs.optimize(problem, params, local_solver="COBYLA", seed=0)
print(result)
```

If everything is set up correctly, running the above code will execute the optimization process and
print the following results:

```text
Solution Set
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total solutions: 1
Best objective value: 0.00000000e0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Solution #1
  Objective: 0.00000000e0
  Parameters: [0.0, 0.0]
```

This output indicates that the optimization process has found a solution with an objective value of
`0.0` at the parameters `[0.0, 0.0]`, which is the expected minimum for our defined objective
function. This is a convex problem, so the global minimum is easily found.

## Constraints

`PyProblem` accepts these optional keyword arguments:

| Argument               | Convention                                                                     | Local solvers                                 |
| ---------------------- | ------------------------------------------------------------------------------ | --------------------------------------------- |
| `constraints`          | List of scalar callbacks, each satisfied when `g(x) >= 0`                      | COBYLA, SLSQP                                 |
| `nonlinear_equalities` | List of scalar callbacks for `h(x) = 0`                                        | COBYLA, SLSQP                                 |
| `linear_inequalities`  | `(A, b)` for `A x <= b`                                                        | COBYLA, SLSQP, Barrier                        |
| `linear_equalities`    | `(A, b)` for `A x = b`                                                         | COBYLA, SLSQP, Augmented Lagrangian           |
| `constraint_jacobian`  | Matrix callback: nonlinear equality rows first, then nonlinear inequality rows | SLSQP, when nonlinear constraints are present |

For `n` variables and `m` linear constraints, `A` has shape `(m, n)` and `b` has length `m`. The
nonlinear Jacobian has one row per nonlinear constraint and one column per variable; differentiate
the public `g(x) >= 0` convention directly. Do not include linear rows. Constraint counts and
ordering must remain stable.

This example combines a linear inequality, a nonlinear inequality, and box bounds:

```python
import numpy as np
import pyglobalsearch as gs

def objective(x):
    return (x[0] - 2.0)**2 + (x[1] + 1.0)**2

def gradient(x):
    return np.array([2.0 * (x[0] - 2.0), 2.0 * (x[1] + 1.0)])

problem = gs.PyProblem(
    objective=objective,
    variable_bounds=[[-5.0, 5.0], [-5.0, 5.0]],
    gradient=gradient,
    linear_inequalities=([[1.0, 1.0]], [0.5]),  # x + y <= 0.5
    constraints=[lambda x: x[0]**2 + x[1]**2 - 0.5],
    constraint_jacobian=lambda x: np.array([[2.0 * x[0], 2.0 * x[1]]]),
)
params = gs.PyOQNLPParams(iterations=10, population_size=100, wait_cycle=5)
config = gs.builders.slsqp(accuracy=1e-8)
result = gs.optimize(problem, params, local_solver_config=config, seed=0)
best = result.best_solution()
if best is not None:
    print(best.x(), best.fun())  # Approximately [1.75, -1.25], 0.125
```

Solutions are `PyLocalSolution` objects: use `.x()` and `.fun()` (or `.point` and `.objective`) to
access their values.

:::caution[Global search with equalities]

Scatter search projects samples onto linear equalities and screens candidate feasibility. Nonlinear
equality surfaces generally cannot be reached reliably by random sampling, even when the local
solver supports them. Use a local solve or sufficient feasible starting candidates; a global run may
otherwise fail during initialization. Augmented Lagrangian does not enforce box bounds locally; use
SLSQP when both linear equalities and strict bounds are needed.

:::

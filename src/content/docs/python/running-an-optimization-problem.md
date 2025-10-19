---
title: Running an Optimization Problem
description: Learn how to set up and run an optimization problem using PyGlobalSearch
---

This guide will walk you through the steps to set up and run an optimization problem using the
`PyGlobalSearch` package in Python. We will cover defining the objective function, setting variable bounds,
configuring the optimization parameters, and executing the optimization process.

## Setting Up the Environment

Make sure to install the `PyGlobalSearch` package. You can do this using pip:

```bash
pip install pyglobalsearch
```

You will also need `numpy` for handling arrays. If you don't have it installed, you can install it using pip:

```bash
pip install numpy
```

## Defining your Problem

First, we need to define our optimization problem. We will create a `Problem` instance using the provided function by `pyglobalsearch`. We will implement the `objective` method to define our objective function and the `variable_bounds` method to set the bounds for each variable.

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

In the example above, we define an objective function that computes the sum of squares of the variables and set the variable bounds to be between -10 and 10 for both variables.

## Configuring the Optimization Parameters

After setting up the problem, we need to configure the optimization parameters. This includes setting the population size, number of iterations, and other algorithm-specific parameters. We can do this using the `OQNLPParams` class.

We recommend reading the [Overview documentation](../../getting-started/overview) to understand how the algorithm works.

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

Now that we have defined our problem and configured the parameters, we can create an `OQNLP` instance and run the optimization process.

```python
result = gs.optimize(problem, params, local_solver="COBYLA", seed=0)
print(result)
```

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

If everything is set up correctly, running the above code will execute the optimization process and print the following results:

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

This output indicates that the optimization process has found a solution with an objective value of `0.0` at the parameters `[0.0, 0.0]`, which is the expected minimum for our defined objective function. This is a convex problem, so the global minimum is easily found.

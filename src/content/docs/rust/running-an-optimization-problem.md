---
title: Running an Optimization Problem
description: Learn how to set up and run an optimization problem using globalsearch-rs
---

This guide will walk you through the steps to set up and run an optimization problem using the
`globalsearch-rs` crate in Rust. We will cover defining the objective function, setting variable
bounds, configuring the optimization parameters, and executing the optimization process.

## Setting Up the Environment

Make sure to include `globalsearch` and `ndarray` in your `Cargo.toml`:

```toml
[dependencies]
globalsearch = "0.7.0"
ndarray = "0.17"
```

## Defining your Problem

First, we need to define our optimization problem. We will need to import the `Problem` trait from
`globalsearch::problem::Problem` and implement it for our specific problem. We will also need to use
`ndarray` for handling arrays.

You can read more about the `Problem` trait in the
[docs.rs](https://docs.rs/globalsearch/latest/globalsearch/problem/trait.Problem.html).

Since we are going to use the Basin COBYLA local solver, we only need to implement the `objective`
and `variable_bounds` methods of the `Problem` trait. COBYLA also supports constraints, so if your
problem has constraints, you will need to implement the `constraints` method as well.

All local solvers use Basin. Gradient-based methods require `gradient`, and trust region also
requires `hessian`. COBYLA and SLSQP support nonlinear constraints; SLSQP requires a constraint
Jacobian when nonlinear constraints are present. COBYLA, L-BFGS-B, bounded Nelder-Mead, BOBYQA,
SLSQP, and Barrier enforce box bounds locally. Other solvers can return points outside the bounds;
use `exclude_out_of_bounds` to filter them. See [Local Solvers](../../local-solvers) for the full
requirements.

```rust
use globalsearch::problem::Problem;
use globalsearch::types::EvaluationError;
use ndarray::{array, Array1, Array2};

#[derive(Clone)]
struct MinimizeProblem;

impl Problem for MinimizeProblem {
    fn objective(&self, x: &Array1<f64>) -> Result<f64, EvaluationError> {
        Ok(x.iter().map(|xi| xi.powi(2)).sum())
    }

    fn variable_bounds(&self) -> Array2<f64> {
        array![[-10.0, 10.0], [-10.0, 10.0]]
    }
}
```

In the example above, we define a struct `MinimizeProblem` that implements the `Problem` trait. The
`objective` method computes the value of the objective function at a given point `x`, and the
`variable_bounds` method returns the bounds for each variable.

## Configuring the Optimization Parameters

After setting up the problem, we need to configure the optimization parameters. This includes
setting the population size, number of iterations, and other algorithm-specific parameters. We can
do this using the `OQNLPParams` struct.

We recommend reading the [Overview documentation](../../getting-started/overview) to understand how
the algorithm works and the
[OQNLPParams API documentation](https://docs.rs/globalsearch/latest/globalsearch/types/struct.OQNLPParams.html).

```rust
use globalsearch::types::OQNLPParams;

let params: OQNLPParams = OQNLPParams {
    iterations: 250,
    wait_cycle: 20,
    threshold_factor: 0.2,
    distance_factor: 1.0,
    population_size: 500,
    seed: 0,
    ..Default::default()
};
```

You can also try the default parameters by using `OQNLPParams::default()`. Make sure to adjust the
parameters according to your specific optimization problem and requirements.


## Running the Optimization

Now that we have defined our problem and configured the parameters, we can create an instance of
`OQNLP` and run the optimization process.

```rust
use globalsearch::oqnlp::OQNLP;

let problem = MinimizeProblem;
let mut optimizer = OQNLP::new(problem, params)?;
let result = optimizer.run()?;
```

In the code above, we create a new instance of `OQNLP` with our problem and parameters, and then
call the `run` method to start the optimization process. The result will contain the best solution
found during the optimization. You can then analyze or use this solutions as needed.

For example, minimizing the sum of squares of two variables with bounds between -10 and 10 would
look like this:

```rust
use globalsearch::{
    local_solver::builders::COBYLABuilder,
    oqnlp::OQNLP,
    problem::Problem,
    types::{EvaluationError, OQNLPParams, SolutionSet},
};
use ndarray::{Array1, Array2};

#[derive(Clone)]
struct MinimizeProblem {
    dimension: usize,
}

impl Problem for MinimizeProblem {
    fn objective(&self, x: &Array1<f64>) -> Result<f64, EvaluationError> {
        Ok(x.iter().map(|xi| xi.powi(2)).sum())
    }

    fn variable_bounds(&self) -> Array2<f64> {
        let num_vars = self.dimension;
        Array2::from_shape_vec((num_vars, 2), vec![-10.0, 10.0].repeat(num_vars)).unwrap()
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let problem = MinimizeProblem { dimension: 2 };
    let params: OQNLPParams = OQNLPParams {
        iterations: 125,
        wait_cycle: 10,
        threshold_factor: 0.2,
        distance_factor: 0.75,
        population_size: 250,
        local_solver_config: COBYLABuilder::default().build(),
        seed: 0,
    };

    let mut optimizer: OQNLP<MinimizeProblem> = OQNLP::new(problem, params)?;

    let solution_set: SolutionSet = optimizer.run()?;
    println!("{}", solution_set);

    Ok(())
}
```

If you run the code above, you should see output similar to the following, indicating that the
optimizer has found a solution close to the global minimum at (0, 0), which is trivially the minimum
for this convex problem:

```text
━━━━━━━━━━━ Solution Set ━━━━━━━━━━━
Total solutions: 1
Best objective value: 0.00000000e0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Solution #1
  Objective: 0.00000000e0
  Parameters:
    [0.00000000e0, 0.00000000e0]
```

## Constraints

The `Problem` trait supports four constraint blocks. All callback counts, row order, and matrix
shapes must remain fixed throughout a solve. For `n` variables and `m` linear constraints, return an
`m` by `n` matrix `A` and a length-`m` vector `b`.

| Method                    | Convention                         | Local solvers                       |
| ------------------------- | ---------------------------------- | ----------------------------------- |
| `constraints(x)`          | Nonlinear inequalities `g(x) >= 0` | COBYLA, SLSQP                       |
| `nonlinear_equalities(x)` | Nonlinear equalities `h(x) = 0`    | COBYLA, SLSQP                       |
| `linear_inequalities()`   | `Some((A, b))` for `A x <= b`      | COBYLA, SLSQP, Barrier              |
| `linear_equalities()`     | `Some((A, b))` for `A x = b`       | COBYLA, SLSQP, Augmented Lagrangian |

SLSQP additionally needs `gradient` and, for nonlinear constraint blocks, `constraint_jacobian(x)`.
Jacobian rows contain the nonlinear equalities first, then the nonlinear inequalities, in callback
order; columns correspond to variables. Differentiate `h(x)` and `g(x)` directly, retaining the
public `g(x) >= 0` sign convention. Do not include linear constraint rows: their derivatives come
from `A`.

For example, minimize `(x - 2)^2 + (y + 1)^2` subject to `x + y <= 0.5`, `x^2 + y^2 >= 0.5`, and box
bounds. The constrained optimum is `(1.75, -1.25)`, with objective `0.125`:

```rust
use globalsearch::{
    local_solver::builders::SLSQPBuilder,
    oqnlp::OQNLP,
    problem::Problem,
    types::{EvaluationError, OQNLPParams},
};
use ndarray::{array, Array1, Array2};

#[derive(Clone)]
struct MixedConstraints;

impl Problem for MixedConstraints {
    fn objective(&self, x: &Array1<f64>) -> Result<f64, EvaluationError> {
        Ok((x[0] - 2.0).powi(2) + (x[1] + 1.0).powi(2))
    }

    fn gradient(&self, x: &Array1<f64>) -> Result<Array1<f64>, EvaluationError> {
        Ok(array![2.0 * (x[0] - 2.0), 2.0 * (x[1] + 1.0)])
    }

    fn variable_bounds(&self) -> Array2<f64> {
        array![[-5.0, 5.0], [-5.0, 5.0]]
    }

    fn linear_inequalities(&self) -> Option<(Array2<f64>, Array1<f64>)> {
        Some((array![[1.0, 1.0]], array![0.5]))
    }

    fn constraints(&self, x: &Array1<f64>) -> Result<Array1<f64>, EvaluationError> {
        Ok(array![x[0].powi(2) + x[1].powi(2) - 0.5])
    }

    fn constraint_jacobian(&self, x: &Array1<f64>) -> Result<Array2<f64>, EvaluationError> {
        Ok(array![[2.0 * x[0], 2.0 * x[1]]])
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let params = OQNLPParams {
        iterations: 10,
        population_size: 100,
        wait_cycle: 5,
        local_solver_config: SLSQPBuilder::default().accuracy(1e-8).build(),
        ..OQNLPParams::default()
    };
    let mut optimizer = OQNLP::new(MixedConstraints, params)?;
    println!("{}", optimizer.run()?);
    Ok(())
}
```

:::caution[Global search with equalities]

Scatter search projects samples onto linear equalities (`A x = b`) and screens candidate feasibility
for all constraint blocks. Nonlinear equalities generally define surfaces that random sampling
cannot reliably reach; a capable local solver does not remove this initialization limitation. Use
nonlinear equalities for local solves or runs with sufficient feasible starting candidates. A global
run may fail with `NoFeasibleCandidates` otherwise.

Augmented Lagrangian does not enforce box bounds during local optimization. Choose SLSQP when linear
equalities and strict bounds must both hold.

:::

See [Local Solver Builders](../local-solver-builders) for custom configurations and
[Checkpointing](../checkpointing) for resuming long runs. See the
[v0.7.0 API documentation](https://docs.rs/globalsearch/0.7.0/globalsearch/) for the API used here.

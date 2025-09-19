---
title: Running an Optimization Problem
description: Learn how to set up and run an optimization problem using globalsearch-rs
---
This guide will walk you through the steps to set up and run an optimization problem using the
`globalsearch-rs` crate in Rust. We will cover defining the objective function, setting variable bounds,
configuring the optimization parameters, and executing the optimization process.

## Setting Up the Environment

Make sure to include `globalsearch` and `ndarray` in your `Cargo.toml`:

```toml
[dependencies]
globalsearch = "0.2.0"
ndarray = "0.15.6"
```

## Defining your Problem

First, we need to define our optimization problem. We will need to import the `Problem` trait from `globalsearch::problem::Problem` and implement it for our specific problem.
We will also need to use `ndarray` for handling arrays.

You can read more about the `Problem` trait in the [docs.rs](https://docs.rs/globalsearch/latest/globalsearch/problem/trait.Problem.html).

Since we are going to use the `cobyla` local solver, we only need to implement the `objective` and `variable_bounds` methods of the `Problem` trait. `cobyla` also supports constraints, so if your problem has constraints, you will need to implement the `constraints` method as well.

Other local solvers from the `argmin` crate may require you to implement additional methods. You can read more about the requirements of each local solver in the [Local Solvers](../../local-solvers) documentation.

```rust
use globalsearch::problem::Problem;
use ndarray::{Array1, Array2};

struct MinimizeProblem {
    // Define your problem-specific fields here
    // if needed
}

impl Problem for MinimizeProblem {
    fn objective(&self, x: &Array1<f64>) -> f64 {
        // Implement your objective function here
    }

    fn variable_bounds(&self) -> Array2<f64> {
        // Implement your variable bounds here
        // Return a 2D array where each row represents [lower_bound, upper_bound]
    }
}
```

In the example above, we define a struct `MinimizeProblem` that implements the `Problem` trait. The `objective` method computes the value of the objective function at a given point `x`, and the `variable_bounds` method returns the bounds for each variable.

## Configuring the Optimization Parameters

After setting up the problem, we need to configure the optimization parameters. This includes setting the population size, number of iterations, and other algorithm-specific parameters. We can do this using the `OQNLPParams` struct.

We recommend reading the [Overview documentation](../../getting-started/overview) to understand how the algorithm works and the [OQNLPParams API documentation](https://docs.rs/globalsearch/latest/globalsearch/types/struct.OQNLPParams.html).

```rust
use globalsearch::types::OQNLPParams;

let params: OQNLPParams = OQNLPParams {
    iterations: 250,
    wait_cycle: 20,
    threshold_factor: 0.2,
    distance_factor: 1,
    population_size: 500,
    local_solver_type: LocalSolverType::COBYLA,
    seed: 0,
    ..Default::default()
};
```

You can also try the default parameters by using `OQNLPParams::default()`.
Make sure to adjust the parameters according to your specific optimization problem and requirements.

## Running the Optimization

Now that we have defined our problem and configured the parameters, we can create an instance of `OQNLP` and run the optimization process.

```rust
use globalsearch::OQNLP;

let mut optimizer = OQNLP::new(problem, params)?;
let result = optimizer.run()?;
```

In the code above, we create a new instance of `OQNLP` with our problem and parameters, and then call the `run` method to start the optimization process. The result will contain the best solution found during the optimization. You can then analyze or use this solutions as needed.

Your complete code should look like this:

```rust
use globalsearch::{OQNLP, problem::Problem, types::{OQNLPParams, LocalSolverType}};
use ndarray::{Array1, Array2};

struct MinimizeProblem {
    // Define your problem-specific fields here
    // if needed
}

impl Problem for MinimizeProblem {
    fn objective(&self, x: &Array1<f64>) -> f64 {
        // Implement your objective function here
    }

    fn variable_bounds(&self) -> Array2<f64> {
        // Implement your variable bounds here
        // Return a 2D array where each row represents [lower_bound, upper_bound]
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
     let problem = MinimizeProblem;
     let params: OQNLPParams = OQNLPParams {
             iterations: 125,
             wait_cycle: 10,
             threshold_factor: 0.2,
             distance_factor: 0.75,
             population_size: 250,
             local_solver_type: LocalSolverType::SteepestDescent,
             local_solver_config: SteepestDescentBuilder::default().build(),
             seed: 0,
         };

     let mut optimizer: OQNLP<MinimizeProblem> = OQNLP::new(problem, params)?;

     // OQNLP returns a solution set with the best solutions found
     let solution_set: SolutionSet = optimizer.run()?;
     println!("{}", solution_set)

     Ok(())
}
```

For more advanced usage, such as checkpointing, parallelism, or custom local solver configurations, refer to the respective documentation sections. Also, use the [API documentation](https://docs.rs/globalsearch/) for detailed information on available methods and types.

---
title: Comparison with MATLAB
description: A comparison of globalsearch-rs with MATLAB's GlobalSearch algorithm
---

MATLAB provides a function called
[`GlobalSearch`](https://www.mathworks.com/help/gads/globalsearch.html). This function is part of
the Global Optimization Toolbox and is used to solve global optimization problems [^1]. The
`GlobalSearch` algorithm is similar to the algorithm used in `globalsearch-rs`. However, there are
some key differences between the two algorithms.

## Local solvers

MATLAB uses the `fmincon` function to solve the local optimization problems. The `fmincon` function
is a constrained nonlinear programming solver that finds the minimum of a multivariable function.
This function supports using five different algorithms to solve the optimization problem [^2]:

- `interior-point` (default)
- `trust-region-reflective`
- `sqp`
- `sqp-legacy`
- `active-set`

`globalsearch-rs` uses the [Basin](https://github.com/jolars/basin) crate for every local solver:

- **Nonlinear constrained**: COBYLA (derivative-free) and SLSQP (gradient-based) support box bounds,
  linear constraints, and nonlinear inequalities and equalities.
- **Linear constrained**: Barrier handles linear inequalities and box bounds; Augmented Lagrangian
  handles linear equalities without enforcing box bounds locally.
- **Box constrained**: L-BFGS-B, bounded Nelder-Mead, and BOBYQA.
- **Unconstrained**: L-BFGS, Gradient Descent, Trust Region, and Nelder-Mead.

Unconstrained solvers can return points outside variable bounds. Use `exclude_out_of_bounds` to
filter those solutions. The same applies to Augmented Lagrangian; choose SLSQP when linear
equalities and strict box bounds are both needed.

See [Local Solvers](../../local-solvers) for derivative requirements and configuration, and the
[constraint guide](../../rust/running-an-optimization-problem/#constraints) for sign conventions and
global-search limitations for nonlinear equalities.

## Evaluation of the reference set

In MATLAB's `GlobalSearch`, the reference set contains `NumTrialPoints` points. However, the number
of evaluations of the objective function is limited to `NumStageOnePoints`.

In `globalsearch-rs`, the reference set contains `population_size` points, and we evaluate the
objective function for all points in the reference set.

## Variable bounds

In MATLAB's `GlobalSearch`, the variable bounds are specified using the `lb` and `ub` parameters.
However, unbounded components have artificial bounds imposed, where `lb = -1e4 + 1` and
`ub = 1e4 + 1` [^3].

In `globalsearch-rs`, the variable bounds are specified using the `variable_bounds` argument. The
bounds are specified as an `Array2` of `f64`, where each row contains the lower and upper bounds of
each variable. Not specifying bounds for a variable is not supported, so the user must specify
bounds for all the variables. This is to ensure that the user is aware of the bounds of the
variables and selects them appropriately.

## Additional features

`globalsearch-rs` provides additional features, including checkpointing and parallel execution. For
more information, see the [feature flags documentation](../../rust/feature-flags).

Checkpointing is not available in the Python bindings.

## References

[^1]:
    GlobalSearch. The MathWorks, Inc. Available at:
    <https://www.mathworks.com/help/gads/globalsearch.html> (Accessed: 27 January 2025)

[^2]:
    Choosing the Algorithm, fmincon Algorithms. The MathWorks, Inc. Available at:
    <https://www.mathworks.com/help/optim/ug/choosing-the-algorithm.html> (Accessed: 18 March 2025)

[^3]:
    How GlobalSearch and MultiStart Work. The MathWorks, Inc. Available at:
    <https://www.mathworks.com/help/gads/how-globalsearch-and-multistart-work.html> (Accessed: 15
    February 2025)

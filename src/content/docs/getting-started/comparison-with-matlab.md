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

However, `globalsearch-rs` uses the [`cobyla`](https://github.com/relf/cobyla) and the [`argmin`](https://github.com/argmin-rs/argmin) crate to solve
the local optimization problems.

COBYLA is the only algorithm that supports constraints and bounds, while the other algorithms are
unconstrained.

However, we also provide support for the **unconstrained** nonlinear programming solvers from the `argmin` crate to solve the local optimization problems. We currently support the following local solvers:

- `COBYLA` (default)
- `LBFGS`
- `NelderMead`
- `SteepestDescent`
- `TrustRegion`
- `NewtonCG`

Support for more constrained solvers is planned when the `argmin` crate supports it. See
[argmin's issue #137](https://github.com/argmin-rs/argmin/issues/137) for more information.

Since unconstrained solvers can return solutions outside of variables bounds, we provide a function
`exclude_out_of_bounds` to filter solutions out of bounds.

## Evaluation of the reference set

In MATLAB's `GlobalSearch`, the reference set contains `NumTrialPoints` points. However, the number
of evaluations of the objective function is limited to `NumStageOnePoints`.

In `globalsearch-rs`, the reference set contains `population_size` points, and we evaluate the
objective function for all points in the reference set.

## Variable bounds

In MATLAB's `GlobalSearch`, the variable bounds are specified using the `lb` and `ub` parameters.
However, unbounded components have artificial bounds imposed, where `lb = -1e4 + 1` and
`ub = 1e4 + 1` [^3].

In `globalsearch-rs`, the variable bounds are specified using the `variable_bounds` argument. The bounds are
specified as an `Array2` of `f64`, where each row contains the lower and upper bounds of each
variable. Not specifying bounds for a variable is not supported, so the user must specify bounds for
all the variables. This is to ensure that the user is aware of the bounds of the variables and
selects them appropriately.

## Additional features

`globalsearch-rs` provides additional features, including checkpointing and parallel execution.
For more information, see the [feature flags documentation](../../rust/feature-flags).

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

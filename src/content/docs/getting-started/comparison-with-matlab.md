---
title: Comparison with MATLAB
description: A comparison of globalsearch-rs with MATLAB's GlobalSearch algorithm
---

MATLAB provides a function called
[`GlobalSearch`](https://www.mathworks.com/help/gads/globalsearch.html). This function is part of
the Global Optimization Toolbox and is used to solve global optimization problems [1]. The
`GlobalSearch` algorithm is similar to the algorithm used in `globalsearch-rs`. However, there are
some key differences between the two algorithms.

## Local solvers

MATLAB uses the `fmincon` function to solve the local optimization problems. The `fmincon` function
is a constained nonlinear programming solver that finds the minimum of a multivariable function.
This function supports using five different algorithms to solve the optimization problem [2]:

- `interior-point` (default)
- `trust-region-reflective`
- `sqp`
- `sqp-legacy`
- `active-set`

However, `globalsearch-rs` uses the [`argmin`](https://github.com/argmin-rs/argmin) crate to solve
the local optimization problems. We use the provided **unconstained** nonlinear programming solvers
to solve the local optimization problems. We currently support the following local solvers:

- `LBFGS` (default)
- `NelderMead`
- `SteepstDescent`
- `TrustRegion`
- `NewtonCG`

Support for using constrained solvers is planned when the `argmin` crate supports it. See
[argmin's issue #137](https://github.com/argmin-rs/argmin/issues/137) for more information.

## Evaluation of the reference set

In MATLAB's `GlobalSearch`, the reference set contains `NumTrialPoints` points. However, the number
of evaluations of the objective function is limited to `NumStageOnePoints`.

In `globalsearch-rs`, the reference set contains `population_size` points, and we evaluate the
objective function for all points in the reference set.

## Variable bounds

In MATLAB's `GlobalSearch`, the variable bounds are specified using the `lb` and `ub` parameters.
However, unbounded components have artificial bounds imposed, where `lb = -1e4 + 1` and
`ub = 1e4 + 1` [3].

In `globalsearch-rs`, the variable bounds are specified using the `bounds` argument. The bounds are
specified as vector of tuples, where each tuple contains the lower and upper bounds of each
variable. Not specifying bounds for a variable is not supported, so the user must specify bounds for
all the variables. This is to ensure that the user is aware of the bounds of the variables and
selects them appropriately.

## References

[1] GlobalSearch. The MathWorks, Inc. Available at:
<https://www.mathworks.com/help/gads/globalsearch.html> (Accessed: 27 January 2025)

[2] Choosing the Algorithm, fmincon Algorithms. The MathWorks, Inc. Available at:
<https://www.mathworks.com/help/optim/ug/choosing-the-algorithm.html> (Accessed: 18 March 2025)

[3] How GlobalSearch and MultiStart Work. The MathWorks, Inc. Available at:
<https://www.mathworks.com/help/gads/how-globalsearch-and-multistart-work.html> (Accessed: 15
February 2025)

---
title: Comparison with Rust
description: A comparison between PyGlobalSearch and globalsearch-rs
---

`PyGlobalSearch` is a Python package that provides an interface to the `globalsearch-rs` library
using [`PyO3`](https://pyo3.rs/) and [`maturin`](https://maturin.rs/). It allows users to leverage
the power of Rust's optimization algorithms within Python, making it easier to integrate into
existing Python workflows.

## Key Differences

While both `PyGlobalSearch` and `globalsearch-rs` aim to provide powerful optimization tools, there
are some key differences between the two:

1. **Language Integration**: `PyGlobalSearch` is designed specifically for Python users, providing a
   more seamless integration with Python's data structures and libraries. In contrast,
   `globalsearch-rs` is a Rust library that may require additional effort to write your optimization
   problems.

2. **Performance**: Since `globalsearch-rs` is implemented in Rust, it may offer better performance
   for certain optimization tasks compared to the Python wrapper. However, the actual performance
   will depend on the specific use case.

3. **Ease of Use**: `PyGlobalSearch` aims to provide a user-friendly interface for Python users,
   making it easier to set up and use optimization algorithms without needing to understand the
   underlying Rust implementation.

4. **Community and Ecosystem**: `PyGlobalSearch` benefits from the larger Python ecosystem, allowing
   users to leverage existing Python libraries and tools, like `NumPy` for array manipulation and
   `JAX` for automatic differentiation.

5. **Limitations in terms of features**: `PyGlobalSearch` does not expose all the features of
   `globalsearch-rs`, potentially limiting advanced users who require specific functionality. As of
   now, the focus is on providing a core set of tools that are most relevant for Python users. We
   currently don't support parallelism of stage 1 using rayon nor checkpointing (no feature flags). Also,
   for the COBYLA local solver, we only support a maximum of 1000 constraints.

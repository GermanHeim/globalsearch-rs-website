---
title: Installation
description: Learn about installing GlobalSearch-rs
---

:::note[Documentation version]

These guides describe the `v0.7.0` API. Use the dependency below to follow the solver and
constraint examples.

:::

## Using as a dependency

Minimum supported Rust version is 1.87. Add the dependency and the matching `ndarray` version to
your `Cargo.toml`:

```toml
[dependencies]
globalsearch = "0.7.0"
ndarray = "0.17"
```

All eleven local solvers are available without feature flags. See [Feature flags](../feature-flags)
for optional parallelism, progress bars, and checkpointing.

Alternatively, you can add the dependency directly from the command line: `cargo add globalsearch@0.7.0`

## Building from source

You can also build `globalsearch` from source, following these steps:

1. If you haven't already, install Rust toolchain using [rustup](https://rustup.rs/).
2. Clone the repository and navigate to the project directory:

   ```bash
   git clone --branch v0.7.0 https://github.com/GermanHeim/globalsearch-rs.git
   cd globalsearch-rs
   ```

3. Build the project:

   ```bash
   cargo build --release
   ```

By doing this you have successfully built `globalsearch`.

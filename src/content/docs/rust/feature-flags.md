---
title: Feature flags
description: Feature flags allow you to enable different features of the crate.
---

Feature flags allow you to enable different features of the crate. They are defined in the
`Cargo.toml` file of the crate you are using. The feature flags are defined using the features
keyword of the `Cargo.toml` file.

## Available feature flags

The following feature flags are available for the `globalsearch-rs` crate:

- `rayon`: Enables parallel execution of the scatter search phase using Rayon. In debug builds or
  low workload scenarios, the overhead of thread management might reduce performance. For production
  builds, consider benchmarking with and without `rayon`. This feature is disabled by default.
- `progress_bar`: Adds a progress bar using the `kdam` crate to visualize algorithm progress.
  Recommended for large-scale problems. It is recommended that you disable the verbose output of
  _OQNLP_ since it uses the `println!` macro, which interferes with the display of the progress bar.
  This feature is disabled by default.

## Example

```toml
[dependencies]
globalsearch = { version = "0.2.0", features = ["rayon"] }
```

In the example above, the rayon feature flag is enabled for the `globalsearch-rs` crate. This will
enable the rayon feature of the crate.

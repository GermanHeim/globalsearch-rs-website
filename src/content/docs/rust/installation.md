---
title: Installation
description: Learn about installing GlobalSearch-rs
---

## Using as a dependency

Add this to your `Cargo.toml`:

```toml
[dependencies]
globalsearch = "0.2.0"
```

Alternatively, you can add the dependency directly from the command line: `cargo add globalsearch`

You can also get the latest version from the main branch of GitHub by adding the following line to
your `Cargo.toml`:

```toml
[dependencies]
globalsearch = { git = "https://github.com/GermanHeim/globalsearch-rs" }
```

## Building from source

You can also build `globalsearch` from source, following these steps:

1. If you haven't already, install Rust toolchain using [rustup](https://rustup.rs/).
2. Clone the repository and navigate to the project directory:

   ```bash
   git clone https://github.com/GermanHeim/globalsearch-rs.git
   cd globalsearch-rs
   ```

3. Build the project:

   ```bash
   cargo build --release
   ```

By doing this you have successfully built `globalsearch`.

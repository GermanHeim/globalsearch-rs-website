---
title: Checkpointing
description: Checkpointing allows you to save the state of the algorithm and resume later.
---

This document explains how to use the checkpointing functionality in `globalsearch-rs`, which allows
you to save and resume long-running optimization problems. Checkpointing saves the state of the
optimization algorithm at regular intervals in the stage 2, allowing you to resume from the last
saved state in case of interruptions.

The checkpointing feature is entirely optional and doesn't change the core optimization behavior.

## Overview

Checkpointing is particularly useful for:

- **Long-running optimizations** that might be interrupted
- **Experimentation** where you want to save intermediate results
- **Recovery** from unexpected system failures

## Enabling Checkpointing

To use checkpointing, you need to enable the `checkpointing` feature:

```toml
[dependencies]
globalsearch = { version = "x.y.z", features = ["checkpointing"] }
```

## Basic Usage

To use checkpointing, you need to configure it in your OQNLP instance.

### 1. Configure Checkpointing

```rust
use globalsearch::types::CheckpointConfig;
use std::path::PathBuf;

let checkpoint_config = CheckpointConfig {
    checkpoint_dir: PathBuf::from("./checkpoints"),     // Where to save files
    checkpoint_name: "opt_checkpoint".to_string(),      // Base filename
    save_frequency: 10,                                 // Save every 10 iterations
    keep_all: false,                                    // Only keep latest checkpoint
    auto_resume: true,                                  // Auto-resume if checkpoint exists
};
```

### 2. Create OQNLP with Checkpointing

```rust
use globalsearch::{oqnlp::OQNLP, types::OQNLPParams};

let mut oqnlp = OQNLP::new(problem, params)?
    .with_checkpointing(checkpoint_config)?
    .verbose();  // Optional: enable verbose output
```

### 3. Run with Automatic Checkpointing

```rust
// This will automatically save and resume from checkpoints
let solution_set = oqnlp.run()?;
```

## Configuration Options

### CheckpointConfig Fields

| Field             | Type      | Description                                 | Default              |
| ----------------- | --------- | ------------------------------------------- | -------------------- |
| `checkpoint_dir`  | `PathBuf` | Directory to save checkpoint files          | `"./checkpoints"`    |
| `checkpoint_name` | `String`  | Base name for checkpoint files              | `"oqnlp_checkpoint"` |
| `save_frequency`  | `usize`   | Save checkpoint every N iterations          | `10`                 |
| `keep_all`        | `bool`    | Keep all checkpoints vs. only latest        | `false`              |
| `auto_resume`     | `bool`    | Automatically resume from latest checkpoint | `true`               |

## What Gets Saved

Each checkpoint contains:

- Algorithm parameters (`OQNLPParams`)
- Current iteration number
- Merit filter threshold
- Current solution set
- Reference set from scatter search
- Unchanged cycles counter
- Elapsed time
- Distance filter solutions
- Random seed offset
- Timestamp

## Advanced Usage

### Manual Checkpoint Control

```rust
// Check if checkpoint exists
let resumed = oqnlp.try_resume_from_checkpoint()?;
if resumed {
    println!("Resumed from checkpoint!");
} else {
    println!("Starting fresh optimization.");
}
```

### Custom Checkpoint Management

```rust
use globalsearch::checkpoint::CheckpointManager;

let manager = CheckpointManager::new(config)?;

// Check if checkpoint exists
if manager.checkpoint_exists() {
    println!("Checkpoint found!");
}

// Load specific checkpoint
let checkpoint = manager.load_checkpoint_from_path(&path)?;

// Cleanup old checkpoints (keep only latest 5)
manager.cleanup_old_checkpoints(5)?;
```

## Performance Considerations

### Checkpoint Size

- Checkpoint files are binary (using bincode)
- Size depends on problem dimension and solution set size
- Typical sizes: 1-100 KB for most problems

### Storage Management

- Use `keep_all: false` for long-running optimizations
- Use the available `cleanup_old_checkpoints()` function to manage disk usage
- Consider using scratch/temporary directories

## Error Handling

```rust
use globalsearch::checkpoint::CheckpointError;

match oqnlp.run() {
    Ok(solution) => println!("Optimization completed: {}", solution),
    Err(e) => match e {
        OQNLPError::CheckpointError(CheckpointError::IoError(_)) => {
            eprintln!("Checkpoint I/O error - check disk space and permissions");
        }
        OQNLPError::CheckpointError(CheckpointError::SerializationError(_)) => {
            eprintln!("Checkpoint corruption - may need to start fresh");
        }
        _ => eprintln!("Other error: {}", e),
    }
}
```

## Troubleshooting

### Common Issues

1. **Permission Errors**

   - Ensure write permissions to checkpoint directory
   - Check disk space availability

2. **Checkpoint Corruption**

   - Remove corrupted checkpoint files
   - Start optimization fresh

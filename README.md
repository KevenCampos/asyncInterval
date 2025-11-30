# asyncInterval

This document explains how to use the exported `asyncInterval` helper provided in this project. `asyncInterval` runs an asynchronous function repeatedly with a fixed delay between executions and provides optional timeout handling, error handling, and a stop mechanism.

Contents
- Basic examples
- Examples with timeout and error handling
- Stopping the interval

Parameters
- `delay` (number, required): delay in milliseconds between the end of one cycle and the scheduling of the next execution.
- `functionToExec` (async function, required): the async function that will be executed each cycle.
- `timeout` (number, optional): if provided, each execution is raced against a timeout (in ms). If the function doesn't resolve before the timeout, the timeout handler is invoked.
- `onExcededTimeout` (function, optional): called when a single execution exceeds the provided `timeout`.
- `onError` (function, optional): called when `functionToExec` throws/rejects (or an unexpected error happens). Errors do not stop the loop — the loop continues to the next scheduled cycle.

Return value
- An object with a single method `stop()`: calling `stop()` prevents further executions and clears any pending timer.

Behavior details
- Each cycle calls `functionToExec`. If `timeout` is provided, the implementation races the function against an internal timeout Promise. If the timeout fires first, `onExcededTimeout` is called. If the function rejects or throws, `onError` is called.
- The loop continues indefinitely until `stop()` is called. Errors do not stop the loop.

Examples

1) Basic usage (no timeout)
- A simple example that logs a message every second. Errors are logged via the `onError` handler but do not stop the loop.

```ts
import { asyncInterval } from "asyncInterval";

const runner = asyncInterval({ delay: 1000,
  functionToExec: async () => {
    console.log("executing task");
  },
  onError: (err) => {
    console.error("task error:", err)
  },
});

// Stop after 5 seconds
setTimeout(() => runner.stop(), 5000);
```

2) Using a timeout for each execution
- If the task takes longer than the specified timeout, the `onExcededTimeout` handler is called. But the loop continues to the next scheduled execution.

```ts
import { asyncInterval } from "asyncInterval";

asyncInterval({ delay: 1000, timeout: 1000,

  functionToExec: async () => {
    // Simulate a slow operation
    await new Promise((r) => setTimeout(r, 1500));
  },

  onExcededTimeout: () => {
    console.warn("execution exceeded timeout");
  },

  onError: (err) => {
    console.error("error during execution:", err);
  },
}),
```

3) Errors do not stop the loop
- If the task throws an error, the `onError` handler is called, but the loop continues executing.

```ts
asyncInterval({ delay: 1000,
  functionToExec: async () => {
    throw new Error("boom");
  },

  onError: (err) => {
    console.log("caught error, loop continues:", err.message)
  },
});
```

Stopping the loop
- Call the returned `stop()` method to prevent further executions and clear any pending timers.

```ts
const loop = asyncInterval({ delay: 1000, 
    functionToExec: async () => {
        /* ... */
    } 
});

loop.stop();
```
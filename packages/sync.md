# sync

Use `sync` for named locks, scoped locking, one-time execution, and wait groups across threads.

```osl
import "std:sync"
```

## API reference

### `sync`

| Method | Returns | Notes |
| --- | --- | --- |
| `sync.lock(name: string)` | `void` | Acquires the initialized named lock, waiting if it is held. |
| `sync.tryLock(name: string)` | `boolean` | Attempts to acquire the named lock without blocking. Returns `true` if acquired, `false` if held. |
| `sync.unlock(name: string)` | `void` | Releases a named lock; missing names are ignored. |
| `sync.withLock(name: string, fn: any)` | `any` | Acquires `name`, executes `fn()`, and guarantees lock release on exit. Returns `fn()`'s result. |
| `sync.once(name: string, fn: any)` | `any` | Runs `fn()` at most once across all threads for the given `name`. |
| `sync.waitGroup()` | `*WaitGroup` | Creates a new WaitGroup for coordinating multiple asynchronous tasks. |

### `*WaitGroup`

| Method | Returns | Notes |
| --- | --- | --- |
| `waitGroup.add(delta?: number)` | `void` | Adds `delta` (default 1) to the wait group counter. |
| `waitGroup.done()` | `void` | Decrements the wait group counter by 1. |
| `waitGroup.wait()` | `void` | Blocks until the wait group counter reaches 0. |

## Notes

- Prefer `import "std:sync"`; the older `import "osl/sync"` spelling remains supported.
- Importing `thread` activates concurrent compilation; server-style packages share the pin-trigger path.

# sync

Use `sync` for named locks, scoped locking, one-time execution, and wait groups across threads.

```osl
import "std:sync"
```

## API reference

### `sync`

| Method | Returns | Notes |
| --- | --- | --- |
| `sync.lock(name: string)` | `void` | Acquires the named lock exclusively, waiting while any writer or reader holds it. |
| `sync.tryLock(name: string)` | `boolean` | Attempts to acquire the named lock exclusively without blocking. Returns `true` if acquired, `false` if a writer or reader holds it. |
| `sync.unlock(name: string)` | `void` | Releases an exclusive hold on a named lock; names that are not write-locked are ignored. |
| `sync.withLock(name: string, fn: any)` | `any` | Acquires `name`, executes `fn()`, and guarantees lock release on exit. Returns `fn()`'s result. |
| `sync.rlock(name: string)` | `void` | Acquires the named lock for reading. Any number of readers share it; a reader waits only while a writer holds or is waiting for `name`. |
| `sync.runlock(name: string)` | `void` | Releases one read hold on `name`; a name that is not read-locked is ignored. |
| `sync.withRLock(name: string, fn: any)` | `any` | Read-locks `name`, executes `fn()`, and guarantees release on exit. Returns `fn()`'s result. |
| `sync.once(name: string, fn: any)` | `any` | Runs `fn()` at most once across all threads for the given `name`. |
| `sync.waitGroup()` | `*sync.WaitGroup` | Creates a new WaitGroup for coordinating multiple asynchronous tasks. |

### `*sync.WaitGroup`

| Method | Returns | Notes |
| --- | --- | --- |
| `waitGroup.add(delta?: number)` | `void` | Adds `delta` (default 1) to the wait group counter. |
| `waitGroup.done()` | `void` | Decrements the wait group counter by 1. |
| `waitGroup.wait()` | `void` | Blocks until the wait group counter reaches 0. |

## Readers and writers

Use `sync.rlock` when many threads only read the state a name guards and a few change it.
Readers run together, and a writer takes the name with `sync.lock` once they have left.

```osl
import "std:sync"

object settings = {theme: "dark"}

def theme() string (
  sync.rlock("settings")
  defer sync.runlock("settings")
  return settings.theme
)

def setTheme(string value) (
  sync.lock("settings")
  defer sync.unlock("settings")
  settings.theme = value
)
```

A waiting writer goes ahead of readers that arrive after it, so writers are not starved.
For the same reason a thread must not read-lock a name it already holds for reading: if a
writer queues between the two calls, the second `sync.rlock` waits for that writer, which
waits for the first hold. Waiting threads are served in order, and a lock that nobody holds
or waits for uses no memory.

## Notes

- Prefer `import "std:sync"`; the older `import "osl/sync"` spelling remains supported.
- Importing `thread` activates concurrent compilation; server-style packages share the pin-trigger path.

# sync

Use `sync` for named locks, scoped locking, one-time execution, and wait groups across threads.

```osl
import "std:sync"
```

## Example

```osl
import "std:sync"
import "std:thread"

*sync.WaitGroup wg = sync.waitGroup()
int total = 0
for i 4 (
  wg.add()
  thread.new(def(int n) -> (
    defer wg.done()
    sync.withLock("total", def() -> ( total += n ))
  ), i)
)
wg.wait()
log total // 10
```

## API reference

### `sync`

Locks are named and owned: the thread that locks a name holds it until it unlocks it.

| Method | Returns | Notes |
| --- | --- | --- |
| `sync.lock(name: string)` | `void` | Takes the exclusive lock `name`, waiting while another thread holds it or a read lock on it. Release it with `sync.unlock(name)`, often with `defer`. |
| `sync.tryLock(name: string)` | `boolean` | Takes the exclusive lock if it is free and reports whether it did. It never waits, so it reports `false` for a lock this thread already holds. |
| `sync.unlock(name: string)` | `void` | Releases the exclusive lock `name`. |
| `sync.withLock(name: string, fn: function)` | `any` | Takes the exclusive lock, calls `fn`, releases the lock even if `fn` throws, and returns what `fn` returned. |
| `sync.rlock(name: string)` | `void` | Takes a shared read lock on `name`. Other threads' read locks can share it; `sync.lock(name)` waits for it. |
| `sync.runlock(name: string)` | `void` | Releases this thread's read lock on `name`. |
| `sync.withRLock(name: string, fn: function)` | `any` | Takes a read lock, calls `fn`, releases the lock even if `fn` throws, and returns what `fn` returned. |
| `sync.once(name: string, fn: function)` | `any` | Calls `fn` the first time it is called with `name` and returns its value. Every later call with `name` returns `null` without calling its `fn`. Callers wait until the first call has finished. If the first call throws, every call with `name` throws that error. |
| `sync.waitGroup()` | `*sync.WaitGroup` | A new wait group with a count of 0. |

### `*sync.WaitGroup`

| Method | Returns | Notes |
| --- | --- | --- |
| `wg.add(delta?: int)` | `void` | Raises the count by `delta` (default 1). A negative `delta` lowers it. |
| `wg.done()` | `void` | Lowers the count by 1, waking threads in `wait` when it reaches 0. |
| `wg.wait()` | `void` | Blocks until the count is 0. |
| `wg.count()` | `int` | The current count. |

Give thread worker parameters an explicit handle type, such as `def worker(*sync.WaitGroup wg)`.

## Errors

Misusing a lock is a bug in the calling code, so it throws. `sync` adds two kinds to the standard
list:

- `DeadlockError`: `lock`, `rlock`, `withLock`, or `withRLock` on a name this thread already
  holds, either way. It is thrown instead of waiting forever. A read lock can't be upgraded or
  taken twice; call `sync.runlock` first.
- `LockError`: `unlock` or `runlock` of a name that isn't locked, or that another thread holds.
  Only the thread that locked a name can unlock it.
- `TypeError`: `withLock`, `withRLock`, or `once` with something that isn't a function, or
  `wg.add` with a delta that isn't a whole number.
- `ValueError`: `wg.add` that would drop the count below 0.
- `StateError`: `wg.done()` when the count is already 0.

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
Waiting threads are served in order, and a lock that nobody holds or waits for uses no memory.

## Notes

- Prefer `import "std:sync"`; the older `import "osl/sync"` spelling remains supported.
- Importing `thread` activates concurrent compilation; server-style packages share the pin-trigger path.

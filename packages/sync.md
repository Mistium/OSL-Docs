# sync

Use `sync` for lock values, scoped locking, one-time execution, and wait groups across threads.

```osl
import "std:sync"
```

## Lock values

Create a lock once, next to the data it protects:

```osl
*sync.Lock access = sync.newLock()

def mode() string (
  access.rlock()
  defer access.runlock()
  return accessData.mode
)

def setMode(string value) boolean (
  access.lock()
  defer access.unlock()
  ...
)
```

A lock is unnamed by default. Use `sync.newNamedLock("access")` when you want its name in error messages; the name is only a label, so two locks with the same name are still independent.

| Method | Returns | Notes |
| --- | --- | --- |
| `sync.newLock()` | `*sync.Lock` | Creates an unnamed lock value. |
| `sync.newNamedLock(name: string)` | `*sync.Lock` | Creates a lock value whose name labels errors. |
| `lock.lock()` | `void` | Takes the lock exclusively, waiting while another thread holds it. Throws `DeadlockError` when this thread already holds it. |
| `lock.unlock()` | `void` | Releases this thread's exclusive hold. Throws `LockError` when it isn't held by this thread. |
| `lock.rlock()` | `void` | Takes a shared read lock. Throws `DeadlockError` when this thread already holds the lock. |
| `lock.runlock()` | `void` | Releases this thread's read hold. |
| `lock.tryLock()` | `boolean` | Takes the lock if it is free, without waiting. |
| `lock.with(fn: any)` | `any` | Takes the lock, calls `fn()`, and releases it even when `fn` throws. |
| `lock.withRLock(fn: any)` | `any` | Read-locks, calls `fn()`, and releases it even when `fn` throws. |

## Named locks

The older string API still works and shares one process-wide lock per name. Prefer lock values for new code.

| Method | Returns | Notes |
| --- | --- | --- |
| `sync.lock(name: string)` | `void` | Acquires the named lock exclusively. |
| `sync.tryLock(name: string)` | `boolean` | Attempts to acquire the named lock without blocking. |
| `sync.unlock(name: string)` | `void` | Releases an exclusive hold; throws `LockError` when it isn't held by this thread. |
| `sync.withLock(name: string, fn: any)` | `any` | Acquires `name`, calls `fn()`, and releases the lock on exit. |
| `sync.rlock(name: string)` | `void` | Acquires the named lock for reading. |
| `sync.runlock(name: string)` | `void` | Releases one read hold; throws `LockError` when the thread holds none. |
| `sync.withRLock(name: string, fn: any)` | `any` | Read-locks `name`, calls `fn()`, and releases it on exit. |

## Once and wait groups

| Method | Returns | Notes |
| --- | --- | --- |
| `sync.once(name: string, fn: any)` | `any` | Runs `fn()` at most once across all threads for `name`. |
| `sync.waitGroup()` | `*sync.WaitGroup` | Creates a wait group. |

### `*sync.WaitGroup`

| Method | Returns | Notes |
| --- | --- | --- |
| `waitGroup.add(delta?: number)` | `void` | Adds `delta` (default 1) to the counter. |
| `waitGroup.done()` | `void` | Decrements the counter by 1. |
| `waitGroup.wait()` | `void` | Blocks until the counter reaches 0. |

## Readers and writers

Use a read lock when many threads only read the guarded state and a few change it. Readers run together; a writer waits until they leave.

```osl
import "std:sync"

*sync.Lock settingsLock = sync.newLock()
object settings = {theme: "dark"}

def theme() string (
  settingsLock.rlock()
  defer settingsLock.runlock()
  return settings.theme
)

def setTheme(string value) (
  settingsLock.lock()
  defer settingsLock.unlock()
  settings.theme = value
)
```

A waiting writer goes ahead of readers that arrive after it, so writers are not starved. A thread must not take a read lock it already holds, and a read lock cannot be upgraded to a write lock.

## Notes

- Prefer `import "std:sync"`; the older `import "osl/sync"` spelling remains supported.
- Importing `thread` activates concurrent compilation; server-style packages share the pin-trigger path.

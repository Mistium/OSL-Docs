# thread

> Background threads

Use `thread` to run functions in the background, coordinate parallel work, and pass messages.

```javascript
import "osl/thread"
```

## Example

```javascript
import "osl/thread"

auto t = thread.new(def() -> ( return 42 ))
log t.wait()
```

## API reference

### `thread`

| Method | Returns | Description |
| --- | --- | --- |
| `thread.new(fn: any, ...args: any)` | `*Thread` | Creates and starts a new thread. |
| `thread.wait()` | `any` | Waits for the result. If the task failed, rethrows its error with the original task and spawn locations. |
| `thread.timeout(ms: number)` | `any` | Waits up to `ms` milliseconds for the result; returns the result if the task finished in time, otherwise `null`. If a completed task failed, rethrows its error. A timeout stops waiting; it does not cancel the task. |
| `thread.isDone()` | `boolean` | Reports whether the thread is done. |
| `thread.age()` | `number` | Returns the age of the thread in milliseconds. |
| `thread.waitAll(threads: array)` | `array` | Waits for every thread and preserves `null` positions for non-thread entries. If tasks fail, waits for the rest before rethrowing the first error with additional failures attached. |
| `thread.race(threads: array)` | `any` | Waits for the first thread in the array to complete and returns its result. If the winning task failed, rethrows its error. |
| `thread.parallel(items: array, fn: any, limit?: number)` | `array` | Runs `fn(item, index)` across `items` in parallel with an optional worker concurrency `limit`, returning results in input index order. |
| `thread.channel(capacity?: number)` | `*Channel` | Creates a thread-safe message channel with optional buffer capacity. |

### `*Channel`

| Method | Returns | Description |
| --- | --- | --- |
| `channel.send(value: any)` | `boolean` | Sends a value into the channel. Returns `false` if closed, otherwise `true`. |
| `channel.recv()` | `any` | Receives a value from the channel, blocking until an item is available or the channel is closed. Returns `null` when closed and empty. |
| `channel.tryRecv()` | `any` | Non-blocking receive. Returns the next item or `null` if empty or closed. |
| `channel.close()` | `void` | Closes the channel. |
| `channel.isClosed()` | `boolean` | Reports whether the channel is closed. |
| `channel.len()` | `number` | Returns the number of buffered items currently in the channel. |

## Thread safety

OSL automatically makes concurrent programs memory-safe. The compiler identifies named
functions that can run as scoped threads, including their transitive calls, and guards
concurrent operations with shared read/write statement and collection locks. Dynamic
callbacks use a safe whole-program fallback. This means:

- Two threads touching the **same** object, array, `map()`, or `set()` will never crash
  the program or corrupt memory.
- Every OSL statement is atomic, including an index write, `.append`, `.set`, key read,
  or scalar read-modify-write such as `count += 1`.

```javascript
import "osl/thread"

object shared = {}
array threads = []
for t 8 (
    threads.append(thread.new(def(o, id) (
        for i 1000 ( o[id ++ "_" ++ i] = i )
        return 0
    ), shared, t))
)
void thread.waitAll(threads)
log shared.len   // 8000, deterministic
```

Automatic safety does **not** combine multiple statements into one transaction. For
example, another thread can change `count` between an `if count < limit` check and the
assignment inside its block. Guard multi-statement critical sections with
[`osl/sync`](sync.md).

**Performance:** programs that never start a thread skip capture analysis and pay nothing; the
locking is compiled out entirely. Named thread functions use a constant-time function-only
scope lookup without reading their captured globals during thread creation. Generic, typed,
read, and write array operations share the same lock path, and read-only statements can run
in parallel. Mutable statements use a shared statement
boundary so scalar and collection updates remain atomic. Method and package calls use
their own value/package synchronization and run outside that boundary, allowing HTTP,
WebSocket, and similar callbacks to update captured values without deadlocking their caller.

Automatic collection locking uses a single world lock, so growing or replacing an array's
backing storage needs no lock-identity propagation and cyclic values need no recursive
registration. Explicit locks from [`osl/sync`](sync.md) are still your responsibility:
always release them and use a consistent order when acquiring more than one.

## Notes

- Standard-library imports accept both `import "osl/thread"` and `import "thread"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
- `defer <statement>` runs a statement when the enclosing function returns (like Go's `defer`), which is handy for releasing an `osl/sync` lock taken inside a thread.
- Panicking tasks still complete their handle. `wait` and a completed `timeout` rethrow
  the failure; `waitAll` waits for every task before rethrowing.

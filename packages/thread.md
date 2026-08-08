# thread

> Background threads

Use `thread` to run functions in the background and wait for one or more results.

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
| `thread.new(fn: any, ...args: any)` | `*Thread` | Creates a new value. |
| `thread.wait()` | `any` | Waits for the result. If the task failed, rethrows its error with the original task and spawn locations. |
| `thread.timeout(ms: number)` | `any` | Waits up to `ms` milliseconds for the result; returns the result if the task finished in time, otherwise `null`. If a completed task failed, rethrows its error. A timeout stops waiting; it does not cancel the task. |
| `thread.isDone()` | `boolean` | Reports whether done. |
| `thread.age()` | `number` | Runs the age operation. |
| `thread.waitAll(threads: array)` | `array` | Waits for every thread and preserves `null` positions for non-thread entries. If tasks fail, waits for the rest before rethrowing the first error with the additional failures attached. |

## Thread safety

OSL automatically makes concurrent programs memory-safe. The compiler identifies values
captured by named thread functions, including through named functions they call, and arguments passed to `thread.new`, then guards
operations on those shared values with automatic read/write locking through one lock-selection path. Dynamic callbacks use a safe
whole-program fallback. This means:

Values passed through `auto`/interface wrappers retain the same shared lock identity.

- Two threads touching the **same** object, array, `map()`, or `set()` will never crash
  the program or corrupt memory — the "concurrent map writes" fatal error can't happen.
- Every OSL statement is atomic, including an index write, `.append`, `.set`, key read,
  or scalar read-modify-write such as `count += 1`.

```javascript
import "osl/thread"

object shared = {}
array threads = []
for t 8 (
    // each thread writes distinct keys into the SAME shared object — safe, no crash
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

**Performance:** programs that never start a thread skip capture analysis and pay nothing — the
locking is compiled out entirely. Named thread functions use deterministic standard-library key ordering, a constant-time function-only scope lookup, and lock only their
current captured values and arguments, including package values; both decisions reuse one call-graph scan and transitive walker, while generic, typed, read, and write array locks share one selection path. Shared arrays retain the same lock when they grow, and
read-only statements can run in parallel. Mutable statements use a shared statement
boundary so scalar and collection updates remain atomic.

Automatic locking holds at most one value lock at a time. Cyclic arrays and objects are
registered without nested lock acquisition, so the automatic safety layer cannot create a
lock-order deadlock. Explicit locks from [`osl/sync`](sync.md) are still your responsibility:
always release them and use a consistent order when acquiring more than one.

## Notes

- Standard-library imports accept both `import "osl/thread"` and `import "thread"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
- `defer <statement>` runs a statement when the enclosing function returns (like Go's `defer`) — handy for releasing an `osl/sync` lock you took inside a thread.
- Panicking tasks still complete their handle. `wait` and a completed `timeout` rethrow
  the failure; `waitAll` waits for every task before rethrowing.

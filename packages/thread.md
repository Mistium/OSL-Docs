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
| `thread.wait()` | `any` | Runs the wait operation. |
| `thread.timeout(ms: number)` | `any` | Waits up to `ms` milliseconds for the result; returns the result if the task finished in time, otherwise `null`. The task keeps running in the background — a timeout stops waiting, it does not cancel. |
| `thread.isDone()` | `boolean` | Reports whether done. |
| `thread.age()` | `number` | Runs the age operation. |
| `thread.waitAll(threads: array)` | `array` | Runs the wait all operation. |

## Thread safety

OSL automatically makes concurrent programs memory-safe. As soon as a program can run
more than one thread (it imports `osl/thread`, `osl/serve`, `osl/ws`, `osl/cron`,
`osl/ssh`, `osl/sound`, or uses `worker`), the compiler guards every shared value
operation with automatic locking. This means:

- Two threads touching the **same** object, array, `map()`, or `set()` will never crash
  the program or corrupt memory — the "concurrent map writes" fatal error can't happen.
- Every individual operation (an index write, a `.append`, a `.set`, a key read) is
  atomic.

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

What automatic safety does **not** do is make a multi-step sequence atomic. A
read-modify-write spread across threads (e.g. `count = count + 1` on a shared value)
can still lose updates, because each step is individually atomic but the pair is not.
Guard those critical sections yourself with [`osl/sync`](sync.md).

**Performance:** programs that never start a thread pay nothing — the locking is compiled
out entirely. Threaded programs lock per value, so threads working on different data don't
contend with each other, and reads run in parallel.

## Notes

- Standard-library imports accept both `import "osl/thread"` and `import "thread"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
- `defer <statement>` runs a statement when the enclosing function returns (like Go's `defer`) — handy for releasing an `osl/sync` lock you took inside a thread.
- Panicking tasks still complete their handle, so `wait`, `timeout`, and
  `waitAll` cannot wedge indefinitely.

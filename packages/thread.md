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

OSL automatically makes concurrent programs memory-safe. The compiler identifies values
captured by named thread functions, and arguments passed to `thread.new`, then guards
operations on those shared values with automatic locking. Dynamic callbacks use a safe
whole-program fallback. This means:

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
out entirely. Named thread functions use a constant-time scope lookup and lock only their
current captured values and arguments, so reassigned captures stay safe without slowing
unrelated work. Shared arrays retain the same lock when they grow, threads working on
different data do not contend except for rare lock-stripe collisions, and reads run in
parallel.

Automatic locking holds at most one value lock at a time. Cyclic arrays and objects are
registered without nested lock acquisition, so the automatic safety layer cannot create a
lock-order deadlock. Explicit locks from [`osl/sync`](sync.md) are still your responsibility:
always release them and use a consistent order when acquiring more than one.

## Notes

- Standard-library imports accept both `import "osl/thread"` and `import "thread"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
- `defer <statement>` runs a statement when the enclosing function returns (like Go's `defer`) — handy for releasing an `osl/sync` lock you took inside a thread.
- Panicking tasks still complete their handle, so `wait`, `timeout`, and
  `waitAll` cannot wedge indefinitely.

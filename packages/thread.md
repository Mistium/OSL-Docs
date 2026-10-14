# thread

Use `thread` to run functions in the background, coordinate parallel work, and pass messages.

```osl
import "std:thread"
```

## Example

```osl
import "std:thread"

*thread.Thread t = thread.new(def(int a, int b) -> ( return a + b ), 2, 3)
log t.wait() // 5

log thread.parallel([1, 2, 3], def(int x) -> ( return x * 10 ), 2) // [10,20,30]
```

Wait with a timeout. A thread still running after it makes `wait` throw `TimeoutError`; the thread
keeps running and can be waited on again:

```osl
import "std:thread"

auto slow = thread.new(def() -> (
  sleep(0.2)
  return "done"
))
log try(slow.wait({timeout: 10})) // TimeoutError: thread.Thread.wait: the thread was still running after 10 ms
log slow.wait()                   // done
```

Pass values between threads with a channel, and drain it with `values()`:

```osl
import "std:thread"

*thread.Channel ch = thread.channel(4)
thread.new(def() -> (
  for i 3 (
    ch.send(i)
  )
  ch.close()
))
for v in ch.values() (
  log v
)
```

## API reference

### `thread`

| Method | Returns | Notes |
| --- | --- | --- |
| `thread.new(fn: function, ...args)` | `*thread.Thread` | Starts `fn(...args)` on a new thread. |
| `thread.waitAll(threads: array)` | `array` | Waits for every thread and returns their values in the same order. If any thread threw, rethrows the first failure, listing the others, after all have finished. |
| `thread.race(threads: array)` | `any` | Waits for the first thread to finish and returns its value, or rethrows its error. The others keep running. |
| `thread.parallel(items: array, fn: function, limit?: int)` | `array` | Calls `fn(item, index)` for every item on separate threads, at most `limit` at a time, and returns the results in item order. `index` is 1-based. If any call throws, rethrows the first failure after every call has finished. |
| `thread.channel(capacity?: int)` | `*thread.Channel` | A channel that holds up to `capacity` values (default 0) before `send` waits for a receiver. |

### `*thread.Thread`

| Method | Returns | Notes |
| --- | --- | --- |
| `t.wait(options?: object)` | `any` | Blocks until the thread finishes and returns what its function returned. If the function threw, rethrows that error with the thread's stack. Option: `timeout` in milliseconds. |
| `t.isDone()` | `boolean` | Whether the thread has finished, successfully or not. |
| `t.age()` | `number` | Milliseconds since the thread started. |

`t.wait({timeout})` throws rather than returning a result, so `wait` keeps returning the thread's
plain value. Use `try(t.wait({timeout: ms}))` to get a `result` instead.

### `*thread.Channel`

| Method | Returns | Notes |
| --- | --- | --- |
| `ch.send(value: any)` | `result<unit, error>` | Delivers `value`, waiting for a receiver or a free buffer slot. Fails with `StateError` when the channel is closed, or is closed while `send` waits. In a condition it reads as "was it delivered". |
| `ch.recv()` | `any` | Waits for the next value, or returns `null` once the channel is closed and empty. Use `values()` when `null` itself is sent. |
| `ch.tryRecv()` | `any` | The next value if one is ready, or `null` without waiting. |
| `ch.values()` | `iter<any>` | Iterates over received values, waiting for each, and ends once the channel is closed and empty. |
| `ch.close()` | `void` | Stops new sends, makes waiting senders fail, and lets receivers drain buffered values. Closing twice does nothing. |
| `ch.isClosed()` | `boolean` | Whether `close` has been called. |
| `ch.len()` | `int` | How many values are buffered. |

A discarded `ch.send(value)` on a closed channel throws its `StateError`. Check it in a condition
when a closed channel is expected:

```osl
import "std:thread"

*thread.Channel ch = thread.channel(1)
ch.close()
if !ch.send("late") ( log "channel closed" )
```

## Errors

- `thread.new` throws `TypeError` when `fn` isn't a function or accepts fewer parameters than
  there are `args`.
- `thread.waitAll` and `thread.race` throw `TypeError` when an item isn't a thread; `race` throws
  `ValueError` for an empty array.
- `thread.parallel` throws `TypeError` when `fn` isn't a function and `ValueError` when `limit`
  isn't a whole number of 1 or more.
- `thread.channel` throws `ValueError` when `capacity` isn't a whole number of 0 or more.
- `t.wait` throws `TimeoutError` when the timeout passes and `ValueError` for a negative timeout.

## Changes from earlier versions

`t.timeout(ms)` is gone; use `t.wait({timeout: ms})`. It throws `TimeoutError` where `timeout`
returned `null`, so a thread that returned `null` can't be mistaken for one that timed out.

## Thread safety

OSL uses shared statement and collection locks for concurrent access. Captured locals
are protected in both the parent function and its callbacks, unless the closure is only
ever called by name in the function that defines it; such a closure cannot reach another
thread, so its captures stay private. Array reads protect the slice header as well as
its elements when another thread can grow the array.

Index writes, array mutations, and scalar read-modify-write expressions such as
`count += 1` use automatic synchronization. Function and method calls run outside
statement locks so callbacks can acquire locks themselves.

```osl
import "std:thread"

object shared = {}
array threads = []
for t 8 (
  threads.append(thread.new(def(object o, int id) -> (
    for i 1000 (
      o[id ++ "_" ++ i] = i
    )
    return 0
  ), shared, t))
)
void thread.waitAll(threads)
log shared.len   // 8000, deterministic
```

Automatic safety does **not** combine multiple statements into one transaction. For
example, another thread can change `count` between an `if count < limit` check and the
assignment inside its block. Guard multi-statement critical sections with
[`sync`](sync.md).

Programs that never start a thread skip capture analysis, and the compiler removes automatic
locking. Named functions passed to `thread.new` or `thread.parallel` use a constant-time scope
lookup without reading captured globals during thread creation. Other functions are not added to
that lookup. Dynamic callbacks use the safe fallback.

Generic, typed, read, and write array operations share the same lock path. Read-only statements
can run in parallel. Shared scalar reads in polling conditions and conversions use that read
boundary as well. The compiler leaves constant expressions outside the boundary. It can also omit collection locks for fresh local arrays of scalar values when their aliases do not escape. Parameters, globals, callback captures, and arrays passed to unknown functions retain locking. Raw Go in a function disables this local ownership optimization.
Statements that only touch thread-local state take no statement lock. That covers assigning
a literal or another local to a local variable, and storing a locally computed value under one
key of an object or array held in a local variable, where the collection lock alone makes the
store atomic. Assigning to a local from shared state takes the read boundary, so it runs in
parallel with other readers.
Mutable statements use a shared statement boundary so scalar and collection updates remain
atomic. Method and package calls use their own synchronization and run outside that boundary, so
HTTP and WebSocket callbacks can update captured values without deadlocking their caller.

Automatic collection locking uses a single world lock, so growing or replacing an array's
backing storage needs no lock-identity propagation and cyclic values need no recursive
registration. Explicit locks from [`sync`](sync.md) are still your responsibility:
always release them and use a consistent order when acquiring more than one.

`json.stringify`, `.toStr()` on objects and arrays, and `.clone()` copy one object or array
at a time under the collection lock and then work on that copy, so encoding or cloning a large
tree never stalls writers elsewhere in the program. The result reflects each container as it was
when it was reached, not one instant across the whole tree. Guard the call with a `sync` lock
when the tree must be captured as a single consistent state.

Collection iteration takes a shallow snapshot when the source may be shared, including
collections returned by functions. Array callbacks for `map`, `filter`, `some`, and
`every` traverse a snapshot. A callback can mutate its source without changing that
traversal or holding a collection lock across user code. Nested objects remain shared
references and use their normal field locks.

Sorting compares a snapshot and writes the sorted elements back under the collection
lock. Concurrent updates made during comparison can be replaced by that write. Use an
explicit `sync` lock around operations that must form one transaction.

Raw Go code and imported Go packages can retain references or launch goroutines outside
OSL's locks. Synchronize that boundary or pass a copy. Automatic OSL locking does not
make arbitrary foreign code safe.

## Notes

- Prefer `import "std:thread"`; the older `import "osl/thread"` spelling remains supported.
- `defer <statement>` runs a statement when the enclosing function returns (like Go's `defer`), which is handy for releasing a `sync` lock taken inside a thread.
- A thread that throws still finishes. `wait` rethrows the failure, and `waitAll` waits for every
  thread before rethrowing.

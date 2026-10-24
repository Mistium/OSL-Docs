# thread

Use `thread` to run functions in the background, coordinate parallel work, and pass messages.

```osl
import "std:thread"
```

## Example

```osl
import "std:thread"

auto t = thread.new(def() -> ( return 42 ))
log t.wait()
```

## API reference

### `thread`

| Method | Returns | Notes |
| --- | --- | --- |
| `thread.new(fn: any, ...args: any)` | `*thread.Thread` | Creates and starts a new thread. |
| `thread.wait()` | `any` | Waits for the result. If the task failed, rethrows its error with the original task and spawn locations. |
| `thread.timeout(ms: number)` | `any` | Waits up to `ms` milliseconds for the result; returns the result if the task finished in time, otherwise `null`. If a completed task failed, rethrows its error. A timeout stops waiting; it does not cancel the task. |
| `thread.isDone()` | `boolean` |  |
| `thread.age()` | `number` | Returns the age of the thread in milliseconds. |
| `thread.waitAll(threads: array)` | `array` | Waits for every thread and preserves `null` positions for non-thread entries. If tasks fail, waits for the rest before rethrowing the first error with additional failures attached. |
| `thread.race(threads: array)` | `any` | Waits for the first thread in the array to complete and returns its result. If the winning task failed, rethrows its error. |
| `thread.parallel(items: array, fn: any, limit?: number)` | `array` | Runs `fn(item, index)` across `items` in parallel with an optional worker concurrency `limit`, returning results in input index order. |
| `thread.channel(capacity?: number)` | `*thread.Channel` | Creates a thread-safe message channel with optional buffer capacity. |

### `*thread.Channel`

| Method | Returns | Notes |
| --- | --- | --- |
| `channel.send(value: any)` | `boolean` | Sends a value into the channel. Returns `false` if closed, otherwise `true`. |
| `channel.recv()` | `any` | Receives a value from the channel, blocking until an item is available or the channel is closed. Returns `null` when closed and empty. |
| `channel.tryRecv()` | `any` | Non-blocking receive. Returns the next item or `null` if empty or closed. |
| `channel.close()` | `void` | Closes the channel. |
| `channel.isClosed()` | `boolean` |  |
| `channel.len()` | `number` | Returns the number of buffered items currently in the channel. |

## Thread safety

Once a program starts threads, every statement on shared data is atomic and no code needs a
lock of its own. Each shared value has its own lock: every object, array, map, set, class
instance and shared variable. A statement takes the locks of exactly the values it touches, so
threads working on different values never wait for each other, and a slow statement only holds
up statements on the same values. Captured locals are protected in both the parent function and
its callbacks, unless the closure is only ever called by name in the function that defines it;
such a closure cannot reach another thread, so its captures stay private.

Index writes, field writes, array and collection methods such as `append`, `pop`, `delete`,
`map.set` and `set.add`, and read-modify-write expressions such as `count += 1` are atomic. A
statement that calls an OSL function or method runs outside statement locks, so the function
can lock what it touches itself; the shared values the statement reads beside the call are read
under their own locks.

```osl
import "std:thread"

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

A value is the same value through any variable or path that reaches it. A thread writing
`root.left.count += 1` and one writing `left.count += 1` through an alias of `root.left` take the
same lock, so their updates never interleave. Statements that touch several values take their
locks in one fixed order, so two statements that touch the same values in opposite orders cannot
deadlock. Readers of a value run in parallel with each other.

### Atomic blocks

Automatic safety makes each statement atomic, not a sequence of them: another thread can change
`count` between an `if count < limit` check and the assignment inside its block. `atomic ( ... )`
runs a block as one statement. It takes the lock of every value the block touches before it
starts, in the same fixed order, and holds them until it ends, so no other statement on those
values runs partway through it.

```osl
import "std:thread"

object counts = {}
array seen = []

def record(string key) (
  atomic (
    if counts[key] == null (
      counts[key] = 0
    )
    counts[key] += 1
    if !seen.contains(key) (
      seen.append(key)
    )
  )
)
```

The locks are named before the block runs, so a value the block works on must be reachable
from what exists when it starts. Reaching a shared value only through a variable the block itself
sets is a compile error; read that value before the block, or declare the variable in the block
with the value it holds. OSL code never runs while the block holds its locks, so the block cannot
call an OSL function or method, pass a callback, or leave early with `return`, `break` or
`continue`. Calls that wait still run, but every thread that needs the locked values waits with
them, so the compiler warns about them inside the block: file and network packages such as `fs`,
`requests` and `ws`, `wait`, thread waits and channel sends and receives, and `sync` locks. Do
that work before or after the block. In a program that never starts a thread an atomic block runs
as a plain block.

### Snapshots and iteration

`json.stringify`, `.toStr()` on objects and arrays, and `.clone()` copy one object or array
at a time under its lock and then work on that copy, so encoding or cloning a large tree never
stalls writers of other values, and writers of the tree wait only for the copy of one level. The
result reflects each container as it was when it was reached, not one instant across the whole
tree. Use an atomic block or a `sync` lock when the tree must be captured as a single consistent
state.

Collection iteration takes a shallow snapshot when the source may be shared, including
collections returned by functions. Array callbacks for `map`, `filter`, `some`, and
`every` traverse a snapshot. A callback can mutate its source without changing that
traversal or holding a collection lock across user code. Nested objects remain shared
references and use their own locks.

Sorting compares a snapshot and writes the sorted elements back under the collection
lock. Concurrent updates made during comparison can be replaced by that write. Use an
explicit `sync` lock around operations that must form one transaction with a sort.

### Cost

Programs that never start a thread skip capture analysis, and the compiler removes automatic
locking. Named functions passed to `thread.new` or `thread.parallel` use a constant-time scope
lookup without reading captured globals during thread creation. Other functions are not added to
that lookup. Dynamic callbacks use the safe fallback.

The compiler leaves constant expressions outside statement locks. It can also omit collection
locks for fresh local arrays of scalar values when their aliases do not escape. Parameters,
globals, callback captures, and arrays passed to unknown functions retain locking. Raw Go in a
function disables this local ownership optimization. Statements that only touch thread-local
state take no statement lock. That covers assigning a literal or another local to a local
variable, and storing a locally computed value under one key of an object or array held in a
local variable, where the collection lock alone makes the store atomic. Scalar package globals
are stored atomically, so a plain assignment to one or a read of one takes no lock.

The locks live in fixed tables indexed by each value's address, so they take the same memory
however many values a program creates. Two unrelated values can share a lock now and then;
they then wait for each other briefly but never deadlock. Explicit locks from
[`osl/sync`](sync.md) are still your responsibility: always release them and use a consistent
order when acquiring more than one.

Raw Go code and imported Go packages can retain references or launch goroutines outside
OSL's locks. Synchronize that boundary or pass a copy. Automatic OSL locking does not
make arbitrary foreign code safe.

## Notes

- Prefer `import "std:thread"`; the older `import "osl/thread"` spelling remains supported.
- `defer <statement>` runs a statement when the enclosing function returns (like Go's `defer`), which is handy for releasing an `osl/sync` lock taken inside a thread.
- Panicking tasks still complete their handle. `wait` and a completed `timeout` rethrow
  the failure; `waitAll` waits for every task before rethrowing.

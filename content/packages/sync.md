---
description: Lock shared data across several steps, run set-up code once and wait for a group of threads with locks, once and wait groups.
package: sync
---

# sync

OSL already makes each statement on shared data atomic, and `atomic ( ... )` groups several statements into one step (see the [concurrency lesson](../learn/concurrency.md)). `std:sync` covers what those can't express: a lock held across code that waits or calls other functions, set-up that must run only once, and waiting until a group of threads has finished.

## A lock you own

`sync.newLock()` returns a lock value. `lock.with(fn)` takes the lock, calls `fn`, and releases the lock even if `fn` throws. It returns what `fn` returned. While one thread is inside `with`, the others wait their turn:

```osl
import "std:sync"

auto lock = sync.newLock()
string[] events = []

async work(int id) int (
  lock.with(def() -> (
    events.append("start " ++ id)
    thread.sleep(10)
    events.append("end " ++ id)
  ))
  return id
)

*thread.Thread<int>[] jobs = []
for id in 1 to 3 (
  jobs.append(work(id))
)
void thread.waitAll(jobs)

boolean paired = true
for pair in 1 to 3 (
  int i = (pair * 2) - 1
  string id = events[i].split(" ")[2]
  if events[i + 1] != "end " ++ id (
    paired = false
  )
)
log events.len
log paired
```

```output
6
true
```

Which thread goes first varies, so the example checks the part that doesn't: every `start` is followed straight away by its own `end`, because no thread can enter the locked section while another is in it. Without the lock, the three would interleave.

A lock's value belongs with the data it protects, so keep them together in a class or next to each other. `sync.newNamedLock("cache")` gives a lock a name, which only appears in error messages.

## Taking and releasing by hand

`lock()` and `unlock()` are the pieces `with` is made of. Pair them with `defer` so the lock is released on every way out of the function:

```osl
import "std:sync"

auto lock = sync.newLock()
int balance = 100

def withdraw(int amount) boolean (
  lock.lock()
  defer lock.unlock()
  if balance < amount (
    return false
  )
  balance -= amount
  return true
)

log withdraw(30)
log withdraw(100)
log balance
```

```output
true
false
70
```

`tryLock()` takes the lock only if it is free and says whether it did. It never waits:

```osl
import "std:sync"

auto lock = sync.newLock()

log lock.tryLock()
log lock.tryLock()
lock.unlock()
log lock.tryLock()
lock.unlock()
```

```output
true
false
true
```

The second `tryLock` is `false` because this same thread holds the lock already. Locks are not re-entrant.

## Mistakes that are caught

A thread that locks a lock it already holds would wait forever. OSL throws a `DeadlockError` instead. Releasing a lock that isn't held throws a `LockError`:

```osl
import "std:sync"

auto lock = sync.newNamedLock("counter")
lock.lock()

auto again = try(lock.lock())
log again.unwrapErr().kind
lock.unlock()

auto stray = try(lock.unlock())
log stray.unwrapErr().kind
```

```output
DeadlockError
LockError
```

## Many readers, one writer

When data is read often and changed rarely, let readers share the lock. `rlock()` takes a shared read lock, `runlock()` releases it, and `withRLock(fn)` does both around a function. A writer using `lock()` or `with()` waits until no readers are left:

```osl
import "std:sync"

auto lock = sync.newLock()
string[int] prices = {"apple": 3, "pear": 4}

def price(string name) int -> lock.withRLock(def() int -> prices[name] ?? 0)

def setPrice(string name, int value) (
  lock.with(def() -> (
    prices[name] = value
  ))
)

log price("apple")
setPrice("apple", 5)
log price("apple")
log price("plum")
```

```output
3
5
0
```

A thread that holds a read lock can't upgrade it to a write lock, or take a second read lock. Either throws a `DeadlockError`: release first.

## Locks by name

For quick uses there are global locks, picked by a string. `sync.withLock(name, fn)` is `with` on the lock called `name`, and `sync.lock`, `sync.unlock`, `sync.tryLock`, `sync.rlock`, `sync.runlock` and `sync.withRLock` match the lock methods. Anything that uses the same name shares the lock:

```osl
import "std:sync"

int total = 0

async add(int amount) int (
  sync.withLock("total", def() -> (
    int current = total
    thread.sleep(1)
    total = current + amount
  ))
  return amount
)

*thread.Thread<int>[] jobs = []
for n in 1 to 10 (
  jobs.append(add(n))
)
void thread.waitAll(jobs)
log total
```

```output
55
```

The read, the sleep and the write happen inside the lock, so no thread's update is lost. A lock value is usually better than a name: a typo in a string name quietly makes a different lock.

## Run once

`sync.once(name, fn)` calls `fn` the first time it sees `name`, and returns its value. Every later call with that name returns `null` without calling `fn`. Threads that arrive while the first call is running wait until it finishes, so code after `once` can rely on its effects:

```osl
import "std:sync"

int setups = 0

def prepare() (
  sync.once("prepare", def() -> (
    thread.sleep(20)
    setups++
  ))
)

async user(int id) int (
  prepare()
  return id
)

*thread.Thread<int>[] jobs = []
for id in 1 to 5 (
  jobs.append(user(id))
)
void thread.waitAll(jobs)
log setups

log sync.once("greeting", def() string -> "hello") ?? "already done"
log sync.once("greeting", def() string -> "hello") ?? "already done"
```

```output
1
hello
already done
```

If the first call throws, every call with that name throws the same error.

## Wait groups

A wait group counts outstanding work. `add(n)` raises the count (by 1 with no argument), each finished piece of work calls `done()`, and `wait()` blocks until the count is back at 0:

```osl
import "std:sync"
import "std:thread"

auto group = sync.waitGroup()
int[] squares = []

for n in 1 to 4 (
  group.add()
  thread.new(def() -> (
    squares.append(n * n)
    group.done()
  ))
)

group.wait()
log group.count()
log squares.sort()
```

```output
0
[1,4,9,16]
```

Call `add` before starting the work it counts, not inside it, or `wait` may see 0 too early. `done` throws a `StateError` if the count is already 0, and `add` throws a `ValueError` if the count would go below 0.

When you have the thread handles, `thread.waitAll` does the same job and also gives back the results. A wait group is for work that doesn't hand a value back, or that is started from many places.

:::quiz
A thread calls `lock.lock()` and, still holding it, calls `lock.lock()` again. What happens?

- [ ] The second call does nothing.
- [ ] The thread waits forever.
- [x] It throws a `DeadlockError`.

Locks aren't re-entrant. OSL detects the self-wait and throws instead of hanging.
:::

:::exercise title="Set up once"
`loadConfig` is called from three places and should do its work only once, but it runs three times. Wrap its work in `sync.once`.

```osl
import "std:sync"

int loads = 0

def loadConfig() (
  loads++
)

loadConfig()
loadConfig()
loadConfig()
log loads
```

```output
1
```

> [!hint]
> `sync.once(name, fn)` calls `fn` only the first time it sees `name`.

```osl solution
import "std:sync"

int loads = 0

def loadConfig() (
  sync.once("config", def() -> (
    loads++
  ))
)

loadConfig()
loadConfig()
loadConfig()
log loads
```
:::

## API reference

::api

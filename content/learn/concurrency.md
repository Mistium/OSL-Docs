---
description: Do several things at once with threads, share data safely, pass messages through channels, and run work in parallel.
lesson: 20
---

# Concurrency

A thread runs a function alongside the rest of your program. Threads make a slow job, such as waiting on the network or crunching numbers, happen at the same time as everything else. OSL's threads come from [`std:thread`](../packages/thread.md), and shared data is safe by default.

## Starting a thread

`thread.new` starts a function on a new thread and gives you a handle to it. `wait()` waits for it to finish and gives back what it returned:

```osl
import "std:thread"

def slowSquare(int n) int (
  thread.sleep(100)
  return n * n
)

auto job = thread.new(slowSquare, 12)
log "working on something else meanwhile"
log job.wait()
```

```output
working on something else meanwhile
144
```

Extra arguments to `thread.new` are passed to the function. `thread.sleep(ms)` pauses the current thread for that many milliseconds.

## Waiting for several

Start as many threads as you like and wait for all of them. Three jobs that each take a tenth of a second finish together in about a tenth of a second, not three:

```osl
import "std:thread"

def fetch(string name) string (
  thread.sleep(100)
  return name ++ " done"
)

array jobs = []
for name in ["alpha", "beta", "gamma"] (
  jobs.append(thread.new(fetch, name))
)
log thread.waitAll(jobs)
```

```output
["alpha done","beta done","gamma done"]
```

`waitAll` keeps the results in the order the threads were started, whichever finishes first.

## Parallel maps

The most common job is "do this to every item, using every core". `thread.parallel` does exactly that, and returns the results in order:

```osl
import "std:thread"

def collatzSteps(int start) int (
  int n = start
  int steps = 0
  while n != 1 (
    n = if n % 2 == 0 then n / 2 else (n * 3) + 1
    steps++
  )
  return steps
)

int[] starts = [27, 97, 871, 6171]
log thread.parallel(starts, def(int n, int i) int -> collatzSteps(n))
```

```output
[111,118,178,261]
```

The function gets each item and its position. An optional third argument limits how many run at once.

## Sharing data is safe

Once a program starts threads, every statement that touches shared data runs as one indivisible step. Eight threads adding to the same object never lose an update, and you don't write a single lock:

```osl
import "std:thread"

string[int] counts = {}
array jobs = []
for t 8 (
  jobs.append(thread.new(def(int id) int -> (
    loop 1000 (
      counts["total"] = (counts["total"] ?? 0) + 1
    )
    return id
  ), t))
)
void thread.waitAll(jobs)
log counts["total"]
```

```output
8000
```

Each statement is atomic, but a sequence of statements isn't: another thread can act between two of them. When several steps must happen together, wrap them in `atomic ( ... )`, which runs the block as one step.

## Channels

A channel passes values from one thread to another, in order. One side `send`s, the other `recv`s, waiting when there's nothing yet:

```osl
import "std:thread"

auto ch = thread.channel()

auto producer = thread.new(def() int -> (
  for n in 1 to 5 (
    void ch.send(n * n)
  )
  ch.close()
  return 0
))

int total = 0
while true (
  auto value = ch.recv()
  if value == null break
  total += value.<int>
)
void producer.wait()
log total
```

```output
55
```

`recv` returns `null` once the channel is closed and empty, which ends the loop.

## Racing and timeouts

`thread.race` gives the result of whichever thread finishes first. `job.wait({timeout: ms})` waits at most that long, and throws a `TimeoutError` if the thread hasn't finished; `try` turns that into a result you can check:

```osl
import "std:thread"

auto quick = thread.new(def() string -> (
  thread.sleep(50)
  return "quick"
))
auto slow = thread.new(def() string -> (
  thread.sleep(500)
  return "slow"
))
log thread.race([quick, slow])

auto sleepy = thread.new(def() string -> (
  thread.sleep(1000)
  return "finally"
))
auto waited = try(sleepy.wait({timeout: 50}))
log waited.isErr()
log waited.unwrapErr().kind
```

```output
quick
true
TimeoutError
```

A timeout stops waiting; it doesn't stop the thread.

> [!note] Servers are concurrent already
> A web server from [`std:serve`](../packages/serve.md) handles each request on its own thread, with the same safety for shared data. You get concurrency there without starting a thread yourself.

:::quiz
Eight threads each run `count += 1` a thousand times on a shared variable. What is `count` afterwards?

- [x] Always 8000.
- [ ] Usually a bit less than 8000.
- [ ] It doesn't compile without a lock.

Every statement on shared data is atomic once threads exist, so no update is lost.
:::

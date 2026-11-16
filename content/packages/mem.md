---
description: Measure a program's memory use, force garbage collection, write pprof profiles and serve live profiling data.
package: mem
---

# mem

`std:mem` shows what a program is doing with memory. Reach for it when a long-running program grows, when you want to know what a data structure costs, or when you need a profile to find where the allocations come from. OSL frees memory for you with a garbage collector, so most programs never need this package. It is for the ones that do.

Exact numbers differ between machines and runs, so the examples print comparisons, not the figures themselves.

## Memory statistics

`mem.stats()` returns a snapshot. The fields you will use most are `alloc` (bytes in use now), `totalAlloc` (bytes ever allocated), `heapObjects` (live objects), `numGC` (collections so far) and `goroutines` (running threads):

```osl
import "std:mem"

auto now = mem.stats()
log now.alloc > 0
log now.heapObjects > 0
log now.goroutines >= 1
log now.sys >= now.alloc
```

```output
true
true
true
true
```

All sizes are in bytes. `sys` is what the program has asked the operating system for, which is always at least what is in use.

## Measuring what something costs

Take a snapshot before and after, and compare. `mem.gc()` runs a collection first and then returns fresh statistics, so garbage from earlier work doesn't blur the reading:

```osl
import "std:mem"

auto before = mem.gc()

int[] numbers = []
for i in 1 to 200000 (
  numbers.append(i)
)

auto after = mem.gc()
log numbers.len
log after.alloc > before.alloc
log after.numGC > before.numGC
log (after.alloc - before.alloc) > 1000000
```

```output
200000
true
true
true
```

The array holds 200000 numbers, so it takes well over a million bytes. Keep a reference to the data until after the second reading, or the collector may free it before you measure.

## Watching for growth

A leak is memory that keeps growing because something still refers to it. Measure after a collection, at intervals, and look at the trend, not one number:

```osl
import "std:mem"

string[] history = []

def remember(string line) (
  history.append(line)
)

auto start = mem.gc()
for round in 1 to 3 (
  for i in 1 to 50000 (
    remember("entry " ++ i)
  )
  auto now = mem.gc()
  log "round" round "grew:" now.alloc > start.alloc
)
log history.len
```

```output
round 1 grew: true
round 2 grew: true
round 3 grew: true
150000
```

A program that logs "grew: true" forever when it should be steady is keeping something it doesn't need, such as a list or a cache with no limit. [cache](cache.md) has a capacity for this reason.

## Writing a profile

`mem.dump(path)` writes a pprof profile, which Go's `go tool pprof` can open to show where memory was allocated. The default is a heap profile, and the `profile` option picks others: `allocs`, `goroutine`, `threadcreate`, `block` or `mutex`:

```osl
import "std:mem"
import "std:fs"

fs.remove("heap.pprof", {force: true}).unwrap()
mem.dump("heap.pprof").unwrap()
log fs.size("heap.pprof").unwrap() > 0

mem.dump("threads.pprof", {profile: "goroutine"}).unwrap()
log fs.exists("threads.pprof")

log mem.dump("no-such-folder/heap.pprof").unwrapErr().kind

fs.remove("heap.pprof", {force: true}).unwrap()
fs.remove("threads.pprof", {force: true}).unwrap()
```

```output
true
true
NotFoundError
```

The file is replaced atomically, so a profile is never half written. Then, in a shell, `go tool pprof heap.pprof` opens it. A `heap` profile samples allocations, so call `mem.setProfileRate` early, before the allocations you want to see, to change how often it samples.

## Live profiling

`mem.serve(address)` starts a profiling server in the background and returns a handle. Profiles are under `/debug/pprof/`, where `go tool pprof http://host/debug/pprof/heap` can read them from a running program. Use `127.0.0.1` so only this machine can reach it, and port `0` for a free one:

```osl
import "std:mem"
import "std:requests"

auto profiler = mem.serve("127.0.0.1:0").unwrap()
log profiler.address().startsWith("127.0.0.1:")

string url = "http://" ++ profiler.address() ++ "/debug/pprof/goroutine?debug=1"
auto reply = requests.get(url).unwrap()
log reply.status reply.body.startsWith("goroutine profile")

profiler.close()
```

```output
true
200 true
```

> [!warning]
> Anyone who can reach the address can read the program's profiles. Never expose it to the internet.

## Tuning the collector

Two settings change how eagerly the collector runs, and both return the previous value so you can put it back. `setGCPercent` is how far the heap may grow past the live data before the next collection (100 by default), and `setMemoryLimit` is a soft limit in bytes where the collector works harder near the limit. A limit of `0` means none:

```osl
import "std:mem"

int old = mem.setGCPercent(200)
log old
log mem.setGCPercent(old)

log mem.setMemoryLimit(512 * 1024 * 1024)
log mem.setMemoryLimit(0)

```

```output
100
200
0
536870912
```

A higher percentage collects less often and uses more memory, which suits a program with a small live heap that allocates a lot. A negative limit or profile rate throws a `ValueError`.

:::quiz
Why does the page call `mem.gc()` before taking a measurement?

- [ ] To make the program faster.
- [x] To free garbage first, so the reading shows what is still in use.
- [ ] Because `stats` fails without it.

`stats()` alone counts memory that is garbage but not yet collected.
:::

:::exercise title="Did it grow?"
Measure `alloc` after a collection, build a list of 100000 numbers, measure again after a collection, and print whether it grew. Keep using the list after the second reading.

```osl
import "std:mem"

log false
```

```output
true
100000
```

> [!hint]
> `auto before = mem.gc()`, build the list, `auto after = mem.gc()`.

> [!hint]
> Print `after.alloc > before.alloc` and then `numbers.len`, which keeps the list alive.

```osl solution
import "std:mem"

auto before = mem.gc()
int[] numbers = []
for i in 1 to 100000 (
  numbers.append(i)
)
auto after = mem.gc()
log after.alloc > before.alloc
log numbers.len
```

```output
true
100000
```
:::

## API reference

::api

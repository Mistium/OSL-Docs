# mem

The `mem` package exposes Go's runtime memory counters and standard pprof profiles. Go's
runtime already samples allocations, so importing this package adds no custom instrumentation
or continuous work.

```osl
import "std:mem"
```

#### `mem.dump(path)` -> `boolean`

Forces a garbage collection, then writes a heap profile to `path`. Returns `true` when the
complete profile was written and closed successfully, or `false` otherwise. The garbage
collection and file write only run when `dump` is called. The profile atomically replaces the
destination after it has been flushed and closed. A failed dump leaves an existing profile intact
and removes its temporary file.

```osl
mem.dump("heap.pprof")
```

Show the functions retaining the most live memory:

```bash
go tool pprof -top heap.pprof
```

Show the functions responsible for the most total allocated memory instead:

```bash
go tool pprof -top -alloc_space heap.pprof
```

Compare a later heap against an earlier baseline to find memory that remained reachable:

```bash
go tool pprof -top -base heap-before.pprof heap-after.pprof
```

#### `mem.dumpProfile(name, path)` -> `boolean`

Writes any named runtime profile to `path`. Returns `false` if the profile name is unknown or
the file cannot be written. Useful names for memory investigations are `heap`, `allocs`, and
`goroutine`. Heap and allocation dumps force garbage collection first. Successful dumps replace
the destination atomically; failures preserve an existing file.

```osl
mem.dumpProfile("goroutine", "goroutines.pprof")
```

#### `mem.stats()` -> `object`

Returns a point-in-time runtime snapshot. Call it at intervals from application code when you
need a lightweight time series; it does not start a sampler or retain previous readings.

| Field | Meaning |
| --- | --- |
| `alloc`, `heapAlloc` | Bytes in reachable heap objects. |
| `totalAlloc` | Cumulative bytes allocated since process start. |
| `sys` | Bytes obtained from the operating system for the Go runtime. This is not RSS. |
| `mallocs`, `frees`, `liveObjects`, `heapObjects` | Object allocation and liveness counts. |
| `heapSys`, `heapIdle`, `heapInuse`, `heapReleased` | Heap reservation and release breakdown. |
| `stackInuse`, `stackSys` | Goroutine stack memory. |
| `mspanInuse`, `mcacheInuse`, `gcSys`, `otherSys` | Runtime metadata memory. |
| `nextGC`, `numGC`, `pauseTotalNs`, `gcCPUFraction` | Garbage collector state and cost. |
| `goroutines` | Current goroutine count. |
| `profileRate` | Average bytes allocated per heap-profile sample. |

#### `mem.gc()` -> `object`

Forces garbage collection and returns the same object as `mem.stats()`. If `heapAlloc` keeps
growing across comparable post-GC readings, take and compare heap profiles to find the roots.

#### `mem.setProfileRate(bytes)` -> `number`

Sets the average bytes allocated per heap-profile sample and returns the previous rate. The
default is normally 524288 bytes. Set it once, as early as possible: smaller values improve
profile resolution but add overhead, `1` records every allocation, and `0` disables profiling.

```osl
number oldRate = mem.setProfileRate(65536)
```

#### `mem.setGCPercent(percent)` -> `int`

Sets how far the heap may grow past the live data left by the last garbage collection before the
next one starts, as a percentage, and returns the previous setting. This is Go's `GOGC`: the
default is `100`, or the `GOGC` environment variable. A program with a small live heap that
allocates heavily collects very often at the default; a larger value such as `400` collects less
often in exchange for more memory. A negative value turns garbage collection off, although a
memory limit set with `mem.setMemoryLimit` still triggers it. OSL never changes the setting
itself.

```osl
int previous = mem.setGCPercent(400)
```

#### `mem.setMemoryLimit(bytes)` -> `int`

Sets a soft limit, in bytes, on the memory the Go runtime uses, and returns the previous limit. This
is Go's `GOMEMLIMIT`: as the runtime nears the limit it collects more often, whatever
`mem.setGCPercent` says. Pass `0` for no limit, the default. A returned `0` likewise means there
was no limit, so the result can be passed back to restore the earlier setting. Throws
`ValueError` for a negative limit.

```osl
// Collect rarely, but stay under 512 MiB.
mem.setGCPercent(-1)
int previous = mem.setMemoryLimit(512 * 1024 * 1024)
```

#### `mem.serve(address)` -> `boolean`

Starts the standard Go pprof HTTP endpoints on `address` and returns whether listening started.
Bind to localhost unless the endpoint is protected; profiles can contain sensitive process data.
Header reads time out after 10 seconds. The idle endpoint adds no custom sampling loop.

```osl
mem.serve("127.0.0.1:6060")
```

Open the interactive heap viewer:

```bash
go tool pprof -http=:0 http://127.0.0.1:6060/debug/pprof/heap?gc=1
```

Capture comparable snapshots and a goroutine profile:

```bash
curl -o heap-before.pprof 'http://127.0.0.1:6060/debug/pprof/heap?gc=1'
curl -o heap-after.pprof 'http://127.0.0.1:6060/debug/pprof/heap?gc=1'
curl -o goroutines.pprof http://127.0.0.1:6060/debug/pprof/goroutine
```

The endpoint also exposes CPU profiles and runtime traces through the standard pprof paths.

#### `mem.address()` -> `string`

Returns the pprof listener's bound address. This includes the operating system assigned port when
`mem.serve("127.0.0.1:0")` is used. Returns an empty string when the server is stopped.

#### `mem.stop()` -> `boolean`

Closes the pprof listener and its active HTTP connections. Returns `false` when no server is active.

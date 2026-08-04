# mem

> Low-overhead memory diagnostics

The `mem` package exposes Go's runtime memory counters and standard pprof profiles. Go's
runtime already samples allocations, so importing this package adds no custom instrumentation
or continuous work.

```javascript
import "osl/mem"
```

#### `mem.dump(path)` -> `boolean`

Forces a garbage collection, then writes a heap profile to `path`. Returns `true` when the
complete profile was written and closed successfully, or `false` otherwise. The garbage
collection and file write only run when `dump` is called.

```javascript
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
`goroutine`. Heap and allocation dumps force garbage collection first.

```javascript
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

```javascript
number oldRate = mem.setProfileRate(65536)
```

#### `mem.serve(address)` -> `boolean`

Starts the standard Go pprof HTTP endpoints on `address` and returns whether listening started.
Bind to localhost unless the endpoint is protected; profiles can contain sensitive process data.
The idle endpoint adds no custom sampling loop.

```javascript
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

#### `mem.stop()` -> `boolean`

Stops the pprof listener. Returns `false` when no listener is active.

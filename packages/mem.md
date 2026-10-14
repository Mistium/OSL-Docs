# mem

Use `mem` to inspect the program's memory use, write pprof profiles, and serve live profiling data.
It reads Go's runtime counters and standard profiles, so importing it adds no instrumentation or
background work.

```osl
import "std:mem"
```

## Example

```osl
import "std:mem"

auto before = mem.gc()
// ... run the code you suspect ...
auto after = mem.gc()
log "heap grew by " ++ (after.heapAlloc - before.heapAlloc) ++ " bytes"

mem.dump("heap.pprof")
```

Then read the profile with Go's tools:

```bash
go tool pprof -top heap.pprof                 # functions retaining the most live memory
go tool pprof -top -alloc_space heap.pprof    # functions allocating the most in total
go tool pprof -top -base heap-before.pprof heap-after.pprof   # what stayed reachable
```

## API reference

### `mem`

| Function | Returns | Notes |
| --- | --- | --- |
| `mem.stats()` | `object` | A snapshot of memory statistics. See [stats records](#stats-records). |
| `mem.gc()` | `object` | Runs a garbage collection, then returns `mem.stats()`. |
| `mem.dump(path, options?)` | `result<unit, error>` | Writes a pprof profile to `path`, replacing the file atomically. Option `profile` (default `"heap"`): `"heap"`, `"allocs"`, `"goroutine"`, `"threadcreate"`, `"block"` or `"mutex"`. A heap or allocs profile runs a garbage collection first. Throws `ValueError` for an unknown profile. Fails with `NotFoundError` when the directory doesn't exist, `PermissionError` or `IOError`. |
| `mem.profileRate()` | `int` | The average number of bytes allocated between heap profile samples. 0 means heap profiling is off. |
| `mem.setProfileRate(bytes)` | `int` | Sets the heap profile sampling rate and returns the previous one. `1` records every allocation and `0` turns profiling off. Throws `ValueError` for a negative rate. |
| `mem.serve(address)` | `result<*mem.Server, error>` | Starts a pprof HTTP server in the background on `address`, such as `"127.0.0.1:6060"` or `":0"` for any free port. Profiles are under `/debug/pprof/`. Fails with `NetworkError` when the address can't be listened on. |

The default profile rate is normally 524288 bytes. Set a new rate once, as early as possible, before
the allocations you want to profile. Smaller values give finer profiles at a higher cost.

```osl
mem.dump("goroutines.pprof", {profile: "goroutine"})
int oldRate = mem.setProfileRate(65536)
log "profile rate was " ++ oldRate
```

### `*mem.Server` methods

| Method | Returns | Notes |
| --- | --- | --- |
| `server.address()` | `string` | The address the server listens on, with the real port when it was started on port 0. |
| `server.close()` | `void` | Stops the server and frees its port. Closing again does nothing. |

```osl
auto server = mem.serve("127.0.0.1:6060")
log "pprof on http://" ++ server.address() ++ "/debug/pprof/"
```

Anyone who can reach the address can read the profiles, which can contain sensitive data, so bind
to a loopback address unless the endpoint is protected. Use Go's tools against the running server:

```bash
go tool pprof -http=:0 'http://127.0.0.1:6060/debug/pprof/heap?gc=1'
curl -o heap-before.pprof 'http://127.0.0.1:6060/debug/pprof/heap?gc=1'
curl -o goroutines.pprof http://127.0.0.1:6060/debug/pprof/goroutine
```

The server also serves CPU profiles and execution traces at the standard pprof paths.

### Stats records

`mem.stats()` and `mem.gc()` return these keys. Sizes are in bytes.

| Key | Meaning |
| --- | --- |
| `alloc`, `heapAlloc` | Bytes in reachable heap objects |
| `totalAlloc` | Bytes allocated since the program started |
| `sys` | Bytes obtained from the OS for the Go runtime (not the same as RSS) |
| `mallocs`, `frees`, `liveObjects`, `heapObjects` | Allocation and live object counts |
| `heapSys`, `heapIdle`, `heapInuse`, `heapReleased` | Heap reservation and release |
| `stackInuse`, `stackSys` | Stack memory |
| `mspanInuse`, `mcacheInuse`, `gcSys`, `otherSys` | Runtime metadata |
| `nextGC` | Heap size that triggers the next collection |
| `numGC` | Collections so far |
| `pauseTotalNs` | Total collection pause time, in nanoseconds |
| `gcCPUFraction` | Share of CPU time spent collecting, from 0 to 1 |
| `goroutines` | Current goroutine count |
| `profileRate` | The heap profile sampling rate |

If `heapAlloc` keeps growing across comparable readings taken after `mem.gc()`, compare two heap
profiles to find what holds the memory.

## Deprecated

These still work for one release, with an `OSL-DEPRECATED` warning at each call.

| Deprecated | Use instead |
| --- | --- |
| `mem.dumpProfile(name, path)` | `mem.dump(path, {profile: name})` |
| `mem.address()` | `server.address()` on the handle from `mem.serve` |
| `mem.stop()` | `server.close()` on the handle from `mem.serve` |

`mem.serve` used to return a boolean. It now returns a server handle, and fails as a result when it
can't listen.

## Behavior and limits

The older `import "osl/mem"` spelling still works, with a migration warning.

A failed `dump` leaves an existing profile unchanged. The pprof server times out reading request
headers after 10 seconds.

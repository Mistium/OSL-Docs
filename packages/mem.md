# mem

> Low-overhead heap profiling

The `mem` package writes standard Go pprof heap profiles. Go's runtime already samples
allocations, so importing this package adds no custom instrumentation or continuous work.

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

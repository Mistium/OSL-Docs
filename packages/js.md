# js

```osl
import "std:js"
```

| Method | Returns | Notes |
| --- | --- | --- |
| `js.eval(code: any, timeoutMs: any)` | `object` | Runs QuickJS with a hard timeout and memory limit. Returns `{success, result}` or `{success: false, error}`. |

The sandbox has no filesystem or network access. Timeouts are clamped to a
finite maximum so infinite loops cannot wedge the host process.

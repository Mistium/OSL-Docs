# js

> Sandboxed JavaScript execution

```javascript
import "osl/js"
```

| Method | Returns | Description |
| --- | --- | --- |
| `js.eval(code: any, timeoutMs: any)` | `object` | Runs QuickJS with a hard timeout and memory limit, returning `{success, result}` or one shared `{success: false, error}` shape. |

The sandbox has no filesystem or network access. Timeouts are clamped to a
finite maximum so infinite loops cannot wedge the host process.

# thread

> Background threads

Use `thread` to run functions in the background and wait for one or more results.

```javascript
import "osl/thread"
```

## Example

```javascript
import "osl/thread"

auto t = thread.new(def() -> ( return 42 ))
log t.wait()
```

## API reference

### `thread`

| Method | Returns | Description |
| --- | --- | --- |
| `thread.new(fn: any, ...args: any)` | `*Thread` | Creates a new value. |
| `thread.wait()` | `any` | Runs the wait operation. |
| `thread.isDone()` | `boolean` | Reports whether done. |
| `thread.age()` | `number` | Runs the age operation. |
| `thread.waitAll(threads: array)` | `array` | Runs the wait all operation. |

## Notes

- Standard-library imports accept both `import "osl/thread"` and `import "thread"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

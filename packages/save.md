# save

Use `save` for simple persistent key-value data without designing a database schema.

```osl
import "std:save"
```

## Example

```osl
import "std:save"

store = save.create()
store.init("my-app")
store.setItem("theme", "dark")
log store.getItem("theme").data
```

## API reference

### `save`

| Method | Returns | Notes |
| --- | --- | --- |
| `save.init(appName: string)` | `boolean` |  |
| `save.OSL_path(filename: string)` | `string` |  |
| `save.setItem(filename: string, value: any)` | `string` | Writes an item and returns its path, or an empty string on failure. |
| `save.getItem(filename: string)` | `object` | Returns item. |
| `save.exists(filename: string)` | `boolean` | Reports whether the validated item path exists; false before initialization. |
| `save.all()` | `array` |  |
| `save.create()` | `*save` | Creates an isolated save value; call `init` before reading or writing. |

## Notes

- Prefer `import "std:save"`; the older `import "osl/save"` spelling remains supported.

## Behavior and limits

Call `init` before any read or write. Earlier operations return failure values. `init` resolves the
current user's home directory each time and creates missing parent directories.

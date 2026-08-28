# save

Use `save` for simple persistent key-value data without designing a database schema.

```javascript
import "std:save"
```

## Example

```javascript
import "std:save"

store = save.create()
store.init("my-app")
store.setItem("theme", "dark")
log store.getItem("theme").data
```

## API reference

### `save`

| Method | Returns | Description |
| --- | --- | --- |
| `save.init(appName: string)` | `boolean` | Runs the init operation. |
| `save.OSL_path(filename: string)` | `string` | Runs the osl path operation. |
| `save.setItem(filename: string, value: any)` | `string` | Writes an item after shared path validation, returning its path or an empty string. |
| `save.getItem(filename: string)` | `object` | Returns item. |
| `save.exists(filename: string)` | `boolean` | Reports whether the validated item path exists; false before initialization. |
| `save.all()` | `array` | Runs the all operation. |
| `save.create()` | `*save` | Creates an isolated save value; call `init` before reading or writing. |

## Notes

- Prefer `import "std:save"`; the older `import "osl/save"` spelling remains supported.

## Edge-case behavior

Operations before `init` fail safely instead of reading or writing an
unresolved path. Each `init` resolves the current home directory without shared
mutable root state, and creating the app directory also creates its parents.

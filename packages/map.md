# map

Use `map` when you need a mutable key-value map object with explicit methods for reading keys and values.

```osl
import "std:map"
```

## Example

```osl
import "std:map"

map users = map()
users.set("ada", 36)
log users.get("ada")
```

## API reference

### `Map` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.set(k: any, v: any)` | `*Map` | Sets a value. Keys must be comparable. |
| `value.get(k: any)` | `any` | Reads through the same comparable-key guard. |
| `value.delete(k: any)` | `void` | Deletes through the same comparable-key guard. |
| `value.size()` | `number` | Returns the number of stored values. |
| `value.clear()` | `void` | Clears all stored values. |
| `value.getKeys()` | `K[]` | Returns keys while preserving the map's key type. |
| `value.getValues()` | `V[]` | Returns values while preserving the map's value type. |

## Notes

- Prefer `import "std:map"`; the older `import "osl/map"` spelling remains supported.

Composite and cyclic keys are checked safely, and maps synchronize
concurrent reads and writes.

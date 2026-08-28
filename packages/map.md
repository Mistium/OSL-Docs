# map

Use `map` when you need a mutable key-value map object with explicit methods for reading keys and values.

```javascript
import "std:map"
```

## Example

```javascript
import "std:map"

map users = map()
users.set("ada", 36)
log users.get("ada")
```

## API reference

### `Map` values

| Method | Returns | Description |
| --- | --- | --- |
| `value.set(k: any, v: any)` | `*Map` | Sets a value after shared comparable-key validation. |
| `value.get(k: any)` | `any` | Reads through the same comparable-key guard. |
| `value.delete(k: any)` | `void` | Deletes through the same comparable-key guard. |
| `value.size()` | `number` | Returns the number of stored values. |
| `value.clear()` | `void` | Clears all stored values. |
| `value.getKeys()` | `K[]` | Returns keys while preserving the map's key type. |
| `value.getValues()` | `V[]` | Returns values while preserving the map's value type. |

## Notes

- Prefer `import "std:map"`; the older `import "osl/map"` spelling remains supported.

Maps and sets use one runtime comparable-value guard for composite and cyclic keys, and shared maps synchronize
concurrent reads and writes.

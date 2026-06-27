# map

> An ordered key-value map type

Use `map` when you need a mutable key-value map object with explicit methods for reading keys and values.

```javascript
import "osl/map"
```

## Example

```javascript
import "osl/map"

map users = map()
users.set("ada", 36)
log users.get("ada")
```

## API reference

### `Map` values

Methods available on `Map` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.set(k: any, v: any)` | `*Map` | Sets a value. |
| `value.get(k: any)` | `any` | Returns a value. |
| `value.delete(k: any)` | `void` | Deletes a value. |
| `value.size()` | `number` | Returns the number of stored values. |
| `value.clear()` | `void` | Clears all stored values. |
| `value.getKeys()` | `array` | Returns keys. |
| `value.getValues()` | `array` | Returns values. |

## Notes

- Standard-library imports accept both `import "osl/map"` and `import "map"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

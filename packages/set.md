# set

> A set type

Use `set` when you need a collection of unique values with membership checks.

```javascript
import "osl/set"
```

## Example

```javascript
import "osl/set"

set names = set()
names.add("ada")
log names.contains("ada")
```

## API reference

### `Set` values

Methods available on `Set` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.add(v: any)` | `*Set` | Adds through the shared runtime comparable-value guard. |
| `value.delete(v: any)` | `error` | Deletes through the same guard. |
| `value.contains(v: any)` | `boolean` | Checks membership through the same guard. |
| `value.size()` | `number` | Returns the number of stored values. |
| `value.clear()` | `void` | Clears all stored values. |
| `value.toArr()` | `array` | Converts the value to an array. |

## Notes

- Standard-library imports accept both `import "osl/set"` and `import "set"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

Composite and cyclic values are compared safely, and shared sets synchronize
concurrent reads and writes.

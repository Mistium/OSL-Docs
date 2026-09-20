# set

Use `set` when you need a collection of unique values with membership checks.

`set` is a built-in language type. It needs no package import.

## Example

```osl
set names = set()
names.add("ada")
log names.contains("ada")
```

## API reference

### `set` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.add(v: any)` | `set` | Adds a comparable value. |
| `value.delete(v: any)` | `error` | Deletes through the same guard. |
| `value.contains(v: any)` | `boolean` | Checks membership through the same guard. |
| `value.size()` | `number` | Returns the number of stored values. |
| `value.clear()` | `void` | Clears all stored values. |
| `value.toArr()` | `array` | Converts the value to an array. |

## Notes

Composite and cyclic values are compared safely. Sets synchronize
concurrent reads and writes.

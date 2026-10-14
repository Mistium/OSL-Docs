# set

Use `set` for an unordered collection of unique strings, numbers, booleans, or `null`, with
membership checks.

`set` is a built-in language type. It needs no package import.

## Example

```osl
set names = set()
names.add("ada").add("bob").add("ada")

log names.size()             // 2
log names.contains("ada")    // true
log names.delete("ada")      // true
log names.toArray()          // ["bob"]
```

## API reference

### `set` values

| Method | Returns | Notes |
| --- | --- | --- |
| `s.add(value)` | `set` | Adds `value`; adding a member again changes nothing. Mutates the set and returns it, so calls chain: `s.add(1).add(2)`. |
| `s.delete(value)` | `boolean` | Removes `value` in place. `true` when it was a member. |
| `s.contains(value)` | `boolean` | Whether `value` is a member. |
| `s.size()` | `int` | The number of members. |
| `s.clear()` | `void` | Removes every member in place. |
| `s.toArray()` | `array` | The members as a new array, in no particular order. |

## Errors

`add` and `delete` throw `TypeError` for a value that can't be hashed, such as an array or object.
`contains` reports `false` for one.

## Deprecated

These still work for one release with their old behaviour and draw an `OSL-DEPRECATED` warning:

| Deprecated | Use instead |
| --- | --- |
| `s.toArr()` | `s.toArray()` |

## Notes

- `delete` reports whether the value was there. Before this release it always reported success.
- Sets synchronize concurrent reads and writes.

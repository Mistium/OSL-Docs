# map

Use `map` for a mutable hash map keyed by strings, numbers, booleans, or `null`, with explicit
methods for reading and writing entries.

`map` is a built-in language type. It needs no package import.

## Example

```osl
map users = map()
users.set("ada", 36).set("bob", 41)

log users.get("ada")       // 36
log users.get("zed") ?? 0  // 0
log users.has("bob")       // true
log users.delete("bob")    // true
log users.keys()           // ["ada"]
```

## API reference

### `map` values

| Method | Returns | Notes |
| --- | --- | --- |
| `m.set(key, value)` | `map` | Stores `value` under `key`, replacing any value already there. Mutates the map and returns it, so calls chain: `m.set("a", 1).set("b", 2)`. |
| `m.get(key)` | `any` | The value, or `null` when the map has no such key. A stored `null` also reads as `null`; use `has` to tell them apart. |
| `m.has(key)` | `boolean` | Whether the map has an entry for `key`, even one holding `null`. |
| `m.delete(key)` | `boolean` | Removes the entry in place. `true` when the key was present. |
| `m.size()` | `int` | The number of entries. |
| `m.clear()` | `void` | Removes every entry in place. |
| `m.keys()` | `array` | The keys as a new array, in no particular order. |
| `m.values()` | `array` | The values as a new array, in no particular order. |

## Errors

`set`, `get`, and `delete` throw `TypeError` for a key that can't be hashed, such as an array or
object. `has` reports `false` for one.

## Changes from earlier versions

`m.getKeys()` and `m.getValues()` are now `m.keys()` and `m.values()`.

## Notes

Maps synchronize concurrent reads and writes.

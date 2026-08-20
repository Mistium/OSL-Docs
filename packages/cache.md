# cache

> In-memory LRU cache with TTLs

Use `cache` when you need a small in-memory store with optional TTL expiry and LRU-style capacity limits.

```javascript
import "std:cache"
```

## Example

```javascript
import "std:cache"

auto c = cache.create(100, 60)
c.set("token", "abc")
log c.get("token")
```

## API reference

### `cache`

| Method | Returns | Description |
| --- | --- | --- |
| `cache.create(capacity: any, ttl: any)` | `*Cache` | Creates a new value. |
| `cache.createDefault()` | `*Cache` | Creates a cache with default settings. |

### `Cache` values

Methods available on `Cache` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.set(key: any, value: any)` | `boolean` | Sets a value. |
| `value.get(key: any)` | `any` | Returns a value. |
| `value.getOrSet(key: any, value: any)` | `any` | Returns the existing value or stores a fallback through the shared lookup path. |
| `value.getOrSetFunc(key: any, fn: any)` | `any` | Returns the existing value or computes and stores one through the shared lookup path. |
| `value.delete(key: any)` | `boolean` | Deletes a value. |
| `value.clear()` | `boolean` | Clears all stored values. |
| `value.has(key: any)` | `boolean` | Reports whether the value exists. |
| `value.size()` | `number` | Returns the number of stored values. |
| `value.keys()` | `array` | Returns all keys. |
| `value.values()` | `array` | Returns all values. |
| `value.entries()` | `object` | Returns key-value entries. |
| `value.cleanupExpired()` | `void` | Removes expired cache entries. |
| `value.setTTL(key: any, ttl: any)` | `boolean` | Sets ttl. |
| `value.getTTL(key: any)` | `number` | Returns ttl. |
| `value.stats()` | `object` | Returns usage statistics in a fresh OSL object. |
| `value.setMany(data: any)` | `boolean` | Sets every entry from an object; non-object input returns false. |
| `value.getMany(keys: array)` | `object` | Returns many. |
| `value.deleteMany(keys: array)` | `boolean` | Deletes many. |
| `value.filter(fn: any)` | `object` | Returns values accepted through the shared snapshot collector. |
| `value.mapValues(fn: any)` | `object` | Transforms values through the shared snapshot collector. |
| `value.reduce(initial: any, fn: any)` | `any` | Reduces values with a callback. |
| `value.foreach(fn: any)` | `boolean` | Runs a callback for each value. |
| `value.toArray()` | `array` | Converts the value to an array. |

## Notes

- Prefer `import "std:cache"`; the older `import "osl/cache"` spelling remains supported.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Expiry uses one absolute-deadline liveness path, null values remain distinguishable from
missing keys, values and entries share a live snapshot, and stats snapshots discard expired entries.
Both fallback methods use the same presence-sensitive lookup, while `getOrSetFunc`
performs one load per key under concurrency. Loads for different keys run concurrently.

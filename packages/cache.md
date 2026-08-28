# cache

Use `cache` when you need a small in-memory store with optional TTL expiry and LRU-style capacity limits.

```osl
import "std:cache"
```

## Example

```osl
import "std:cache"

auto c = cache.create(100, 60)
c.set("token", "abc")
log c.get("token")
```

## API reference

### `cache`

| Method | Returns | Notes |
| --- | --- | --- |
| `cache.create(capacity: any, ttl: any)` | `*Cache` |  |
| `cache.createDefault()` | `*Cache` | Creates a cache with default settings. |

### `Cache` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.set(key: any, value: any)` | `boolean` | Sets a value. |
| `value.get(key: any)` | `any` | Returns a value. |
| `value.getOrSet(key: any, value: any)` | `any` | Returns the existing value, or stores and returns `value`. |
| `value.getOrSetFunc(key: any, fn: any)` | `any` | Returns the existing value, or calls `fn` once and stores its result. |
| `value.delete(key: any)` | `boolean` | Deletes a value. |
| `value.clear()` | `boolean` | Clears all stored values. |
| `value.has(key: any)` | `boolean` |  |
| `value.size()` | `number` | Returns the number of stored values. |
| `value.keys()` | `array` | Returns all keys. |
| `value.values()` | `array` | Returns all values. |
| `value.entries()` | `object` | Returns key-value entries. |
| `value.cleanupExpired()` | `void` | Removes expired cache entries. |
| `value.setTTL(key: any, ttl: any)` | `boolean` | Sets the key's remaining lifetime in seconds. |
| `value.getTTL(key: any)` | `number` | Returns the key's remaining lifetime in seconds. |
| `value.stats()` | `object` | Returns usage statistics in a fresh OSL object. |
| `value.setMany(data: any)` | `boolean` | Sets every entry from an object; non-object input returns false. |
| `value.getMany(keys: array)` | `object` | Returns the present values for the requested keys. |
| `value.deleteMany(keys: array)` | `boolean` | Deletes each requested key. |
| `value.filter(fn: any)` | `object` | Returns entries for which `fn` is true. |
| `value.mapValues(fn: any)` | `object` | Applies `fn` to each value and returns the results. |
| `value.reduce(initial: any, fn: any)` | `any` | Reduces values with a callback. |
| `value.foreach(fn: any)` | `boolean` | Runs a callback for each value. |
| `value.toArray()` | `array` | Converts the value to an array. |

## Notes

- Prefer `import "std:cache"`; the older `import "osl/cache"` spelling remains supported.

## Behavior and limits

The cache removes expired entries before reads and snapshots. A stored `null` still counts as a
present value. Concurrent `getOrSetFunc` calls for the same key run the loader once, while loaders
for different keys can run at the same time.

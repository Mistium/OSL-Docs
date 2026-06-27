# cache

> In-memory LRU cache with TTLs

Use `cache` when you need a small in-memory store with optional TTL expiry and LRU-style capacity limits.

```javascript
import "osl/cache"
```

## Example

```javascript
import "osl/cache"

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
| `value.getOrSet(key: any, value: any)` | `any` | Returns the existing value or stores and returns a fallback. |
| `value.getOrSetFunc(key: any, fn: any)` | `any` | Returns the existing value or computes, stores, and returns one. |
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
| `value.stats()` | `object` | Returns usage statistics. |
| `value.setMany(data: any)` | `boolean` | Sets many. |
| `value.getMany(keys: array)` | `object` | Returns many. |
| `value.deleteMany(keys: array)` | `boolean` | Deletes many. |
| `value.filter(fn: any)` | `object` | Returns values accepted by a callback. |
| `value.mapValues(fn: any)` | `object` | Transforms values with a callback. |
| `value.reduce(initial: any, fn: any)` | `any` | Reduces values with a callback. |
| `value.foreach(fn: any)` | `boolean` | Runs a callback for each value. |
| `value.toArray()` | `array` | Converts the value to an array. |

## Notes

- Standard-library imports accept both `import "osl/cache"` and `import "cache"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

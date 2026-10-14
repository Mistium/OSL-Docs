# cache

Use `cache` for an in-memory key-value store that evicts the least recently used entry when it is
full and expires entries after a time to live.

```osl
import "std:cache"
```

## Example

```osl
import "std:cache"

*cache.Cache sessions = cache.new({capacity: 100, ttl: 60000})
sessions.set("token", "abc")
log sessions.get("token")           // abc
log sessions.get("missing") ?? "-"  // -

string user = sessions.fetch("user:1", def() -> (
  return "Ada"                     // runs only when user:1 is missing or expired
))
log user
log sessions.info()                 // {"capacity":100,"size":2,"ttl":60000}
```

Cache handles can be declared as `*cache.Cache`, including in function parameters and return
types. Every duration is in milliseconds.

## API reference

### `cache`

| Method | Returns | Notes |
| --- | --- | --- |
| `cache.new(options?: object)` | `*cache.Cache` | Creates an empty cache. Options: `capacity` (default 100) and `ttl` in milliseconds (default 300000, five minutes). Throws `ValueError` for a capacity below 1 or a ttl that isn't above 0. |

### `Cache` values

| Method | Returns | Notes |
| --- | --- | --- |
| `c.set(key: string, value: any, options?: object)` | `void` | Stores `value` and marks it most recently used, evicting the least recently used entry when the cache is full. Option: `ttl`, this entry's lifetime in milliseconds. Throws `ValueError` for a negative ttl. |
| `c.get(key: string)` | `any` | The value, or `null` when `key` is missing or expired. A stored `null` also reads as `null`; use `has` to tell them apart. Marks the entry most recently used. |
| `c.has(key: string)` | `boolean` | Whether `key` holds a live entry, even one holding `null`. Doesn't change recency. |
| `c.fetch(key: string, loader: function)` | `any` | The live value under `key`, or the value `loader()` returns, which is stored first. Concurrent fetches of one key share a single loader call. |
| `c.delete(key: string)` | `boolean` | `true` when `key` held a live entry. |
| `c.clear()` | `void` | Removes every entry. |
| `c.size()` | `int` | The number of live entries. |
| `c.keys()` | `string[]` | The live keys, in no particular order. |
| `c.values()` | `array` | The live values, from most to least recently used. |
| `c.entries()` | `object` | The live entries as an object of key to value. |
| `c.toArray()` | `{key, value, expiresAt}[]` | The live entries from most to least recently used. `expiresAt` is unix milliseconds. |
| `c.cleanupExpired()` | `int` | Removes every expired entry now and returns how many it removed. |
| `c.ttl(key: string)` | `int?` | Milliseconds the entry has left to live, or `null` when `key` is missing or expired. |
| `c.expire(key: string, ttl: number)` | `boolean` | Gives the live entry a new lifetime of `ttl` milliseconds from now; `0` removes it. Returns `false` when there was nothing to change. Throws `ValueError` for a negative ttl. |
| `c.info()` | `{size, capacity, ttl}` | `size` is the number of live entries and `ttl` the default lifetime in milliseconds. |
| `c.setMany(entries: object)` | `void` | Stores every key and value of `entries`. |
| `c.pick(keys: string[])` | `object` | The live entries among `keys`. Missing and expired keys are left out. |
| `c.deleteMany(keys: string[])` | `int` | Removes every key and returns how many held a live entry. |
| `c.filter(fn: function)` | `object` | The live entries for which `fn(key, value)` returns `true`. |
| `c.mapValues(fn: function)` | `object` | Every live key with the value `fn(key, value)` returns for it. |
| `c.reduce(initial: any, fn: function)` | `any` | Folds the live values, most recently used first, with `fn(result, value)`. |
| `c.forEach(fn: function)` | `void` | Calls `fn(key, value)` for each live entry, most recently used first. |

`filter`, `mapValues`, `reduce`, `forEach`, `values`, `entries`, and `toArray` leave the cache and
its recency order unchanged.

## Errors

- `fetch` throws `StateError` when the loader fetches its own key, which would otherwise wait
  forever. An error the loader throws propagates, and nothing is stored.
- Negative ttl values and invalid `cache.new` options throw `ValueError`. Unknown option keys
  throw `ValueError` with a suggestion.

## Deprecated

These still work for one release with their old behaviour and draw an `OSL-DEPRECATED` warning:

| Deprecated | Use instead |
| --- | --- |
| `cache.create(capacity, ttlSeconds)` | `cache.new({capacity, ttl})`, with `ttl` in milliseconds |
| `cache.createDefault()` | `cache.new()` |
| `c.getOrSet(key, value)` | `c.fetch(key, loader)` with a loader that returns `value` |
| `c.getOrSetFunc(key, fn)` | `c.fetch(key, fn)` |
| `c.setTTL(key, seconds)` | `c.expire(key, milliseconds)` |
| `c.getTTL(key)` (seconds, `-1` when missing) | `c.ttl(key)` (milliseconds, `null` when missing) |
| `c.stats()` (ttl in seconds) | `c.info()` (ttl in milliseconds) and `c.keys()` |
| `c.getMany(keys)` | `c.pick(keys)` |

## Notes

- Prefer `import "std:cache"`; the older `import "osl/cache"` spelling remains supported.
- Expired entries are removed before reads and snapshots.
- `delete` reports whether the key was there. Before this release it always returned `true`.

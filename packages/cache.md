# cache

> In-memory LRU cache utilities

```javascript
import "osl/cache"
```

## Methods

- `cache.create(capacity, ttl)` → `Cache`
- `cache.createDefault()` → `Cache`
- `cache.set(key, value)` → `boolean`
- `cache.get(key)` → `any`
- `cache.getOrSet(key, value)` → `any`
- `cache.getOrSetFunc(key, fn)` → `any`
- `cache.delete(key)` → `boolean`
- `cache.clear()` → `boolean`
- `cache.has(key)` → `boolean`
- `cache.size()` → `number`
- `cache.keys()` → `array`
- `cache.values()` → `array`
- `cache.entries()` → `object`
- `cache.setTTL(key, ttl)` → `boolean`
- `cache.getTTL(key)` → `number`
- `cache.stats()` → `object`
- `cache.setMany(data)` → `boolean`
- `cache.getMany(keys)` → `object`
- `cache.deleteMany(keys)` → `boolean`
- `cache.filter(fn)` → `object`
- `cache.mapValues(fn)` → `object`
- `cache.reduce(initial, fn)` → `any`
- `cache.foreach(fn)` → `boolean`
- `cache.toArray()` → `array`

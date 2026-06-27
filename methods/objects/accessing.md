# Objects - Keys, Values & Membership

Read the contents of an object. None of these mutate.

#### `.getKeys()` → `array`
The object's keys.

#### `.getValues()` → `array`
The object's values.

#### `.getEntries()` → `array`
The object as an array of `[key, value]` pairs.

#### `.contains(key)` → `boolean`
Whether the object has the given key.

```javascript
object o = { a: 1, b: 2 }
log o.getKeys()      // ["a", "b"]
log o.getValues()    // [1, 2]
log o.getEntries()   // [["a", 1], ["b", 2]]
log o.contains("a")  // true
```

> Read a single value with index syntax (`o["a"]` or `o.a`) or `.item(key)`. The inverse of
> `.getEntries()` is the array method [`.toEntriesObj()`](../arrays/converting.md).

# Objects - Keys, Values & Membership

Read the contents of an object. None of these mutate.

#### `.getKeys()` → `string[]`
The object's keys. Object keys are always strings, so this remains `string[]` even when the object
values are dynamic.

Typed maps preserve their declared key type. For example, `int[string]` returns `int[]` keys and
membership checks accept integers without converting them to strings.

#### `.getValues()` → `any[]`
The object's values. When the compiler knows the object field types, it preserves those types in the
returned array; homogeneous inferred objects therefore return `T[]`.

#### `.getEntries()` → `array`
The object as an array of `[key, value]` pairs.

Typed-map entries retain both the declared key and value types at runtime.

For plain objects, keys, values, and entries all use the same sorted visible-key order.
The three enumeration methods take no arguments and report `requires no parameters` otherwise; `.contains` takes exactly one key.

#### `.contains(key)` → `boolean`
Whether the object has the given key.

```javascript
object o = { a: 1, b: 2 }
log o.getKeys()      // ["a", "b"]
log o.getValues()    // [1, 2]
log o.getEntries()   // [["a", 1], ["b", 2]]
log o.contains("a")  // true
```

```javascript
int[string] codes = {1: "one", 2: "two"}
log codes.getKeys()    // [1, 2]
log codes.contains(1) // true
log 1 in codes         // true
```

> Read a single value through the same lookup with index syntax (`o["a"]` or `o.a`) or `.item(key)`. The inverse of
> `.getEntries()` is the array method [`.toEntriesObj()`](../arrays/converting.md).

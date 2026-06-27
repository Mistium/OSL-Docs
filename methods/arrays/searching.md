# Arrays - Searching & Testing

Find elements, test positions and check predicates. Positions are **1-indexed**; "not found" is `0`.
Equality is **strict** - no type coercion.

#### `.contains(value)` → `boolean`
Whether the array contains `value` (strict equality).

```javascript
arr = [1, true, null]
log arr.contains(1)     // true
log arr.contains("1")   // false
log arr.contains(true)  // true
```

#### `.index(value)` → `number`
Position of the first matching element (1-indexed), or `0`.

#### `.lastIndex(value)` → `number`
Position of the last matching element (1-indexed), or `0`.

```javascript
arr = ["a", "b", "a", "c"]
log arr.index("a")     // 1
log arr.lastIndex("a") // 3
log arr.index("z")     // 0
```

#### `.some(fn)` → `boolean`
Whether `fn` returns true for **any** element.

#### `.every(fn)` → `boolean`
Whether `fn` returns true for **every** element.

```javascript
log [1, 2, 3].some(x -> x > 2)   // true
log [1, 2, 3].every(x -> x > 0)  // true
```

#### `.first()` → `unknown` / `.last()` → `unknown`
The first / last element.

```javascript
arr = [10, 20, 30]
log arr.first()  // 10
log arr.last()   // 30
```

#### `.randomOf()` → `unknown`
A random element from the array.

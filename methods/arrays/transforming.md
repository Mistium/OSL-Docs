# Arrays - Transforming

Methods that produce a new array from an existing one. Lambdas use the arrow form
`param -> expression`. Any function value works as a callback, including typed
lambdas like `(number x) number -> x * 2` and named functions.
Array `++` and `.concat()` use the same append semantics.

#### `.map(fn)` → `array`
Normalizes `fn` once, applies it to every element, and collects the results. A typed callback on a
typed array preserves its return type, so no dynamic conversion is needed.

```javascript
int[] values = [1, 2, 3]
int[] doubled = values.map((int x) int -> x * 2)
log doubled  // [2, 4, 6]
```

#### `.filter(fn)` → same array type
Keeps only the elements for which `fn` returns true, directly reusing the same predicate normalization as `.some()` and `.every()`.

```javascript
log [1, 2, 3, 4].filter(x -> x > 2)  // [3, 4]
```

#### `.sort()` → same array type
Returns the elements sorted ascending.

#### `.sortBy(key)` → same array type
Sorts an array of objects by the named field. Pass `"descending"` as a second argument to reverse.

```javascript
arr = [{name: "bob", age: 30}, {name: "alice", age: 25}]
log arr.sortBy("age").getKeys("name")               // ["alice", "bob"]
log arr.sortBy("age", "descending").getKeys("name") // ["bob", "alice"]
```

Ascending and descending sorts use the same numeric-or-string comparison rules.

`.sortBy(fn)` also accepts an arrow function, normalized once, that returns the value to sort on.
Typed callbacks on typed arrays use direct calls instead of dynamic dispatch.

#### `.reverse()` → same array type
Returns the elements in reverse order.

```javascript
log [3, 1, 2].sort().reverse()  // [3, 2, 1]
```

#### `.deDupe()` → same array type
Removes duplicate values, keeping first occurrences.

```javascript
log [1, 2, 2, 3, 1, 4].deDupe()  // [1, 2, 3, 4]
```

#### `.fill(value)` → `array`
Returns an array of the same length with every element set to `value`.

```javascript
log (1 to 3).fill("hi")  // ["hi", "hi", "hi"]
```

#### `.concat(other)` → same array type
Returns a new array with `other` appended. (Non-mutating; `++` does the same.)

```javascript
log [1, 2, 3].concat([4, 5, 6])  // [1, 2, 3, 4, 5, 6]
```

# Arrays - Transforming

Methods that produce a new array from an existing one. Lambdas use the arrow form
`param -> expression`.

#### `.map(fn)` → `array`
Applies `fn` to every element and collects the results.

```javascript
log [1, 2, 3].map(x -> x * 2)  // [2, 4, 6]
```

#### `.filter(fn)` → `array`
Keeps only the elements for which `fn` returns true.

```javascript
log [1, 2, 3, 4].filter(x -> x > 2)  // [3, 4]
```

#### `.sort()` → `array`
Returns the elements sorted ascending.

#### `.sortBy(key)` → `array`
Sorts an array of objects by the named field. Pass `"descending"` as a second argument to reverse.

```javascript
arr = [{name: "bob", age: 30}, {name: "alice", age: 25}]
log arr.sortBy("age").getKeys("name")               // ["alice", "bob"]
log arr.sortBy("age", "descending").getKeys("name") // ["bob", "alice"]
```

`.sortBy(fn)` also accepts an arrow function that returns the value to sort on.

#### `.reverse()` → `array`
Returns the elements in reverse order.

```javascript
log [3, 1, 2].sort().reverse()  // [3, 2, 1]
```

#### `.deDupe()` → `array`
Removes duplicate values, keeping first occurrences.

```javascript
log [1, 2, 2, 3, 1, 4].deDupe()  // [1, 2, 3, 4]
```

#### `.fill(value)` → `array`
Returns an array of the same length with every element set to `value`.

```javascript
log (1 to 3).fill("hi")  // ["hi", "hi", "hi"]
```

#### `.concat(other)` → `array`
Returns a new array with `other` appended. (Non-mutating; `++` does the same.)

```javascript
log [1, 2, 3].concat([4, 5, 6])  // [1, 2, 3, 4, 5, 6]
```

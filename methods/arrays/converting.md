# Arrays — Slicing & Converting

Take slices of an array or convert it to another shape.

#### `.left(n)` → `array`
The first `n` elements.

#### `.right(n)` → `array`
The last `n` elements.

```javascript
arr = [1, 2, 3, 4, 5]
log arr.left(2)   // [1, 2]
log arr.right(2)  // [4, 5]
```

#### `.clone()` → `array`
An independent deep copy. (Plain `=` shares a reference; `.clone()` does not.)

#### `.getKeys(field)` → `array`
For an array of objects, plucks `field` from each element.

```javascript
people = [{name: "alice"}, {name: "bob"}]
log people.getKeys("name")  // ["alice", "bob"]
```

#### `.toSet()` → `set`
Converts to a [`set`](../../packages/set.md) (unique values). Imports `osl/set`.

#### `.toEntriesObj()` → `object`
Treats the array as a list of `[key, value]` pairs and builds an object from them.

```javascript
log [["a", 1], ["b", 2]].toEntriesObj()  // {a: 1, b: 2}
```

Arrays also support the universal methods `.len` (a property), `.toStr()`, `.getType()`, `.item(i)` — see
[Type & conversion methods](../types/README.md).

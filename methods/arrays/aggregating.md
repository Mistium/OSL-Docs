# Arrays - Aggregating

Reduce an array to a single value. Numeric aggregates ignore non-numeric elements.

#### `.sum()` → `number`
Adds the numeric elements.

```javascript
log [1, 2, 3, 4, 5].sum()       // 15
log [1, "two", 3, null].sum()   // 4
```

#### `.product()` → `number`
Multiplies the numeric elements.

```javascript
log [1, 2, 3, 4].product()  // 24
```

#### `.average()` → `number`
The mean of the elements.

```javascript
log [1, 2, 3].average()  // 2
```

#### `.max()` → `number` / `.min()` → `number`
The largest / smallest element.

```javascript
arr = [3, 1, 4, 1, 5, 9, 2, 6]
log arr.max()  // 9
log arr.min()  // 1
```

#### `.join(sep)` → `string`
Joins the elements into a string separated by `sep`.

```javascript
log [1, 2, 3].join("-")  // "1-2-3"
```

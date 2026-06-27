# Arrays — Adding & Removing

These methods change the array **in place**. The mutating ones (`append`, `prepend`, `insert`,
`swap`) return `null`, so discard the result with `void` or just call them as a statement. `pop` and
`shift` return the removed element.

#### `.append(item)` — mutates
Adds `item` to the end.

#### `.prepend(item)` — mutates
Adds `item` to the front.

```javascript
arr = [2, 3]
void arr.append(4)   // arr is now [2, 3, 4]
void arr.prepend(1)  // arr is now [1, 2, 3, 4]
```

#### `.insert(index, item)` — mutates
Inserts `item` before position `index` (1-indexed).

```javascript
arr = [1, 3, 4]
void arr.insert(2, 2)  // arr is now [1, 2, 3, 4]
```

#### `.swap(i, j)` — mutates
Swaps the elements at positions `i` and `j` (1-indexed).

```javascript
arr = [1, 2, 3]
void arr.swap(1, 3)  // arr is now [3, 2, 1]
```

#### `.pop()` → `unknown`
Removes and returns the **last** element.

#### `.shift()` → `unknown`
Removes and returns the **first** element.

```javascript
arr = [1, 2, 3]
log arr.pop()  // 3, arr is now [1, 2]
```

#### `.delete(item)` → `unknown`
Removes `item` from the array.

#### `.trim(start, end)` → `array`
Returns the slice from position `start` to `end` (inclusive, 1-indexed).

```javascript
log [1, 2, 3, 4, 5].trim(2, 4)  // [2, 3, 4]
```

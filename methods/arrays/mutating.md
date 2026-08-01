# Arrays - Adding & Removing

These methods change the array **in place**. The mutating ones (`append`, `prepend`, `insert`,
`swap`) return the modified array. `pop` and `shift` return the removed element.

#### `.append(...items)` - mutates
Adds one or more items to the end.

#### `.prepend(item)` - mutates
Adds `item` to the front.

```javascript
arr = [2, 3]
void arr.append(4)   // arr is now [2, 3, 4]
void arr.prepend(1)  // arr is now [1, 2, 3, 4]
```

`append` and `prepend` return the same array reference, so they can be chained -
each call mutates the original array, and `pop`/`shift` can end the chain:

```javascript
arr = []
arr.append(1).append(2).append(3)  // arr is now [1, 2, 3]
log arr.append(4).pop()            // 4, arr is now [1, 2, 3]
```

#### `.insert(index, item)` - mutates
Inserts `item` before position `index` (1-indexed).

```javascript
arr = [1, 3, 4]
void arr.insert(2, 2)  // arr is now [1, 2, 3, 4]
```

#### `.swap(i, j)` - mutates
Swaps the elements at positions `i` and `j` (1-indexed).

```javascript
arr = [1, 2, 3]
void arr.swap(1, 3)  // arr is now [3, 2, 1]
```

#### `.pop()` → element type
Removes and returns the **last** element.

#### `.shift()` → element type
Removes and returns the **first** element.

```javascript
arr = [1, 2, 3]
log arr.pop()  // 3, arr is now [1, 2]
```

#### `.delete(index)` → `array`
Removes the item at 1-based `index` and returns the modified array. Note this takes an index, not an item to search for — a non-numeric argument casts to `0` and is a silent no-op.

```javascript
log ["a", "b", "c"].delete(2)  // ["a", "c"]
```

#### `.trim(start, end)` → `array`
Returns the slice from position `start` to `end` (inclusive, 1-indexed).

```javascript
log [1, 2, 3, 4, 5].trim(2, 4)  // [2, 3, 4]
```

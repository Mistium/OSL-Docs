# Array Methods

Arrays in OSL are **1-indexed** - the first element is at index 1. Index `0` and out-of-range
indices return `null`; negative indices count from the end (`arr[-1]` is the last element).

```javascript
arr = [10, 20, 30, 40, 50]
log arr[1]    // 10
log arr[-1]   // 50
log arr.len   // 5
```

## Creating arrays

```javascript
arr = [1, 2, 3]          // literal
arr = 1 to 5             // range → [1, 2, 3, 4, 5]
arr = -2 to 2            // [-2, -1, 0, 1, 2]
arr = (1 to 3).fill("x") // ["x", "x", "x"]
arr = [1, 2] ++ [3, 4]   // concatenate → [1, 2, 3, 4]
```

## In this section

- **[Transforming](transforming.md)** - `map`, `filter`, `sort`, `sortBy`, `reverse`, `deDupe`,
  `fill`, `concat`.
- **[Adding & Removing](mutating.md)** - `append`, `prepend`, `insert`, `swap`, `pop`, `shift`,
  `delete`, `trim`.
- **[Searching & Testing](searching.md)** - `contains`, `index`, `lastIndex`, `some`, `every`,
  `first`, `last`, `randomOf`.
- **[Aggregating](aggregating.md)** - `sum`, `product`, `average`, `max`, `min`, `join`.
- **[Slicing & Converting](converting.md)** - `left`, `right`, `clone`, `getKeys`, `toSet`,
  `toEntriesObj`.

## Custom array methods

You can attach your own methods to all arrays via a prototype, using `self` for the receiver:

```javascript
Array.double = def() -> (
  return self.map(x -> x * 2)
)

log [1, 2, 3].double()  // [2, 4, 6]
```

## Notes

- Methods that modify in place (`append`, `prepend`, `insert`, `swap`) return the modified array.
- Equality in `contains` / `index` is strict: `[1].contains("1")` is `false`.

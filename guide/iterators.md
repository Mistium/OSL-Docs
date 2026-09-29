# Iterators and generators

An iterator hands out values one at a time, only when a loop asks for the next one. That makes it
possible to describe long or even endless sequences without building them in memory.

## Generators

A function that returns `iter<T>` and uses `yield` is a generator. Each `yield` hands one value to
the loop that is reading it:

```osl
def evens(int limit) iter<int> (
  for i limit (
    if i % 2 == 0 ( yield i )
  )
)

for n in evens(10) (
  log n
)
```

The generator's body only runs while the loop keeps asking for values. When the loop stops early
with `break`, the generator stops too, so an endless generator is safe:

```osl
def naturals() iter<int> (
  int n = 0
  while true (
    n += 1
    yield n
  )
)

for n in naturals() (
  if n > 3 break
  log n
)
```

End a generator early with a bare `return`. A generator cannot `return` a value; use `yield`
instead. `for i, value in iterator` also works and counts from 1, like array loops.

## Iterator chains

Call `.iter()` on an array to get an iterator over its items, then chain lazy steps. Nothing runs
until the chain is looped over or collected:

```osl
int[] scores = [10, 60, 80, 90, 55]
int[] best = scores.iter()
  .filter(s -> s > 50)
  .map(s -> s * 2)
  .take(3)
  .toArray()
log best
```

| Method | Returns | Notes |
| --- | --- | --- |
| `filter(fn)` | `iter<T>` | Keeps values for which `fn` returns `true`. |
| `map(fn)` | `iter<U>` | Transforms each value. |
| `take(count)` | `iter<T>` | Stops after `count` values. |
| `skip(count)` | `iter<T>` | Skips the first `count` values. |
| `toArray()` | `T[]` | Collects every value into an array. |
| `count()` | `int` | Counts the values. |

Iterators are ordinary values, so they can be stored in `iter<T>` variables and passed to
functions:

```osl
def total(iter<int> values) int (
  int sum = 0
  for v in values (
    sum += v
  )
  return sum
)

log total([1, 2, 3].iter())
```

An iterator can be read once. Call the generator again, or call `.iter()` again, to start over.

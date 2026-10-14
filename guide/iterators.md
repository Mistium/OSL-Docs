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

## Iterators from packages

Packages return `iter<T>` for anything streamed, lazy, or potentially large, and `for ... in` works
on them like on a generator:

```osl
import "std:fs"

fs.writeFile("notes.txt", "one\ntwo\nthree")
for line in fs.lines("notes.txt") (
  log line
)

for i, entry in fs.walkTree(".") (
  if i > 3 break
  log entry.path
)
```

Examples include `fs.lines(path)` and `file.lines()`, `fs.walkTree(path)`, a channel's
`values()` in [`thread`](../packages/thread.md), and a `requests` stream's `lines()` and
`events()`. A package iterator can be typed (`iter<string>`) and chained like any other.

`fs.lines` returns `result<iter<string>, error>`, because opening the file can fail; `for ... in`
unwraps it and throws the error, such as `NotFoundError`, before the loop starts. An error while
reading throws from the loop that is iterating.

An iterator that reads from a stream, such as a file's lines, a channel, or an HTTP response, reads
the stream as it goes and can't start over: a second read continues where the first stopped.
Call the package function again to read from the start.

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
| `done()` | `boolean` | Reports whether the iterator yields no values. |
| `next()` | `result<T, error>` | Returns the next value, advancing the iterator. |

Any array method can be called on an iterator directly. The iterator is collected with
an implicit `.toArray()` first, so a lazy chain can end in an eager summary:

```osl
def naturals() iter<int> (
  int n = 0
  while true (
    n += 1
    yield n
  )
)

log naturals().take(100).sum()
```

`.len` on an iterator counts its values, like `count()`. Once a cursor is attached, both
report what remains. Calling `.iter()` on
an iterator has no effect, so the compiler warns about it; remove the
extra call.

`next()` pulls one value at a time in O(1), returning `result<T, error>`: `ok` with the
value, or a `StateError` with the message `iterator is done` once exhausted. Assigning an iterator shares its
cursor rather than copying it.

Reads without `next()` or `done()` re-run the sequence from the start, so plain loops and
`toArray()` stay cheap. Calling `next()` or `done()` attaches a cursor instead: from then
on, every read of that iterator - loops, chains, collections, further `next()` calls -
continues from the cursor.

```osl
def upTo(int limit) iter<int> (
  for i limit (
    yield i
  )
)

iter<int> it = upTo(3)
while !it.done() (
  log it.next().unwrap()
)
```

`done()` peeks without consuming, so it stays safe to call any time. Once a cursor is
attached, collecting the iterator twice yields the remaining values the first time and
nothing the second; call the generator or `.iter()` again to start over.

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

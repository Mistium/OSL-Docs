---
description: Produce values one at a time with generators, and build lazy chains that only do the work you use.
lesson: 17
---

# Iterators

An array holds all its values at once. An iterator hands them out one at a time, only when asked. That lets you describe sequences too long to store, or even endless ones, and lets a chain of steps stop as soon as it has what it needs.

## Generators

A function that returns `iter<T>` and uses `yield` is a generator. Each `yield` hands one value to whoever is reading:

```osl
def countdown(int from) iter<int> (
  int n = from
  while n > 0 (
    yield n
    n--
  )
)

for n in countdown(3) (
  log n
)
log "liftoff"
```

```output
3
2
1
liftoff
```

The generator's code runs only while the loop asks for more. It pauses at each `yield` and carries on from there next time.

## Endless sequences

Because values are made on demand, a generator can go on forever. The loop decides when to stop:

```osl
def fibonacci() iter<int> (
  int a = 0
  int b = 1
  while true (
    yield a
    int next = a + b
    a = b
    b = next
  )
)

for i, n in fibonacci() (
  if i > 10 break
  log n
)
```

```output
0
1
1
2
3
5
8
13
21
34
```

When the loop breaks, the generator stops too, so nothing runs forever.

## Lazy chains

`.iter()` on an array gives an iterator over its items. `filter`, `map`, `take` and `skip` on an iterator don't do anything yet: they describe steps. The work happens when you loop over the chain or collect it with `.toArray()`:

```osl
def naturals() iter<int> (
  int n = 0
  while true (
    n++
    yield n
  )
)

int[] squares = naturals().map(n -> n * n).filter(n -> n % 2 == 1).take(5).toArray()
log squares
log naturals().take(100).sum()
```

```output
[1,9,25,49,81]
5050
```

`naturals()` never ends, but `take(5)` stops the chain after five values, so only the work needed for those five is done. Array methods such as `sum` work on an iterator too, collecting it first.

| Method | Does |
| --- | --- |
| `filter(fn)` | keeps values `fn` says `true` for |
| `map(fn)` | transforms each value |
| `take(n)` | stops after `n` values |
| `skip(n)` | drops the first `n` values |
| `toArray()` | collects everything into an array |
| `count()` | counts the values |
| `next()` | gives the next value as a result, `err` when there are no more |
| `done()` | says whether there's nothing left |

## One at a time with next

`next()` pulls a single value. It returns a [result](errors.md), because the iterator might be finished:

```osl
def letters() iter<string> (
  yield "a"
  yield "b"
)

iter<string> it = letters()
log it.next().unwrap()
log it.done()
log it.next().unwrap()
log it.done()
log it.next().isErr()
```

```output
a
false
b
true
true
```

## When to use iterators

Plain arrays are simpler and are the right choice most of the time. Reach for an iterator when the sequence is long or endless, when each value is expensive to compute and you might not need them all, or when you're reading something piece by piece, such as the lines of a large file.

:::quiz
`def nums() iter<int>` yields 1, 2, 3, … forever. Which line finishes?

- [ ] `log nums().toArray()`
- [x] `log nums().take(3).toArray()`
- [ ] `log nums().count()`

`take(3)` stops after three values. The other two try to collect an endless sequence.
:::

:::exercise title="Primes"
Finish `primes`, a generator of prime numbers, so the program prints the first eight.

```osl
def isPrime(int n) boolean (
  if n < 2 return false
  int d = 2
  while d * d <= n (
    if n % d == 0 return false
    d++
  )
  return true
)

def primes() iter<int> (
  yield 2
)

log primes().take(8).toArray()
```

```output
[2,3,5,7,11,13,17,19]
```

> [!hint]
> Count up from 2 forever with `while true`, and `yield` each number that `isPrime` accepts.

```osl solution
def isPrime(int n) boolean (
  if n < 2 return false
  int d = 2
  while d * d <= n (
    if n % d == 0 return false
    d++
  )
  return true
)

def primes() iter<int> (
  int n = 2
  while true (
    if isPrime(n) (
      yield n
    )
    n++
  )
)

log primes().take(8).toArray()
```
:::

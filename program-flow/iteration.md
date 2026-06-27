# Iteration

## `loop`

`loop` repeats a block a fixed number of times.

```js
loop 3 (
  log "tick"
)
```

The count is evaluated **once** before the loop starts, so mutating any variable
it depends on inside the body does not change how many times the body runs.

```js
n = 3
loop n (
  n = n + 1 // does not extend the loop
)
// runs exactly 3 times
```

## `for` Counted Loops

Use `for name count` when you need a one-based counter.

```js
for i 3 (
  log i
)
// 1
// 2
// 3
```

Like `loop`, the count is evaluated once before the first iteration; changing a
variable it was computed from inside the body has no effect on the iteration count.

## `for ... in`

`for ... in` iterates over values. With two variable names, the first receives
the one-based index or object key and the second receives the value.

```js
for value in [10, 20, 30] (
  log value
)
// 10
// 20
// 30

for i, value in ["a", "b"] (
  log i ++ ":" ++ value
)
// 1:a
// 2:b
```

Ranges also work with `for ... in`:

```js
for value in 1 to 5 (
  log value
)
```

## `for ... of`

`for ... of` iterates over keys or one-based indexes. With two variable names,
the first receives the index/key and the second receives the value.

```js
for i of ["a", "b", "c"] (
  log i
)
// 1
// 2
// 3

for i, value of ["a", "b"] (
  log i ++ ":" ++ value
)
// 1:a
// 2:b
```

The old `each` keyword has been removed. Use `for ... in` for values or
`for ... of` for indexes and keys.

## `break` and `continue`

Use `break` to exit a loop early and `continue` to skip to the next iteration.

```js
for value in [1, 2, 3, 4] (
  if value == 3 (
    break
  )
  log value
)
// 1
// 2
```

```js
for value in [1, 2, 3, 4] (
  if value == 3 (
    continue
  )
  log value
)
// 1
// 2
// 4
```

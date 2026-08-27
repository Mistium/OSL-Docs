# Control flow

OSL uses parentheses for statement blocks.

## Conditions

```osl
if score >= 90 (
  log "A"
) else if score >= 80 (
  log "B"
) else (
  log "C or below"
)
```

A one-statement guard may stay on one line:

```osl
if user == null return {error: "User not found"}
if message == null continue
if complete break
```

`return`, `continue`, and `break` are the supported inline guard bodies. Use a block for anything else.

## Boolean operators

Use `and`, `or`, and the `!` prefix:

```osl
boolean allowed = authenticated and !banned
```

`and` and `or` short-circuit. `??` checks only for `null`, so it preserves `false`, `0`, and an empty string.

```osl
string display = nickname ?? username
```

## Counted loops

`for name count` counts from `1` through the evaluated count:

```osl
for index 3 (
  log index
)
```

This logs `1`, `2`, and `3`. The compiler evaluates the bound once.

`loop count` repeats a block without declaring an index:

```osl
loop 3 (
  retry()
)
```

## Collection loops

`in` yields values. With two names it yields the 1-based position and value:

```osl
for name in names (
  log name
)

for index, name in names (
  log index ++ ": " ++ name
)
```

`of` yields positions for arrays and strings, or keys for objects:

```osl
for index of names (
  log names[index]
)
```

Use `_` when you do not need one side of a two-value loop:

```osl
for _, value in records (
  process(value)
)
```

## `while` and `until`

```osl
while queue.len > 0 (
  handle(queue.shift())
)

until ready (
  wait 10
)
```

## `match`

`match` is an expression. A non-enum match requires an `_` arm:

```osl
string label = match status (
  200 -> "ok"
  404 -> "missing"
  _ -> "error"
)
```

An arm may use a block and return a value:

```osl
string label = match status (
  200 -> "ok"
  _ -> (
    log "unexpected status"
    return "error"
  )
)
```

Use `match` for new code. `switch` also exists for command-style fallthrough cases, but it is easier to get wrong because cases continue until `break`.

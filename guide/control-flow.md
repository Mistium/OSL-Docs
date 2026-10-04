# Control flow

OSL uses parentheses for statement blocks. A block's opening `(` belongs on the same line as the statement that owns it. A header expression may span lines inside its own brackets, so a multi-line collection literal can end on the opener's line:

```osl
for update in [
  {a: 1},
  {b: 2}
] (
  log update
)
```

Moving the opener onto its own line, as in `if ready` followed by `(` on the next line, is a compile error.

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

`else` and `else if` may also start their own line after the closing `)`.

To choose a value rather than run statements, use an `if` expression:
`string grade = if score >= 90 then "A" else "B"`. See
[conditional expressions](operators.md#ranges-and-conditional-expressions).

A one-statement guard may stay on one line:

```osl
if user == null return {error: "User not found"}
if message == null continue
if complete break
```

`return`, `continue`, and `break` are the supported inline guard bodies. Use a block for anything else.

Use `==` to compare inside a condition. A single `=` assigns, so `if x = 5 (` is a compile error that points at the `=`.

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

This logs `1`, `2`, and `3`. The compiler evaluates the bound once. Use `for _ count (...)` when you do not need the index. This emits a Go range loop without an index variable.

`loop count` repeats a block without declaring an index:

```osl
loop 3 (
  retry()
)
```

`loop` evaluates its count once, including counts returned by functions. Integer counts retain their
type, so `loop` accepts fixed-width bounds such as `int64` without converting them to `number` or
narrowing them to `int`. Zero and negative integer counts skip the body. Changing the count variable
inside the body does not change the number of iterations.

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

Loop names belong to their loop body and may shadow an outer name. Each loop infers its value type from its own collection; reusing a name in a later loop does not convert its elements to an earlier type. After a nested loop, the outer binding is available again. This applies to counted loops and the `loop index value array` form as well.

Homogeneous array literals keep their element type inside the loop, just like named typed arrays. Numeric and string literals can be passed directly to functions that expect those types.

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

`match` is an expression that supports compile-time exhaustiveness checking. Enums and booleans require all variants/values to be covered, or an explicit `_` wildcard arm. Open scalar values (such as integers or strings) require an `_` wildcard arm:

```osl
bool flag = true
string state = match flag (
  true -> "enabled"
  false -> "disabled"
)

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

On a dynamic subject, `match` and `switch` treat whole numbers as equal across `int` and `number`, so a JSON value `2` matches `case 2`. A case whose type can never match a typed subject is a compile error.

Use `match` for new code. `switch` also exists for command-style fallthrough cases, but it is easier to get wrong because cases continue until `break`.

## Assignments in conditional branches

Put an assignment in a parenthesized block:

```osl
string field = "author"
string[] required = []
if field == "author" (
  required = ["name"]
)
```

`if field == "author" required = ["name"]` is not a supported blockless statement. The diagnostic explains the block syntax and distinguishes assignment with `=` from comparison with `==`.

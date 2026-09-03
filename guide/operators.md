# Operators

## Arithmetic

| Operator | Operation |
| --- | --- |
| `+` | Addition, or string concatenation when both operands are strings |
| `-` | Subtraction |
| `*` | Multiplication or repetition |
| `/` | Division |
| `%` | Remainder |
| `^` | Power |

OSL evaluates mixed arithmetic operators from left to right. It does not apply the usual multiplication-before-addition rule.

```osl
number wrong = 10 + 2 * 3
number right = 10 + (2 * 3)
```

The first expression is `(10 + 2) * 3`. The compiler warns about unparenthesized mixed arithmetic. Parenthesize the intended grouping, especially for time, sizes, and persisted values.

The compiler rejects integer overflow when both operands are known. Arithmetic whose values are
only available at runtime keeps the same checked operations and raises an overflow error instead of
wrapping. A divisor that the compiler knows is zero is also a compile error.

String repetition rejects a count that the compiler knows is negative.

## Concatenation and merge

`++` converts operands to strings when used with scalar values. It merges arrays or objects when both sides are collections.

```osl
string label = "count: " ++ count
int[] values = [1, 2] ++ [3]
object options = defaults ++ overrides
```

## Comparison

| Operator | Meaning |
| --- | --- |
| `==`, `!=` | Loose equality and inequality |
| `===`, `!==` | Strict equality and inequality |
| `<`, `<=`, `>`, `>=` | Ordering |
| `in`, `!in` | Membership |
| `of` | Membership alias in expressions, position iteration in loops |

Loose string equality is case-insensitive and may coerce values. Use `===` when case and runtime type matter.

## Boolean and nullish operators

```osl
boolean valid = ready and !failed
string selected = primary ?? fallback
```

`and` and `or` return according to OSL truthiness and short-circuit. `??` only falls back for `null`. `??=` assigns only when the current value is `null`.

The null coalescing operator `??` narrows types:
- If the left operand is a nullable type `T?` (or an indexed map lookup `map[key]`) and the fallback is non-nullable `T`, the resulting expression is inferred as non-nullable `T` (e.g. `string[object] m; object val = m["k"] ?? {}`).
- If either side is `any`, the expression resolves to `any`.
- If the right side is non-nullable, the compiler proves the expression can never evaluate to `null`.

Logical operators have precedence rules, with `and` binding more tightly than `or`. The compiler warns when different logical operators are mixed without parentheses. Parenthesize the intended grouping when an expression uses both.

## Ranges and the ternary form

`start to end` creates an inclusive integer range in either direction.

```osl
int[] forward = 1 to 3
int[] backward = 3 to 1
```

The ternary form has no colon:

```osl
string label = ready ? "ready" "waiting"
```

## Pipe and bitwise operators

`|>` sends the left value to a one-argument function:

```osl
log 10 |> double |> format
```

Bitwise operators are `&`, `|`, `^^`, `<<`, and `>>`. Shift counts cannot be negative. The compiler
rejects a negative count when it can prove the value, including a known variable. Dynamic counts
remain checked by Go at runtime.

## Regular-expression literals

Prefix a backtick string with `$` to create a regular expression. Flags follow the closing backtick:

```osl
auto digits = $`\d+`
log digits.test("item-42")
log $`hello`i.test("HELLO")
```

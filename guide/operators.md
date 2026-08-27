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

Integer overflow raises an error. A divisor that the compiler knows is zero is a compile error.

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
any selected = primary ?? fallback
```

`and` and `or` return according to OSL truthiness and short-circuit. `??` only falls back for `null`. `??=` assigns only when the current value is `null`.

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

Bitwise operators are `&`, `|`, `^^`, `<<`, and `>>`.

## Regular-expression literals

Prefix a backtick string with `$` to create a regular expression. Flags follow the closing backtick:

```osl
auto digits = $`\d+`
log digits.test("item-42")
log $`hello`i.test("HELLO")
```

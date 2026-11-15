---
description: Every operator in one place, including the two OSL rules that surprise people: left-to-right maths and loose string equality.
lesson: 18
---

# Operators

You've met most operators along the way. This lesson collects them, and spells out the two places where OSL deliberately differs from other languages.

## Arithmetic, left to right

| Operator | Does | Example |
| --- | --- | --- |
| `+` `-` `*` | add, subtract, multiply | `2 * 3` is `6` |
| `/` | divide exactly | `7 / 2` is `3.5` |
| `%` | remainder | `7 % 2` is `1` |
| `^` | power | `2 ^ 10` is `1024` |
| `*` on a string | repeat | `"ab" * 3` is `"ababab"` |

OSL evaluates mixed arithmetic **from left to right**. It doesn't do multiplication before addition:

```osl
log 10 + 2 * 3
log 10 + (2 * 3)
```

That first line also earns a `PrecedenceWarning` from the compiler; click into the example to see it.

```output
36
16
```

The first line is `(10 + 2) * 3`. This is a deliberate choice: one simple rule instead of a precedence table to remember. The compiler warns whenever you mix operators without brackets, so you're never caught out silently. Bracket what you mean.

## Joining

| Operator | Does |
| --- | --- |
| `++` | joins as text, or merges two arrays or two objects |
| `+` on two strings | joins them |

```osl
log "n = " ++ 4
log [1, 2] ++ [3]
log {a: 1} ++ {b: 2}
```

```output
n = 4
[1,2,3]
{"a":1,"b":2}
```

## Comparison

| Operator | Means |
| --- | --- |
| `==` `!=` | equal, not equal (loose) |
| `===` `!==` | equal, not equal (strict) |
| `<` `<=` `>` `>=` | ordering |
| `in` | is a member of |

Loose equality compares strings **without case**, and lets numbers and numeric text meet. Strict equality wants the same type and the same characters:

```osl
log "Yes" == "yes"
log "Yes" === "yes"
log [1, 2] == [1, 2]
log 3 in [1, 2, 3]
log "b" in "abc"
```

```output
true
false
true
true
true
```

Arrays and objects compare by their contents. Class instances compare by identity: two different instances are never equal, even if their fields match.

## Logic

| Operator | Means |
| --- | --- |
| `and` | both |
| `or` | either |
| `!` | not |
| `??` | the left side, or the right side if the left is `null` |

`and` and `or` stop as soon as they know the answer, so the right side may never run. When you mix `and` and `or`, bracket them; the compiler warns if you don't.

## Assignment

Every arithmetic and joining operator has an assigning form: `+=`, `-=`, `*=`, `/=`, `%=`, `^=` and `++=`. `x++` and `x--` add or take one. Two more deal with `null`:

```osl
string? name = null
name ??= "guest"
log name

string? stored = "kept"
string? edit = null
stored =?? edit
log stored
```

```output
guest
kept
```

- `a ??= b` sets `a` to `b` only if `a` is `null`.
- `a =?? b` sets `a` to `b` only if `b` is not `null`, which is handy for applying optional changes.

## Ranges, choices and pipes

| Form | Gives |
| --- | --- |
| `1 to 5` | the array `[1,2,3,4,5]`, both ends included |
| `if c then a else b` | `a` or `b` depending on `c` |
| `x \|> f` | `f(x)` |

## Bits

`&` and, `|` or, `^^` exclusive or, `<<` and `>>` shift. These work on whole numbers.

```osl
log 12 & 10
log 12 | 10
log 12 ^^ 10
log 1 << 4
```

```output
8
14
6
16
```

## Pointers

`@name` makes a pointer to a variable, so a function can change the variable itself. [`std:ptr`](../packages/ptr.md) reads and writes through it. This is rare in everyday code and mostly matters when working with Go libraries:

```osl
import "std:ptr"

def bump(*int n) (
  ptr.set(n, ptr.deref(n) + 1)
)

int count = 1
bump(@count)
log count
```

```output
2
```

:::quiz
What does `log 2 + 3 * 4` print?

- [ ] `14`
- [x] `20`

Left to right: `(2 + 3) * 4`. Write `2 + (3 * 4)` for 14.
:::

:::quiz
What is `"OSL" == "osl"`?

- [x] `true`
- [ ] `false`

`==` ignores case for strings. `===` doesn't.
:::

:::exercise title="Fix the formula"
The area of a ring is π times the outer radius squared, minus π times the inner radius squared. This program prints the wrong number because of left-to-right evaluation. Add brackets so it prints the right area, rounded.

```osl
number pi = 3.14159
number outer = 5
number inner = 3

log round(pi * outer ^ 2 - pi * inner ^ 2)
```

```output
50
```

> [!hint]
> Bracket each term: `(pi * (outer ^ 2))` and the same for the inner radius.

```osl solution
number pi = 3.14159
number outer = 5
number inner = 3

log round((pi * (outer ^ 2)) - (pi * (inner ^ 2)))
```
:::

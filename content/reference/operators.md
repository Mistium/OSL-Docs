---
description: Every operator with its precedence and associativity, and an example of each: arithmetic, comparison, logic, bits, assignment, null handling, ranges and pointers.
---

# Operators

```osl
log 7 / 2 7 % 2 2 ^ 10
log "ab" ++ 1 "ab" * 2
log "Yes" == "yes" "Yes" === "yes"
log true and !false
log 1 to 4
log null ?? "fallback"
log (10 + 2) * 3
```

```output
3.5 1 1024
ab1 abab
true false
true
[1,2,3,4]
fallback
36
```


Arithmetic runs strictly left to right, so `10 + 2 * 3` is `(10 + 2) * 3`. See [precedence](#precedence).

## Arithmetic

| Operator | Does | Example | Gives |
| --- | --- | --- | --- |
| `+` | add; joins two strings | `2 + 3` | `5` |
| `-` | subtract; unary minus | `5 - 3`, `-x` | `2` |
| `*` | multiply; repeat a string | `2 * 3`, `"ab" * 3` | `6`, `ababab` |
| `/` | divide exactly (always a `number`) | `7 / 2` | `3.5` |
| `%` | remainder, sign of the left side | `-7 % 4` | `-3` |
| `^` | power | `2 ^ 10` | `1024` |

There is no integer division: `//` starts a comment. Use `floor(a / b)`.

```osl
log 2 + 3 5 - 3 2 * 3
log 7 / 2 floor(7 / 2)
log 7 % 4 -7 % 4
log 2 ^ 10 2 ^ 0.5
log "ab" * 3
log -(3 + 4)
```

```output
5 2 6
3.5 3
3 -3
1024 1.4142135623730951
ababab
-7
```


## Strings, arrays and objects

| Operator | Does | Gives |
| --- | --- | --- |
| `a ++ b` | joins as text, turning other values into text | `"n=" ++ 3` is `n=3` |
| `[1] ++ [2]` | joins arrays | `[1,2]` |
| `{a: 1} ++ {b: 2}` | merges objects, right side wins | `{"a":1,"b":2}` |
| `s * n` | repeats a string | `"ab" * 2` is `abab` |
| `...x` | spreads an array or object into a literal or a call | `[...a, 4]` |
| `x in c` | `true` if `c` holds `x` (item, key or substring) | `"b" in "abc"` |

```osl
log "n=" ++ 3 ++ true
log [1, 2] ++ [3]
log {a: 1} ++ {a: 2, b: 3}
int[] a = [1, 2]
log [...a, 3] {...{x: 1}, y: 2}
log 2 in a "b" in "abc" "k" in {k: 1}
```

```output
n=3true
[1,2,3]
{"a":2,"b":3}
[1,2,3] {"x":1,"y":2}
true true true
```


## Comparison

| Operator | Means |
| --- | --- |
| `==` `!=` | equal, not equal; **strings compare ignoring case**; `is` is another spelling of `==` |
| `===` `!==` | strictly equal: same type, same characters |
| `<` `>` `<=` `>=` | ordering; strings compare alphabetically |
| `!<` `!>` | not less, not greater |
| `in` `!in` | is, is not, a member |

Arrays and objects compare by contents. Class instances compare by identity unless the class defines `==`. Comparing a number with text warns: convert one side first.

```osl
log "Yes" == "yes" "Yes" === "yes" "a" != "A"
log [1, 2] == [1, 2] {a: 1} == {a: 1}
log 3 < 4 3 >= 4 3 !< 4 "apple" < "banana"
log 3 !in [1, 2] 3 !== "3"
```

```output
true false false
true true
true false false true
true true
```


## Logic

| Operator | Means |
| --- | --- |
| `and` | both (stops at the first false) |
| `or` | either (stops at the first true) |
| `xor` | exactly one |
| `nand` `nor` `xnor` | not and, not or, not xor |
| `!` | not (there is no `not`) |

These take booleans. Bracket a mix of `and` and `or`: the compiler warns about it.

```osl
boolean a = true
boolean b = false
log a and b a or b a xor b a nand b a nor b a xnor b
log !a !b
log a and (b or a)
```

```output
false true true true false false
false true
true
```


## Bits

These work on whole numbers.

| Operator | Does | Example | Gives |
| --- | --- | --- | --- |
| `&` | and | `12 & 10` | `8` |
| `\|` | or | `12 \| 10` | `14` |
| `^^` | exclusive or (`^` is power) | `12 ^^ 10` | `6` |
| `~` | flip every bit | `~5` | `-6` |
| `<<` | shift left | `1 << 4` | `16` |
| `>>` | shift right, keeping the sign | `-16 >> 2` | `-4` |
| `>>>` | unsigned shift (32 bit) | `256 >>> 4` | `16` |

```osl
log 12 & 10 12 | 10 12 ^^ 10 ~5
log 1 << 4 -16 >> 2 256 >>> 4
```

```output
8 14 6 -6
16 -4 16
```


## Assignment

| Operator | Does |
| --- | --- |
| `=` | assign |
| `+=` `-=` `*=` `/=` `%=` `^=` | do the operation, then assign |
| `++=` | join, then assign (strings, arrays) |
| `x++` `x--` | add or take one |
| `a ??= b` | assign `b` if `a` is `null` |
| `a =?? b` | assign `b` only if `b` is not `null` |

Assignment is a statement: it can't be used inside an expression.

```osl
int x = 5
x += 2
x *= 3
x -= 1
x++
x--
x %= 7
x ^= 2
log x
string s = "a"
s ++= "b"
s += "c"
log s
string? name = null
name ??= "guest"
string? stored = "kept"
string? edit = null
stored =?? edit
log name stored
```

```output
36
abc
guest kept
```


## Null handling

| Operator | Does |
| --- | --- |
| `a ?? b` | `a`, or `b` if `a` is `null`; chains: `a ?? b ?? c` |
| `x.<T>(fallback)` | `x` as `T`, or `fallback` if it isn't one |

There is no optional chaining (`?.`): check `o.x != null`, or use `??`. A missing object key reads as `null`.

```osl
object o = {a: 1}
log o.b ?? "none"
log o.b ?? o.c ?? 42
int? n = null
log (n ?? 0) + 1
```

```output
none
42
1
```


## Ranges

`a to b` is the array of whole numbers from `a` to `b``, both included, counting down if `a` is larger. It has the lowest precedence of the arithmetic operators, so `1 to n + 1` ends at `n + 1`.

```osl
log 1 to 5 5 to 1
int n = 3
log 1 to n + 1
for i in 1 to 3 ( log i )
```

```output
[1,2,3,4,5] [5,4,3,2,1]
[1,2,3,4]
1
2
3
```


## Choosing and piping

| Form | Does |
| --- | --- |
| `if c then a else b` | gives `a` or `b`; there is no `c ? a : b` |
| `x \|> f` | calls `f(x)`; chains left to right |
| `x -> expr` | a lambda; see [Syntax](syntax.md#lambdas) |

```osl
def double(int n) int -> n * 2
def addOne(int n) int -> n + 1
log 5 |> double |> addOne
log if 5 > 3 then "yes" else "no"
```

```output
11
yes
```


## Member access, calls and the result operator

| Form | Does |
| --- | --- |
| `o.key`, `o["key"]` | reads a key; `null` if missing |
| `a[n]`, `a[from:to]` | an item or a slice (positions start at 1) |
| `f(x)`, `o.method(x)` | calls; no space before the bracket |
| `x.<T>` | type assertion |
| `x!` | on a `result`: its value, or return the error from the function |
| `x catch ...` | handle a failed `result`; see [Syntax](syntax.md#throw-and-try) |
| `@x` | a pointer to variable `x`; `*T` is the pointer type |

```osl
import "std:ptr"
import "std:result"
def half(int n) result<int, error> (
  if n % 2 != 0 return result.err(error("odd"))
  return result.ok(n / 2)
)
def quarter(int n) result<int, error> (
  int h = half(n)!
  return half(h)
)
log quarter(8).unwrap() quarter(6).isErr()
int count = 1
auto p = @count
ptr.set(p, 5)
log count ptr.deref(p)
```

```output
2 true
5 5
```


## Operator methods

A class can define `+ - * / % ^ ==` and `<=>` (which gives `< > <= >=`), and unary `-`, with `def +(Vec other) Vec ( ... )`. `===`, `!=`, `++` and the ordering operators themselves can't be defined. See [Syntax](syntax.md#classes).

## Precedence

From loosest to tightest. Operators in one row share a level.

| Level | Operators | Associativity |
| --- | --- | --- |
| 1 | `=` `+=` and the other assignments | right |
| 2 | `->` | right |
| 3 | `if ... then ... else` | right |
| 4 | `or` `nor` `xor` | left |
| 5 | `and` `nand` | left |
| 6 | `\|` | left |
| 7 | `^^` `xnor` | left |
| 8 | `&` | left |
| 9 | `==` `!=` `===` `!==` | left |
| 10 | `<` `>` `<=` `>=` `!<` `!>` `in` `!in` `is` | left |
| 11 | `to` | left |
| 12 | `\|>` | left |
| 13 | `??` `catch` | left |
| 14 | `<<` `>>` `>>>` | left |
| 15 | `+` `-` `*` `/` `%` `^` `++` | left, **all equal** |
| 16 | unary `!` `-` `~` `@` | right |
| 17 | postfix `x!` `x++` `x--`, calls, `.`, `[ ]` | left |

Level 15 is the surprise: `*` does not bind tighter than `+`, and `^` is left to right, so `2 ^ 3 ^ 2` is 64. The compiler warns when you mix arithmetic operators without brackets.

```osl
log (10 + 2) * 3
log 10 + (2 * 3)
log 2 ^ 3 ^ 2
log 2 ^ (3 ^ 2)
log 10 - 2 - 3
```

```output
36
16
64
512
5
```


> [!warning] Bracket arithmetic
> Write `a + (b * c)` whenever you mix operators. It is what you mean, and it silences the warning.

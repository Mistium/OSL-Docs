---
description: Numbers, text and truth; values that might be missing; converting between types; and naming your own.
lesson: 3
---

# Types

Every value in OSL has a type, and the compiler knows most of them before the program runs. That's how it catches `int score = "ten"` without running anything. This lesson tours the types you'll meet every day and how to move values between them.

## Whole numbers and decimals

`int` holds whole numbers and `number` holds numbers with a fractional part. A literal with a decimal point is a `number`; one without is an `int`:

```osl
int apples = 7
number price = 0.35
log apples * price
log 7 / 2
log floor(7 / 2)
log 7 % 2
log 2 ^ 10
```

```output
2.4499999999999997
3.5
3
1
1024
```

`/` always divides exactly, so `7 / 2` is `3.5`. `floor` drops the fraction, `%` gives the remainder and `^` raises to a power. The first line shows the usual floating-point rounding every language has: `round` and friends tidy it up.

```osl
number total = 7 * 0.35
log round(total)
log total.round()
log floor(2.9) ceil(2.1) abs(-4)
```

```output
2
2
2 3 4
```

An `int` fits where a `number` is expected, but not the other way round, because that would silently drop the fraction. Convert on purpose with `.toInt()`:

```osl
number average = 4.8
int stars = average.toInt()
log stars
```

```output
4
```

> [!note] Sized numbers
> When you need a particular size, as with binary formats or Go libraries, OSL also has `int8` to `int64`, `uint8` to `uint64`, `byte` and `float32`/`float64`. Plain `int` and `number` are right for everything else.

## Text and truth

`string` is text and `boolean` is `true` or `false`. Comparisons produce booleans, `and` and `or` combine them, and `!` flips one:

```osl
int age = 17
boolean adult = age >= 18
log adult
log !adult
log age > 12 and age < 20
```

```output
false
true
true
```

Strings have a lesson of their own, [next](strings.md).

## Values that might be missing

A variable of type `string` always holds a string. When a value might be absent, add `?` to the type, and it can also hold `null`:

```osl
string? nickname = null
log nickname
nickname = "Ace"
log nickname
```

```output
null
Ace
```

`??` gives a fallback for `null`:

```osl
string? nickname = null
log "Hello, " ++ (nickname ?? "friend")
```

```output
Hello, friend
```

The compiler keeps track of what could be `null` and stops you using it as if it couldn't. After you check for `null`, it knows the value is there:

```osl
def shout(string? text) string (
  if text == null return "(nothing)"
  return text.toUpper()
)

log shout("hi")
log shout(null)
```

```output
HI
(nothing)
```

## Converting between types

Every value has methods that turn it into another type. They're how text from a file, a form or a terminal becomes a number you can do sums with:

```osl
string typed = "42"
int n = typed.toInt()
log n + 1
log (n * 2).toStr() ++ "!"
log "3.5".toNum() * 2
log "true".toBool() "yes".toBool()
```

```output
43
84!
7
true false
```

`.toInt()` and `.toNum()` give `0` for text that isn't a number, and `.toBool()` is `true` only for the text `"true"`. When you need to know whether the conversion worked, use `.tryAs<T>`, which you'll meet with [errors](errors.md).

## When you don't know the type

`any` holds a value of any type, which is what you get from parsed JSON or from code that really can be handed anything. `typeof` names a value's type, and the compiler narrows the value inside the check:

```osl
def describe(any value) string (
  if typeof(value) == "string" return "text: " ++ value.toUpper()
  if typeof(value) == "int" return "a whole number"
  return "a " ++ typeof(value)
)

log describe("hi")
log describe(3)
log describe(2.5)
log describe([1, 2])
```

```output
text: HI
a whole number
a number
a array
```

Prefer real types where you can. Code written with `any` gives the compiler less to check and runs slower, because every operation has to look at the value first.

## Unions and names for types

A union accepts any of several types, written with `|`. `type` gives a type a name, which keeps long or repeated types readable:

```osl
type Id = string | int

def show(Id id) string -> "#" ++ id.toStr()

log show(7)
log show("a1")
```

```output
#7
#a1
```

You'll build bigger types of your own, with fields and methods, in [structs](structs.md) and [classes](classes.md).

:::quiz
What does `log 9 / 2` print?

- [ ] `4`
- [x] `4.5`
- [ ] It doesn't compile: both sides are `int`.

`/` always divides exactly. Use `floor(9 / 2)` when you want the whole part, `4`.
:::

:::quiz
`string? name` holds `null`. Which line gives `"anonymous"`?

- [x] `name ?? "anonymous"`
- [ ] `name or "anonymous"`
- [ ] `name.toStr()`

`??` uses its right side only when the left side is `null`. `or` is for booleans.
:::

:::exercise title="Average score"
The scores arrive as text, and adding them with `+` joins the text instead of adding the numbers. Print their average, rounded to a whole number.

```osl
string first = "72"
string second = "85"
string third = "90"

log first + second + third
```

```output
82
```

> [!hint]
> Convert each string with `.toInt()` before adding.

> [!hint]
> Add the three, divide by 3, then `round` the result. Use brackets around the sum.

```osl solution
string first = "72"
string second = "85"
string third = "90"

int total = first.toInt() + second.toInt() + third.toInt()
log round(total / 3)
```
:::

---
description: Every built-in method of int and number, the sized number types, and the rules for division, overflow and rounding.
---

# Numbers

`int` is a whole number and `number` a decimal. Methods are called on the value; bracket a negative literal: `(-2.5).round()`. Lesson: [Types](../learn/types.md).

```osl
number x = 3.14159
log x.round() x.round(2) x.floor() x.ceiling()
log (-4).abs() 16.sqrt() 7.isPrime()
log 90.sin() 7.clamp(0, 5)
```

```output
3 3.14 3 4
4 4 true
1 5
```

## Number types

| Type | Holds |
| --- | --- |
| `int` | whole numbers, 64 bit |
| `number` | decimals, 64 bit floating point |
| `int8`, `int16`, `int32`, `int64` | signed whole numbers of that many bits |
| `uint`, `uint8`, `uint16`, `uint32`, `uint64` | unsigned whole numbers |
| `byte` | the same as `uint8` |
| `number32`, `number64` | 32 and 64 bit floating point |

A literal with a decimal point or an exponent (`2.5`, `1e3`) is a `number`; others are `int`. Write literals with `_` between digits, or in hex (`0xFF`) or binary (`0b1010`). An `int` fits wherever a `number` is expected; the other way needs `.as<int>`, `.toInt()` or `.round()`. See [Types](types.md#conversions).

## Arithmetic rules

- `/` always divides exactly and gives a `number`: `6 / 2` is `3` as a number, and `7 / 2` is `3.5`. For the whole part use `floor(a / b)`. There is no integer division operator, because `//` starts a comment.
- `%` is the remainder and has the sign of the left side: `-7 % 4` is `-3`.
- `^` is power and gives a `number`.
- Integer arithmetic that leaves the `int` range stops with an `OverflowError`.
- Dividing by zero, or taking a remainder by zero, stops with a `MathError`.
- Floating point rounding shows: `0.1 + 0.2` is `0.30000000000000004`. Use `round` to tidy a result.

```osl
log 6 / 2 7 / 2
log floor(7 / 2)
log -7 % 4 7 % 4
log 2 ^ 10 2 ^ 0.5
log 0.1 + 0.2
log (0.1 + 0.2).round(2)
log 1_000_000 0xFF 0b1010 1e3
```

```output
3 3.5
3
-3 3
1024 1.4142135623730951
0.30000000000000004
0.3
1000000 255 10 1000
```

```osl error
log 9223372036854775807 + 1
```

## Rounding

| Method | Gives |
| --- | --- |
| `round()` | the nearest whole number; halves round up (`2.5` is `3`, `-2.5` is `-2`) |
| `round(digits)` | rounded to that many decimal places; negative digits round to tens, hundreds and so on |
| `floor()` | the largest whole number not above the value |
| `ceiling()` | the smallest whole number not below the value |

On an `int`, `round()`, `floor()` and `ceiling()` return the value itself, still an `int`.

```osl
number x = 1234.5678
log x.round() x.round(2) x.round(-2)
log x.floor() x.ceiling()
log (-2.5).round() 2.5.round() (-2.5).floor() (-2.5).ceiling()
log 7.round() 7.floor()
```

```output
1235 1234.57 1200
1234 1235
-2 3 -3 -2
7 7
```

## Size and sign

| Method | Gives |
| --- | --- |
| `abs()` | the size without the sign |
| `invabs()` | the size, negated: `-5` for both `5` and `-5` |
| `sign()` | the text `"+"` for zero and positive numbers, `"-"` for negative ones |
| `clamp(low, high)` | the value kept between the bounds (in either order) |

`abs()` of the smallest `int` is an `OverflowError`, as it has no positive `int` counterpart.

```osl
log (-4).abs() 4.abs() (-4).invabs()
log (-4).sign() 4.sign() 0.sign()
log 15.clamp(0, 10) (-3).clamp(0, 10) 7.clamp(10, 0)
log 2.5.clamp(0, 1)
```

```output
4 4 -4
- + +
10 0 7
1
```

## Roots and logarithms

| Method | Gives |
| --- | --- |
| `sqrt()` | the square root, or `null` for a negative number |
| `log()` | the base 10 logarithm |
| `ln()` | the natural logarithm |

Use `x.sqrt() ?? 0` where a number is required. For other roots and powers use [`pow`](builtins.md) or `^`; `std:math` has more.

```osl
log 16.sqrt() 2.sqrt()
log (-1).sqrt()
log (-1).sqrt() ?? 0
log 1000.log() 1.ln()
```

```output
4 1.4142135623730951
null
0
3 0
```

## Trigonometry

The everyday trigonometry methods work in degrees. The `rad` ones work in radians.

| Method | Gives |
| --- | --- |
| `sin()`, `cos()`, `tan()` | of an angle in degrees |
| `asin()`, `acos()` | the angle in degrees; `null` outside -1 to 1 |
| `atan()` | the angle in degrees |
| `radSin()`, `radCos()`, `radTan()` | of an angle in radians |

```osl
log 90.sin() 0.cos() 45.tan()
log 1.asin() 1.acos() 1.atan()
log 0.radSin() 0.radCos()
log 2.asin()
```

```output
1 1 1
90 0 45
0 1
null
```

## Testing a number

| Method | Gives |
| --- | --- |
| `isPrime()` | `true` for a prime number |
| `isNaN()` | `true` for "not a number" |
| `isFinite()` | `true` if neither infinite nor NaN |
| `isInfinite()` | `true` for positive or negative infinity |

```osl
import "std:math"
log 7.isPrime() 8.isPrime() 1.isPrime()
log math.sqrt(-1).isNaN() 5.isNaN()
log (2 ^ 1024).isInfinite() 5.isFinite()
```

```output
true false false
true false
true true
```

## Converting

| Method | Gives |
| --- | --- |
| `chr()` | the character with that code point |
| `toStr()` | the number as text |
| `toInt()` | the whole part, as an `int` (`7.9` becomes `7`, `-7.9` becomes `-7`) |
| `toNum()` | the value as a `number` |
| `as<T>` | the value as another number type; see [Types](types.md#conversions) |
| `tryAs<T>` | a `result`: an error if the value doesn't fit |

```osl
log 65.chr() 233.chr()
log 3.toStr() ++ "!"
log 7.9.toInt() (-7.9).toInt()
log 300.tryAs<uint8>.isErr() 200.tryAs<uint8>.unwrap()
log 2.5.as<int>
```

```output
A é
3!
7 -7
true 200
2
```

## Bits

`&`, `|`, `^^`, `~`, `<<`, `>>` and `>>>` work on whole numbers; see [Operators](operators.md).

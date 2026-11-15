---
description: Trigonometry, number theory, statistics and number formatting, with the results and edge cases you will meet in real calculations.
package: math
---

# math

`std:math` is for arithmetic that `+ - * /` can't do: roots, powers, angles, primes, averages and spread. Reach for it when you are measuring, scaling, summarising a list of numbers or turning a number into text with a fixed number of decimals.

A few functions (`floor`, `ceil`, `round`, `abs`, `min`, `max`) are also built into the language and work without an import. The rest need `import "std:math"`.

## Roots, powers and rounding

```osl
import "std:math"

log math.sqrt(16)
log math.pow(2, 10)
log math.hypot(3, 4)
log math.cbrt(27)
log math.round(2.5) math.floor(2.7) math.ceil(2.1) math.trunc(-2.7)
```

```output
4
1024
5
3
3 2 3 -2
```

`round` rounds halves away from zero. `floor` goes down, `ceil` goes up, and `trunc` drops the fraction, so it rounds toward zero. That matters for negative numbers: `floor(-2.7)` is `-3`, `trunc(-2.7)` is `-2`.

There is no integer division operator in OSL, so `floor(a / b)` is how you divide and drop the remainder. `math.mod(a, b)` gives the remainder, with the sign of `a`:

```osl
import "std:math"

log floor(17 / 5) math.mod(17, 5)
log math.mod(-7, 3)
```

```output
3 2
-1
```

## Constants

`math.pi`, `math.tau` (two pi), `math.e` and `math.phi` (the golden ratio) are constants, not functions: no brackets.

```osl
import "std:math"

auto radius = 3
log math.pi * (radius ^ 2)
log math.tau
```

```output
28.274333882308138
6.283185307179586
```

## Angles

The trigonometric functions take radians. Convert with `math.radians` and `math.degrees`:

```osl
import "std:math"

log math.sin(math.radians(90))
log math.cos(0)
log math.degrees(math.pi)
log math.atan2(1, 1)
```

```output
1
1
180
0.7853981633974483
```

`atan2(y, x)` is the angle of a point from the x axis, and unlike `atan(y / x)` it gets the quadrant right and doesn't divide by zero. `math.hypot(x, y)` is the distance from the origin.

Here is the distance between two points on a plane:

```osl
import "std:math"

def distance(number x1, number y1, number x2, number y2) number (
  return math.hypot(x2 - x1, y2 - y1)
)

log distance(0, 0, 6, 8)
log distance(1, 1, 4, 5)
```

```output
10
5
```

## Limiting and blending values

`clamp(value, min, max)` keeps a value inside a range. `lerp(start, end, t)` moves between two values: `t` of 0 gives `start`, 1 gives `end`.

```osl
import "std:math"

log math.clamp(15, 0, 10)
log math.clamp(-5, 0, 10)
log math.lerp(0, 100, 0.25)
log math.lerp(10, 20, 0.5)
log math.sign(-4) math.sign(0)
```

```output
10
0
25
15
-1 0
```

Together they make a progress bar: `math.clamp(done / total, 0, 1)` can never leave the 0 to 1 range, however wrong the inputs are.

## Percentages and fixed decimals

`math.toPercent(part, total)` gives the percentage. `math.toFixed(x, digits)` returns text with exactly that many decimals, which is what you want for display, since a number alone can't remember trailing zeros:

```osl
import "std:math"

auto pct = math.toPercent(1, 3)
log pct
log math.toFixed(pct, 1) ++ "%"
log math.toFixed(2, 3)
```

```output
33.33333333333333
33.3%
2.000
```

> [!note]
> Numbers are binary floating point, as in most languages: `0.1 + 0.2` is `0.30000000000000004`. Don't compare computed decimals with `==`. Round first, or compare the difference to a small tolerance.

## Number theory

`gcd` and `lcm` find the greatest common divisor and least common multiple. `isPrime` tests a number and `primes(n)` lists the first `n` primes:

```osl
import "std:math"

log math.gcd(12, 18)
log math.lcm(4, 6).unwrap()
log math.isPrime(97) math.isPrime(91)
log math.primes(8)
```

```output
6
12
true false
[2,3,5,7,11,13,17,19]
```

`lcm`, `factorial` and `fibonacci` return a [result](result.md), because the answer can outgrow an `int`:

```osl
import "std:math"

log math.factorial(10).unwrap()
log math.fibonacci(20).unwrap()

auto big = math.factorial(30)
log big.isErr() big.unwrapErr().kind
```

```output
3628800
6765
true OverflowError
```

A negative argument fails with a `ValueError`. Handle it as the [errors lesson](../learn/errors.md) shows, with `catch`, `switch`, `!` or `unwrapOr`.

## Summarising a list

The statistics functions take an array of numbers. `sum` and `product` can't fail (an empty array gives 0 and 1), so they return plain numbers:

```osl
import "std:math"

number[] scores = [72, 85, 90, 64, 85]
log math.sum(scores)
log math.product([2, 3, 4])
```

```output
396
24
```

The functions that need at least one number (`avg`, `median`, `maxOf`, `minOf`, `rangeOf` and the rest) return a result, which fails with a `ValueError` on an empty array:

```osl
import "std:math"

number[] scores = [72, 85, 90, 64, 85]
log math.avg(scores).unwrap()
log math.median(scores).unwrap()
log math.mode(scores)
log math.maxOf(scores).unwrap() math.minOf(scores).unwrap()
log math.rangeOf(scores).unwrap()

number[] none = []
auto e = math.avg(none).unwrapErr()
log e.kind ++ ": " ++ e.message
```

```output
79.2
85
[85]
90 64
26
ValueError: math.avg: the array is empty
```

`mode` returns an array because several values can tie, and an empty array is simply an empty list of modes, so it is the one that doesn't fail. A friendlier average is one line:

```osl
import "std:math"

def average(number[] values) number (
  return math.avg(values).unwrapOr(0)
)

log average([4, 8])
log average([])
```

```output
6
0
```

## Spread and position

`variance` and `standardDeviation` describe how far values lie from the mean. They treat the numbers as a whole population unless you pass `{sample: true}`, which divides by one less than the count:

```osl
import "std:math"

number[] data = [2, 4, 4, 4, 5, 5, 7, 9]
log math.variance(data).unwrap()
log math.standardDeviation(data).unwrap()
log math.standardDeviation(data, {sample: true}).unwrap()
```

```output
4
2
2.138089935299395
```

`percentile(numbers, p)` takes `p` from 0 to 100, `quantile` takes 0 to 1, and `quartiles` gives all three cut points at once:

```osl
import "std:math"

number[] times = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
log math.percentile(times, 90).unwrap()
log math.quartiles(times).unwrap()
log math.iqr(times).unwrap()
```

```output
9.1
{"q1":3.25,"q2":5.5,"q3":7.75}
4.5
```

`zScores` says how many standard deviations each value is from the mean, which makes outliers easy to find. `normalize` rescales to 0 to 1:

```osl
import "std:math"

log math.zScores([1, 2, 3])
log math.normalize([10, 20, 30])
```

```output
[-1.224744871391589,0,1.224744871391589]
[0,0.5,1]
```

`correlation` and `covariance` compare two equally long arrays: `math.correlation([1, 2, 3], [2, 4, 6]).unwrap()` is `1`, a perfect positive relationship.

## NaN and infinity

Some inputs have no real answer, and the result is `NaN` (not a number) instead of an error. `NaN` is never equal to anything, even itself, so test for it with a function:

```osl
import "std:math"

auto bad = math.sqrt(-1)
log bad
log math.isNaN(bad)
log math.isFinite(5) math.isFinite(bad)
```

```output
NaN
true
true false
```

`math.isInfinite` tests for the infinities. Dividing by zero with `/` throws a `MathError` rather than returning infinity, so a `NaN` mostly comes from the math functions: `sqrt`, `log`, `asin` and `acos` outside their domains.

## Example: grade report

A real use pulls several of these together: summarise scores, format them, and guard the empty case.

```osl
import "std:math"

def report(string name, number[] scores) string (
  if scores.len == 0 return name ++ ": no scores"
  auto mean = math.avg(scores).unwrap()
  auto spread = math.standardDeviation(scores).unwrap()
  return name ++ ": mean " ++ math.toFixed(mean, 1) ++ ", spread " ++ math.toFixed(spread, 1)
)

log report("Ada", [90, 85, 100])
log report("Bo", [])
```

```output
Ada: mean 91.7, spread 6.2
Bo: no scores
```

:::quiz
What does this print?

```osl fragment
auto a = math.sqrt(-1)
auto b = math.sqrt(-1)
log a == b
```

- [ ] `true`
- [x] `false`
- [ ] A `MathError`

The square root of -1 is `NaN`, which is never equal to anything, itself included. Test for it with `math.isNaN`.
:::

:::exercise title="Mean and range"
Print the average of the temperatures to one decimal place, then the gap between the hottest and coldest day.

```osl
import "std:math"

number[] temps = [18.5, 21, 19.5, 24, 16]

log temps.len
```

```output
19.8
8
```

> [!hint]
> `math.avg(temps).unwrap()` gives the mean, and `math.toFixed(x, 1)` formats it.

> [!hint]
> `math.rangeOf` is the largest minus the smallest.

```osl solution
import "std:math"

number[] temps = [18.5, 21, 19.5, 24, 16]

log math.toFixed(math.avg(temps).unwrap(), 1)
log math.rangeOf(temps).unwrap()
```
:::

## API reference

::api

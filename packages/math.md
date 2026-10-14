# math

Use `math` for math beyond the built-ins: trigonometry in radians, number theory, statistics, and
functions that match JavaScript's results exactly.

```osl
import "std:math"
```

## Example

```osl
import "std:math"

log math.atan2(1, 1)       // 0.7853981633974483
log math.mod(-7, 3)        // -1
log math.gcd(12, 18)       // 6
log math.primes(5)         // [2,3,5,7,11]

number mean = math.avg([1, 2, 3, 4])
log mean                   // 2.5
log math.standardDeviation([2, 4, 4, 4, 5, 5, 7, 9]) // 2

number top = math.maxOf([]) catch (err) (
  log err                  // ValueError: math.maxOf: the array is empty
  return
)
log top
```

Every number parameter also accepts a numeric string such as `"3"`. A string that isn't a number
throws `TypeError`.

## API reference

### Arithmetic and rounding

| Method | Returns | Notes |
| --- | --- | --- |
| `math.abs(x)` | `number` | Absolute value. |
| `math.ceil(x)`, `math.floor(x)` | `number` | Round up or down to a whole number. |
| `math.round(x)` | `number` | Nearest whole number, halves away from zero: `2.5` is `3` and `-2.5` is `-3`. |
| `math.trunc(x)` | `number` | Drops the fractional part, rounding toward zero. |
| `math.sqrt(x)`, `math.cbrt(x)` | `number` | Square root (`NaN` for a negative `x`) and cube root. |
| `math.pow(base, exponent)` | `number` | `base` raised to `exponent`. |
| `math.exp(x)` | `number` | e raised to `x`. |
| `math.log(x)`, `math.log10(x)`, `math.log2(x)` | `number` | Natural, base-10, and base-2 logarithms. `log` is `NaN` for a negative `x` and `-Infinity` for 0. |
| `math.min(a, b)`, `math.max(a, b)` | `number` | The smaller or larger of two numbers. |
| `math.clamp(value, min, max)` | `number` | Limits `value` to the range. The bounds may come in either order. |
| `math.lerp(start, end, t)` | `number` | Linear interpolation: `t` of 0 gives `start`, 1 gives `end`, and values outside 0 to 1 extrapolate. |
| `math.hypot(x, y)` | `number` | `sqrt(x*x + y*y)` without overflowing for large values. |
| `math.mod(a, b)` | `number` | Remainder with the sign of `a`: `math.mod(-7, 3)` is `-1`. Throws `ValueError` when `b` is 0. |
| `math.sign(x)` | `int` | `1` for positive, `-1` for negative, `0` for 0 or `NaN`. |
| `math.isNaN(x)` | `boolean` | Whether `x` is NaN. |
| `math.isInfinite(x)` | `boolean` | Whether `x` is positive or negative infinity. Use `math.sign(x)` for which one. |
| `math.isFinite(x)` | `boolean` | Whether `x` is neither infinite nor NaN. |
| `math.toFixed(x, digits: int)` | `string` | `x` with exactly `digits` decimals, rounding the exact binary value with halves to even, as C's `printf` does: `math.toFixed(2.5, 0)` is `"2"`. Use `math.jsToFixed` for JavaScript's rounding. Throws `ValueError` for `digits` outside 0 to 100. |
| `math.toPercent(x, total)` | `number` | `x` as a percentage of `total`: `math.toPercent(25, 200)` is `12.5`. Throws `ValueError` when `total` is 0. |

### Constants

| Method | Returns | Notes |
| --- | --- | --- |
| `math.pi()` | `number` | 3.141592653589793 |
| `math.e()` | `number` | 2.718281828459045 |
| `math.phi()` | `number` | The golden ratio, 1.618033988749895. |

### Trigonometry

Angles are in radians. The built-in `sin`, `cos`, and `tan` functions and number methods use
degrees instead.

| Method | Returns | Notes |
| --- | --- | --- |
| `math.sin(x)`, `math.cos(x)`, `math.tan(x)` | `number` | |
| `math.asin(x)`, `math.acos(x)` | `number` | `NaN` outside -1 to 1. |
| `math.atan(x)` | `number` | |
| `math.atan2(y, x)` | `number` | Angle from the positive x axis to `(x, y)`, from -pi to pi. `y` comes first. |
| `math.sinh(x)`, `math.cosh(x)`, `math.tanh(x)` | `number` | Hyperbolic functions. |
| `math.degrees(radians)`, `math.radians(degrees)` | `number` | Converts between radians and degrees. |

### Number theory

| Method | Returns | Notes |
| --- | --- | --- |
| `math.factorial(n: int)` | `int` | `n!`. Throws `ValueError` for a negative `n` or one above 20. |
| `math.fibonacci(n: int)` | `int` | The nth Fibonacci number, with `fibonacci(0)` as 0. Throws `ValueError` for a negative `n` or one above 92. |
| `math.gcd(a: int, b: int)` | `int` | Greatest common divisor, never negative. `math.gcd(0, 0)` is 0. |
| `math.lcm(a: int, b: int)` | `int` | Least common multiple, never negative, or 0 when either is 0. Throws `ValueError` when the result doesn't fit. |
| `math.isPrime(n)` | `boolean` | Numbers below 2 and numbers with a fractional part are not prime. |
| `math.primes(count: int)` | `int[]` | The first `count` primes, starting at 2. Throws `ValueError` for a negative count. |

### Statistics

Functions marked with a result fail with `ValueError` for an empty array, so an empty data set
can't pass for a real 0.

| Method | Returns | Notes |
| --- | --- | --- |
| `math.sum(numbers)` | `number` | 0 for an empty array. |
| `math.product(numbers)` | `number` | 1 for an empty array. |
| `math.avg(numbers)` | `result<number, error>` | Arithmetic mean. |
| `math.median(numbers)` | `result<number, error>` | Middle value, or the mean of the two middle values. |
| `math.mode(numbers)` | `number[]` | The most frequent values in ascending order: several on a tie, none for an empty array. |
| `math.minOf(numbers)`, `math.maxOf(numbers)` | `result<number, error>` | Smallest or largest value. |
| `math.rangeOf(numbers)` | `result<number, error>` | Largest minus smallest. |
| `math.variance(numbers, options?)` | `result<number, error>` | Population variance. With `{sample: true}`, the sample variance, which needs at least 2 numbers. |
| `math.standardDeviation(numbers, options?)` | `result<number, error>` | Population standard deviation. With `{sample: true}`, the sample standard deviation, which needs at least 2 numbers. |
| `math.percentile(numbers, p)` | `result<number, error>` | The pth percentile for `p` from 0 to 100, interpolating between the closest values. Throws `ValueError` for `p` out of range. |
| `math.quantile(numbers, q)` | `result<number, error>` | The same as `math.percentile(numbers, q * 100)`, for `q` from 0 to 1. |
| `math.quartiles(numbers)` | `result<{q1, q2, q3}, error>` | The 25th, 50th, and 75th percentiles. |
| `math.iqr(numbers)` | `result<number, error>` | `q3` minus `q1`. |
| `math.geometricMean(numbers)` | `result<number, error>` | Also fails for a number that is 0 or less. |
| `math.harmonicMean(numbers)` | `result<number, error>` | Also fails for a number that is 0 or less. |
| `math.covariance(a, b)` | `result<number, error>` | Population covariance of two equally long arrays. Also fails for arrays of different lengths. |
| `math.correlation(a, b)` | `result<number, error>` | Pearson correlation from -1 to 1. Also fails for arrays of different lengths, or an array whose values are all equal. |
| `math.zScores(numbers)` | `number[]` | How many population standard deviations each number is from the mean; all 0 when the numbers are equal. |
| `math.normalize(numbers)` | `number[]` | Rescales to 0 to 1, smallest to 0 and largest to 1; all 0 when the numbers are equal. |

### JavaScript-exact functions

| Method | Returns | Notes |
| --- | --- | --- |
| `math.jsSin(x)`, `math.jsCos(x)`, `math.jsTan(x)` | `number` | Same bits as JavaScript's `Math.sin`, `Math.cos`, `Math.tan`. |
| `math.jsAsin(x)`, `math.jsAcos(x)`, `math.jsAtan(x)`, `math.jsAtan2(y, x)` | `number` | Same bits as JavaScript's inverse trigonometric functions. |
| `math.jsLog(x)`, `math.jsExp(x)` | `number` | Same bits as `Math.log` and `Math.exp`. |
| `math.jsPow(x, y)` | `number` | JavaScript's `Math.pow` rules, correctly rounded. See below. |
| `math.jsToFixed(x, digits: int)` | `string` | `x.toFixed(digits)` exactly as JavaScript formats it. |
| `math.fround(x)` | `number` | The nearest 32-bit float, like `Math.fround`. |

## JavaScript-exact math

Go's `math` functions often differ from JavaScript's `Math.*` in the last bit, for example
`math.acos(0.5)` is `1.0471975511965976` but JavaScript gives `1.0471975511965979`. The `js*`
methods port V8's fdlibm code (`src/base/ieee754.cc`, the version in Node 24), so they return
the same bits as JavaScript. Use them when a program must reproduce a JavaScript engine exactly,
for example a Scratch interpreter.

```osl
import "std:math"
log math.jsAcos(0.5)   // 1.0471975511965979
log math.jsLog(1000)   // 6.907755278982137
log math.jsPow(10, -2) // 0.01
```

`jsPow` is the one exception. V8 handles a few special cases itself (`y` is `NaN`,
`(±1) ** ±Infinity`, `x ** 2`, `x ** 0.5`) and passes everything else to the operating system's
`pow`, so JavaScript's own results differ between platforms. `jsPow` applies V8's special
cases, then returns the correctly rounded result. That matches JavaScript whenever the platform's
`pow` is correctly rounded (on macOS it isn't for about 0.1% of inputs).

Newer V8 builds (from mid-2026) replace fdlibm with LLVM's libm, which changes some results.
These methods follow the fdlibm behaviour shipped in Node 24.

`math.fround(x)` rounds to the nearest 32-bit float, like JavaScript's `Math.fround`.

`math.jsToFixed(x, digits)` returns `x.toFixed(digits)` exactly as JavaScript formats it: the nearest
decimal, halfway cases rounded away from zero, and the sign kept when a negative value rounds to zero.

## Deprecated

These still work for one release with their old behaviour and draw an `OSL-DEPRECATED` warning:

| Deprecated | Use instead |
| --- | --- |
| `math.isInf(x)`, which returns `1`, `-1`, or `0` | `math.isInfinite(x)`, and `math.sign(x)` for the direction |
| `math.stdDev(numbers)` (sample, `0` for fewer than two numbers) | `math.standardDeviation(numbers, {sample: true})` |
| `math.random(min, max)` | `random.float(min, max)` from [`std:random`](random.md) |
| `math.randomInt(min, max)` | `random.between(min, max)` |
| `math.randomChoice(choices)` | `random.pick(items)` |
| `math.randomSeed(seed)` | `random.seed(seed)` |

## Notes

- Prefer `import "std:math"`; the older `import "osl/math"` spelling remains supported.
- Statistics convert their inputs to 64-bit floating point. `NaN` and infinity follow the usual
  floating-point rules.

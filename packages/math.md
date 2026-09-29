# math

```osl
import "std:math"
```

## Methods

- `math.abs(x)` → `number`
- `math.ceil(x)` → `number`
- `math.floor(x)` → `number`
- `math.round(x)` → `number`
- `math.trunc(x)` → `number`
- `math.sqrt(x)` → `number`
- `math.cbrt(x)` → `number`
- `math.pow(base, exp)` → `number`
- `math.exp(x)` → `number`
- `math.log(x)` → `number`
- `math.log10(x)` → `number`
- `math.log2(x)` → `number`
- `math.sin(x)` → `number`
- `math.cos(x)` → `number`
- `math.tan(x)` → `number`
- `math.asin(x)` → `number`
- `math.acos(x)` → `number`
- `math.atan(x)` → `number`
- `math.atan2(y, x)` → `number`
- `math.sinh(x)` → `number`
- `math.cosh(x)` → `number`
- `math.tanh(x)` → `number`
- `math.min(a, b)` → `number`
- `math.max(a, b)` → `number`
- `math.clamp(value, min, max)` → `number`
- `math.lerp(start, end, t)` → `number`
- `math.sum(numbers)` → `number`
- `math.avg(numbers)` → `number`
- `math.median(numbers)` → `number`
- `math.mode(numbers)` → `array`
- `math.stdDev(numbers)` → `number`
- `math.variance(numbers)` → `number`
- `math.rangeOf(numbers)` → `number`
- `math.factorial(n)` → `number`
- `math.fibonacci(n)` → `number`
- `math.gcd(a, b)` → `number`
- `math.lcm(a, b)` → `number`
- `math.isPrime(n)` → `boolean`
- `math.primes(count)` → `array`
- `math.degrees(x)` → `number`
- `math.radians(x)` → `number`
- `math.random(min, max)` → `number`
- `math.randomInt(min, max)` → `number`
- `math.randomChoice(choices)` → `any`
- `math.randomSeed(seed)`
- `math.hypot(x, y)` → `number`
- `math.mod(a, b)` → `number`
- `math.isNan(x)` → `boolean`
- `math.isInf(x)` → `number`
- `math.sign(x)` → `number`
- `math.pi()` → `number`
- `math.e()` → `number`
- `math.phi()` → `number`
- `math.toFixed(x, decimals)` → `string`
- `math.toPercent(x, total)` → `number`
- `math.percentile(numbers, p)` → `number`
- `math.quantile(numbers, q)` → `number`
- `math.quartiles(numbers)` → `object`
- `math.iqr(numbers)` → `number`
- `math.product(numbers)` → `number`
- `math.minOf(numbers)` → `number`
- `math.maxOf(numbers)` → `number`
- `math.geometricMean(numbers)` → `number`
- `math.harmonicMean(numbers)` → `number`
- `math.covariance(a, b)` → `number`
- `math.correlation(a, b)` → `number`
- `math.zScores(numbers)` → `array`
- `math.normalize(numbers)` → `array`
- `math.jsSin(x)`, `math.jsCos(x)`, `math.jsTan(x)`, `math.jsAsin(x)`, `math.jsAcos(x)`, `math.jsAtan(x)`, `math.jsAtan2(y, x)`, `math.jsLog(x)`, `math.jsExp(x)`, `math.jsPow(x, y)` → `number`

## Complete API reference

### `math`

| Method | Returns | Notes |
| --- | --- | --- |
| `math.abs(x: any)` | `number` |  |
| `math.ceil(x: any)` | `number` |  |
| `math.floor(x: any)` | `number` |  |
| `math.round(x: any)` | `number` |  |
| `math.trunc(x: any)` | `number` |  |
| `math.sqrt(x: any)` | `number` |  |
| `math.cbrt(x: any)` | `number` |  |
| `math.pow(base: any, exp: any)` | `number` |  |
| `math.exp(x: any)` | `number` |  |
| `math.log(x: any)` | `number` |  |
| `math.log10(x: any)` | `number` |  |
| `math.log2(x: any)` | `number` |  |
| `math.sin(x: any)` | `number` |  |
| `math.cos(x: any)` | `number` |  |
| `math.tan(x: any)` | `number` |  |
| `math.asin(x: any)` | `number` |  |
| `math.acos(x: any)` | `number` |  |
| `math.atan(x: any)` | `number` |  |
| `math.atan2(y: any, x: any)` | `number` |  |
| `math.sinh(x: any)` | `number` |  |
| `math.cosh(x: any)` | `number` |  |
| `math.tanh(x: any)` | `number` |  |
| `math.min(a: any, b: any)` | `number` |  |
| `math.max(a: any, b: any)` | `number` |  |
| `math.clamp(value: any, min: any, max: any)` | `number` |  |
| `math.lerp(start: any, end: any, t: any)` | `number` |  |
| `math.sum(numbers: array)` | `number` |  |
| `math.avg(numbers: array)` | `number` |  |
| `math.median(numbers: array)` | `number` |  |
| `math.mode(numbers: array)` | `array` |  |
| `math.stdDev(numbers: array)` | `number` | Returns sample standard deviation, or `0` with fewer than two values. |
| `math.variance(numbers: array)` | `number` | Returns population variance, or `0` with fewer than two values. |
| `math.rangeOf(numbers: array)` | `number` | Returns maximum minus minimum, or `0` for an empty array. |
| `math.factorial(n: any)` | `number` |  |
| `math.fibonacci(n: any)` | `number` |  |
| `math.gcd(a: any, b: any)` | `number` |  |
| `math.lcm(a: any, b: any)` | `number` |  |
| `math.isPrime(n: any)` | `boolean` |  |
| `math.primes(count: any)` | `array` |  |
| `math.degrees(x: any)` | `number` |  |
| `math.radians(x: any)` | `number` |  |
| `math.random(min: any, max: any)` | `number` |  |
| `math.randomInt(min: any, max: any)` | `number` | Generates random int. |
| `math.randomChoice(choices: array)` | `any` | Generates random choice. |
| `math.randomSeed(seed: any)` | `void` | Generates random seed. |
| `math.hypot(x: any, y: any)` | `number` |  |
| `math.mod(a: any, b: any)` | `number` |  |
| `math.isNan(x: any)` | `boolean` |  |
| `math.isInf(x: any)` | `number` |  |
| `math.sign(x: any)` | `number` |  |
| `math.pi()` | `number` |  |
| `math.e()` | `number` |  |
| `math.phi()` | `number` |  |
| `math.toFixed(x: any, decimals: any)` | `string` | Converts to fixed. |
| `math.toPercent(x: any, total: any)` | `number` | Converts to percent. |
| `math.percentile(numbers: array, p: any)` | `number` |  |
| `math.quantile(numbers: array, q: any)` | `number` |  |
| `math.quartiles(numbers: array)` | `object` |  |
| `math.iqr(numbers: array)` | `number` |  |
| `math.product(numbers: array)` | `number` |  |
| `math.minOf(numbers: array)` | `number` | Returns the minimum, or `0` for an empty array. |
| `math.maxOf(numbers: array)` | `number` | Returns the maximum, or `0` for an empty array. |
| `math.geometricMean(numbers: array)` | `number` |  |
| `math.harmonicMean(numbers: array)` | `number` |  |
| `math.covariance(a: array, b: array)` | `number` |  |
| `math.correlation(a: array, b: array)` | `number` |  |
| `math.zScores(numbers: array)` | `array` |  |
| `math.normalize(numbers: array)` | `array` |  |
| `math.jsSin(x: number)` | `number` | Same result as JavaScript's `Math.sin`. |
| `math.jsCos(x: number)` | `number` | Same result as JavaScript's `Math.cos`. |
| `math.jsTan(x: number)` | `number` | Same result as JavaScript's `Math.tan`. |
| `math.jsAsin(x: number)` | `number` | Same result as JavaScript's `Math.asin`. |
| `math.jsAcos(x: number)` | `number` | Same result as JavaScript's `Math.acos`. |
| `math.jsAtan(x: number)` | `number` | Same result as JavaScript's `Math.atan`. |
| `math.jsAtan2(y: number, x: number)` | `number` | Same result as JavaScript's `Math.atan2`. |
| `math.jsLog(x: number)` | `number` | Same result as JavaScript's `Math.log`. |
| `math.jsExp(x: number)` | `number` | Same result as JavaScript's `Math.exp`. |
| `math.jsPow(x: number, y: number)` | `number` | JavaScript's `Math.pow` rules, correctly rounded. See below. |

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

## Notes

- Prefer `import "std:math"`; the older `import "osl/math"` spelling remains supported.

## Behavior and limits

Statistical functions convert inputs to 64-bit floating point. `NaN` and infinity follow Go's
floating-point rules. Prime helpers handle zero, negative numbers, and large boundary values.
Range functions accept their bounds in either order. Random generation and reseeding are safe
across threads.

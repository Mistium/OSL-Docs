# math

> Advanced mathematical utilities

```javascript
import "osl/math"
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

## Complete API reference

### `math`

| Method | Returns | Description |
| --- | --- | --- |
| `math.abs(x: any)` | `number` | Runs the abs operation. |
| `math.ceil(x: any)` | `number` | Runs the ceil operation. |
| `math.floor(x: any)` | `number` | Runs the floor operation. |
| `math.round(x: any)` | `number` | Runs the round operation. |
| `math.trunc(x: any)` | `number` | Runs the trunc operation. |
| `math.sqrt(x: any)` | `number` | Runs the sqrt operation. |
| `math.cbrt(x: any)` | `number` | Runs the cbrt operation. |
| `math.pow(base: any, exp: any)` | `number` | Runs the pow operation. |
| `math.exp(x: any)` | `number` | Runs the exp operation. |
| `math.log(x: any)` | `number` | Runs the log operation. |
| `math.log10(x: any)` | `number` | Runs the log10 operation. |
| `math.log2(x: any)` | `number` | Runs the log2 operation. |
| `math.sin(x: any)` | `number` | Runs the sin operation. |
| `math.cos(x: any)` | `number` | Runs the cos operation. |
| `math.tan(x: any)` | `number` | Runs the tan operation. |
| `math.asin(x: any)` | `number` | Runs the asin operation. |
| `math.acos(x: any)` | `number` | Runs the acos operation. |
| `math.atan(x: any)` | `number` | Runs the atan operation. |
| `math.atan2(y: any, x: any)` | `number` | Runs the atan2 operation. |
| `math.sinh(x: any)` | `number` | Runs the sinh operation. |
| `math.cosh(x: any)` | `number` | Runs the cosh operation. |
| `math.tanh(x: any)` | `number` | Runs the tanh operation. |
| `math.min(a: any, b: any)` | `number` | Runs the min operation. |
| `math.max(a: any, b: any)` | `number` | Runs the max operation. |
| `math.clamp(value: any, min: any, max: any)` | `number` | Runs the clamp operation. |
| `math.lerp(start: any, end: any, t: any)` | `number` | Runs the lerp operation. |
| `math.sum(numbers: array)` | `number` | Runs the sum operation. |
| `math.avg(numbers: array)` | `number` | Runs the avg operation. |
| `math.median(numbers: array)` | `number` | Runs the median operation. |
| `math.mode(numbers: array)` | `array` | Runs the mode operation. |
| `math.stdDev(numbers: array)` | `number` | Runs the std dev operation. |
| `math.variance(numbers: array)` | `number` | Runs the variance operation. |
| `math.rangeOf(numbers: array)` | `number` | Runs the range of operation. |
| `math.factorial(n: any)` | `number` | Runs the factorial operation. |
| `math.fibonacci(n: any)` | `number` | Runs the fibonacci operation. |
| `math.gcd(a: any, b: any)` | `number` | Runs the gcd operation. |
| `math.lcm(a: any, b: any)` | `number` | Runs the lcm operation. |
| `math.isPrime(n: any)` | `boolean` | Reports whether prime. |
| `math.primes(count: any)` | `array` | Runs the primes operation. |
| `math.degrees(x: any)` | `number` | Runs the degrees operation. |
| `math.radians(x: any)` | `number` | Runs the radians operation. |
| `math.random(min: any, max: any)` | `number` | Runs the random operation. |
| `math.randomInt(min: any, max: any)` | `number` | Generates random int. |
| `math.randomChoice(choices: array)` | `any` | Generates random choice. |
| `math.randomSeed(seed: any)` | `void` | Generates random seed. |
| `math.hypot(x: any, y: any)` | `number` | Runs the hypot operation. |
| `math.mod(a: any, b: any)` | `number` | Runs the mod operation. |
| `math.isNan(x: any)` | `boolean` | Reports whether nan. |
| `math.isInf(x: any)` | `number` | Reports whether inf. |
| `math.sign(x: any)` | `number` | Runs the sign operation. |
| `math.pi()` | `number` | Runs the pi operation. |
| `math.e()` | `number` | Runs the e operation. |
| `math.phi()` | `number` | Runs the phi operation. |
| `math.toFixed(x: any, decimals: any)` | `string` | Converts to fixed. |
| `math.toPercent(x: any, total: any)` | `number` | Converts to percent. |
| `math.percentile(numbers: array, p: any)` | `number` | Runs the percentile operation. |
| `math.quantile(numbers: array, q: any)` | `number` | Runs the quantile operation. |
| `math.quartiles(numbers: array)` | `object` | Runs the quartiles operation. |
| `math.iqr(numbers: array)` | `number` | Runs the iqr operation. |
| `math.product(numbers: array)` | `number` | Runs the product operation. |
| `math.minOf(numbers: array)` | `number` | Runs the min of operation. |
| `math.maxOf(numbers: array)` | `number` | Runs the max of operation. |
| `math.geometricMean(numbers: array)` | `number` | Runs the geometric mean operation. |
| `math.harmonicMean(numbers: array)` | `number` | Runs the harmonic mean operation. |
| `math.covariance(a: array, b: array)` | `number` | Runs the covariance operation. |
| `math.correlation(a: array, b: array)` | `number` | Runs the correlation operation. |
| `math.zScores(numbers: array)` | `array` | Runs the z scores operation. |
| `math.normalize(numbers: array)` | `array` | Runs the normalize operation. |

## Notes

- Standard-library imports accept both `import "osl/math"` and `import "math"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

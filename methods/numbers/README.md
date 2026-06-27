# Number Methods

Methods you can call on any numeric value (`int` or `number`). They return a new value and never
mutate. They also work on literals when wrapped in parentheses, e.g. `(16).sqrt()`.

```javascript
number x = -3.6
log x.abs()       // 3.6
log x.round()     // -4
log x.clamp(0, 5) // 0
```

## In this section

- **[Rounding](rounding.md)** — `round`, `round(precision)`, `floor`, `ceiling`.
- **[Arithmetic & Conversion](arithmetic.md)** — `abs`, `invabs`, `sign`, `clamp`, `sqrt`,
  `isPrime`, `chr`.
- **[Logarithms & Trigonometry](trigonometry.md)** — `log`, `ln`, `sin`/`cos`/`tan` and their
  `asin`/`acos`/`atan` and radian variants.

> For the complete set of mathematical functions, statistics and constants, see the
> [`math`](../../packages/math.md) package. Standalone `abs`/`round`/`min`/`max`/`dist` function
> forms are in [Built-in functions](../../functions/builtins.md).

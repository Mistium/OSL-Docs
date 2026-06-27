# Numbers — Logarithms & Trigonometry

Logarithms and trigonometric functions. Trig comes in **degree** and **radian** variants.

## Logarithms

#### `.log()` → `number`
Base-10 logarithm.

#### `.ln()` → `number`
Natural (base-*e*) logarithm.

```javascript
log (100).log()  // 2
log (100).ln()   // 4.605170185988092
```

## Trigonometry (degrees)

| Method | Description |
| --- | --- |
| `.sin()` | Sine (input in degrees). |
| `.cos()` | Cosine (input in degrees). |
| `.tan()` | Tangent (input in degrees). |
| `.asin()` | Arcsine (result in degrees). |
| `.acos()` | Arccosine (result in degrees). |
| `.atan()` | Arctangent (result in degrees). |

```javascript
log (30).sin()   // 0.5
log (180).cos()  // -1
```

## Trigonometry (radians)

| Method | Description |
| --- | --- |
| `.radSin()` | Sine (input in radians). |
| `.radCos()` | Cosine (input in radians). |
| `.radTan()` | Tangent (input in radians). |

> Convert between the two with the built-in functions `degtorad(d)` and `radtodeg(r)`. The full set
> of mathematical functions and constants lives in the [`math`](../../packages/math.md) package.

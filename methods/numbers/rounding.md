# Numbers — Rounding

Methods that round a numeric value. They return a new value and never mutate.

#### `.round()` → `int`
Rounds to the nearest integer.

#### `.round(precision)` → `number`
Rounds to `precision` decimal places.

#### `.floor()` → `number`
Rounds down to the nearest integer.

#### `.ceiling()` → `number`
Rounds up to the nearest integer.

> The method is `.ceiling()`, not `ceil`. The standalone **function** form is `ceil(n)` — see
> [Built-in functions](../../functions/builtins.md).

```javascript
log (2.7).round()      // 3
log (3.14159).round(2) // 3.14
log (2.1).ceiling()    // 3
log (2.9).floor()      // 2
```

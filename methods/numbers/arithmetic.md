# Numbers — Arithmetic & Conversion

Sign, magnitude, roots, clamping, primality and character-code conversion.

#### `.abs()` → `number`
Absolute value.

#### `.invabs()` → `number`
Negative absolute value (always ≤ 0).

#### `.sign()` → `string`
Returns `"+"` for zero or positive numbers and `"-"` for negative numbers.

#### `.clamp(min, max)` → `number`
Constrains the value to the range `[min, max]`.

#### `.sqrt()` → `number`
Square root.

#### `.isPrime()` → `boolean`
Whether the (integer) value is prime.

```javascript
log (-8).sign()        // "-"
log (16).sqrt()        // 4
log (90).clamp(0, 60)  // 60
log (7).isPrime()      // true
```

#### `.chr()` → `string`
Interprets the number as a character code and returns the matching character.

```javascript
log (65).chr()  // "A"
```

Numbers also support the universal conversion methods `.toStr()`, `.toInt()`, `.toNum()`,
`.toBool()`, `.getType()`, `.clone()` — see [Type & conversion methods](../types/README.md).

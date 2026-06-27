# Universal — Conversion

These methods exist on every value, converting between types. They return a new value.

#### `.toStr()` → `string`
Converts the value to its string form. Objects and arrays become JSON.

```javascript
log (5).toStr()        // "5"
log { a: 1 }.toStr()   // {"a":1}
```

#### `.toNum()` → `number`
Parses/coerces to a floating-point number. Non-numeric strings become `0`.

```javascript
log "42".toNum()  // 42
log "3.5".toNum() // 3.5
```

#### `.toInt()` → `int`
Converts to an integer, truncating any fractional part.

```javascript
log "42".toInt()   // 42
log (3.9).toInt()  // 3
```

#### `.toBool()` → `boolean`
Interprets the value as a boolean. `true` and the string `"true"` become `true`; everything else
(including other strings and numbers) becomes `false`.

```javascript
log "true".toBool()  // true
log "hi".toBool()    // false
log (1).toBool()     // false
```

> This is a strict parse, **not** general truthiness. The condition in `if`/`while` uses ordinary
> truthiness instead (a non-empty string or non-zero number is true there).

#### `.toArray()` → `array`
Wraps or coerces the value into an array.

#### `.toObject()` → `object`
Coerces an object, array or JSON string into an object.

```javascript
log "{\"a\":1}".toObject()  // {a: 1}
```

## Length & type

#### `.len` → `int`
The length of a string, array or object. **It is a property — no parentheses.**

```javascript
arr = [1, 2, 3]
log arr.len    // 3
log "hello".len // 5
```

> Writing `.len()` with parentheses is an error. To get the type name of a value, use the
> [`typeof(value)`](../../functions/builtins.md) function.

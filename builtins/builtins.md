# Global Built-in Functions

These functions are built into the compiler - you can call them anywhere without importing
anything. They are distinct from **methods** (called on a value with a dot, like `"hi".toUpper()`,
documented under [Methods](../methods/strings/README.md)) and from **packages** (imported with
`import`, documented under [Packages](../packages/README.md)).

> Many of the maths and conversion helpers also exist as methods. Where a method form exists it is
> usually the idiomatic choice - for example prefer `value.toNum()` over `number(value)`.

## Type & reflection

#### `typeof(value)` → `string`
Returns the runtime type name of `value`: `"string"`, `"number"`, `"boolean"`, `"array"`,
`"object"`, `"null"`, and so on.

```javascript
log typeof(5)        // "number"
log typeof("hi")     // "string"
log typeof([1, 2])   // "array"
```

#### `symbol()` → `symbol`
Returns a fresh, globally-unique symbol value. Useful as an unforgeable key or sentinel.

## Type conversion & construction

These cast a value to another type. The method forms (`.toNum()`, `.toStr()`, `.toInt()`,
`.toBool()`, `.toArray()`, `.toObject()`) are preferred in most code - see
[Type methods](../methods/types/README.md).

| Function | Result | Notes |
| --- | --- | --- |
| `int(value)` | `int` | Truncates to an integer. |
| `number(value)` | `number` | Parses/coerces to a float. |
| `string(value)` | `string` | Same as `value.toStr()`. |
| `boolean(value)` | `boolean` | Truthiness of `value`. |
| `object(value)` | `object` | Coerces to an object/map. |
| `array(value)` | `array` | Wraps or coerces to an array. |

Constructors for package-backed types (these import their package automatically):

| Function | Result | Purpose |
| --- | --- | --- |
| `map()` | `map` | New empty [Map](../packages/map.md) (insertion-ordered key/value store). |
| `set()` | `set` | New empty [Set](../packages/set.md). |
| `canvas(w, h, color)` | `canvas` | New drawing [canvas](../packages/canvas.md) of the given size and background colour. |
| `xml(source)` | `xml` | Parses `source` into an [XML](../packages/xml.md) document (no argument ⇒ empty document). |
| `make(type, n)` | `type` | Preallocates an array or object of capacity `n`, e.g. `make(array, 10)`. |

## Maths

| Function | Result | Description |
| --- | --- | --- |
| `abs(n)` | `number` | Absolute value. |
| `round(n)` | `int` | Round to the nearest integer. |
| `ceil(n)` | `number` | Round up. |
| `floor(n)` | `number` | Round down. |
| `min(a, b)` | `number` | Smaller of two values. |
| `min(...arr)` | `number` | Smallest of a spread array. |
| `max(a, b)` | `number` | Larger of two values. |
| `max(...arr)` | `number` | Largest of a spread array. |
| `random(min, max)` | `number` | Random value between `min` and `max`. |
| `dist(x1, y1, x2, y2)` | `number` | Euclidean distance between two points. |
| `gcd(a, b)` | `int` | Greatest common divisor. |
| `lcm(a, b)` | `int` | Lowest common multiple. |
| `degtorad(deg)` | `number` | Degrees → radians. |
| `radtodeg(rad)` | `number` | Radians → degrees. |

```javascript
log abs(-3)            // 3
log round(2.7)         // 3
log min(3, 7)          // 3
log max(...[4, 9, 2])  // 9
log dist(0, 0, 3, 4)   // 5
```

Other maths (powers, roots, trigonometry, logarithms) are available as **number methods** -
`n.sqrt()`, `n.sin()`, `n.clamp(lo, hi)`, … - see [Number methods](../methods/numbers/README.md), or
via the [`math`](../packages/math.md) package for the full set.

## Encoding

| Function | Result | Description |
| --- | --- | --- |
| `btoa(str)` | `string` | Base64-encode a string. |
| `atob(str)` | `string` | Decode a Base64 string. |
| `encodeURIComponent(str)` | `string` | Percent-encode for use in a URL. |
| `decodeURIComponent(str)` | `string` | Reverse `encodeURIComponent`. |

```javascript
log btoa("hi")               // "aGk="
log atob("aGk=")             // "hi"
log encodeURIComponent("a b") // "a%20b"
```

## Control & error handling

#### `try(expression)` → `result`
Runs `expression`, catching any error. Returns a [`result`](../packages/result.md): `ok(value)` if it
succeeded, or `err(message)` if it threw. Importing `osl/result` happens automatically.

```javascript
auto r = try(risky())
if r.isOk() (
  log r.unwrap()
) else (
  log "failed: " ++ r.unwrapErr()
)
```

#### `some(value)` → `option` / `none()` → `option`
Construct an [optional](../packages/option.md) value - `some(v)` for a present value, `none()` for
absence. Importing `osl/option` happens automatically.

#### `ask(prompt)` → `result`
Prints `prompt` and reads a line from standard input, returning a [`result`](../packages/result.md).
Also available as a string method: `"Name? ".ask()`.

```javascript
auto name = ask("What is your name? ").unwrapOr("anonymous")
```

## Advanced

#### `raw(goCode)`
Emits `goCode` verbatim into the generated Go program - an escape hatch for dropping to Go. Use
sparingly; it bypasses OSL's type checks.

---

### See also

- **Statements** like `log` / `say`, `wait(ms)`, `return`, `throw`, `defer` are *commands*, not
  functions - see [Commands](../commands/debugging/README.md).
- **Methods** on values: [Strings](../methods/strings/README.md),
  [Numbers](../methods/numbers/README.md), [Arrays](../methods/arrays/README.md),
  [Objects](../methods/objects/README.md), [Types & conversion](../methods/types/README.md).

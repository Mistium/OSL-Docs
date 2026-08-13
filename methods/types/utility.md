# Universal - Utility

General-purpose methods available on every value.

#### `.clone()` → *same type*
Returns an independent deep copy. Assigning with `=` shares a reference; `.clone()` does not, so
mutating the copy never affects the original.

```javascript
a = [1, 2, 3]
b = a.clone()
void b.append(4)
log a  // [1, 2, 3] - unchanged
```

#### `.item(key)` → `unknown`
Reads an element or field dynamically: by 1-based index for arrays/strings, by key for objects. Handy
when the key is computed.

```javascript
arr = [10, 20, 30]
log arr.item(2)      // 20
o = { a: 7 }
log o.item("a")      // 7
```

#### `.reverse()` → *same type*
Reverses a string or array.

```javascript
log "abc".reverse()      // "cba"
log [1, 2, 3].reverse()  // [3, 2, 1]
```

#### `.call(...args)` → `unknown`
Invokes a value that holds a function, passing `args`.

```javascript
auto double = x -> x * 2
log double.call(5)  // 10
```

#### `.match(pattern)` → `array`
Returns the matches of a string against `pattern`. See also the
[`regex`](../../packages/regex.md) package.

## Type assertions (advanced)

These perform a **runtime downcast** of an `any` value - they do not parse or convert. The value must
already be exactly the named type or the program errors.

#### `.assert(type)` → *type*
Asserts the value is `type` and returns it as that type; errors at runtime if it is not.
If the compiler already knows the value's type, a matching assertion is removed and produces a
redundant-assertion warning; a mismatched assertion is a compile error.

Nullable values are the exception: `.assert(T)` on `T?` performs a runtime non-null assertion and
narrows the result to `T`.
#### `.assertElse(type, default)` → *type*
Like `.assert`, but returns `default` instead of erroring on a type mismatch.
Using it on a statically known type produces a warning because either the value is already that type
or the fallback is always selected. It is intended for `any` values.
As with `.assert(T)`, calling `.assertElse(T, default)` on `T?` is valid narrowing: it returns the
non-null value or `default`, without a redundant-assertion warning.

```javascript
any value = "x"
auto n = value.assertElse("number", 0)  // 0 - value is not a number
```

> These are strict about the underlying runtime type. Prefer `.toNum()` / `.toInt()` when you want
> conversion rather than a checked cast.

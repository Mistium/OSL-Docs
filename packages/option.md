# option

Use `option` for an optional value whose absence must be told apart from `null`: `some(value)`
holds a value, which may itself be `null`, and `none()` holds nothing.

`option` is a built-in language type. It needs no package import.

## Example

```osl
option<int> count = some(1)
option<int> empty = none()

log count           // some(1)
log empty           // none
log count.unwrap()  // 1
log empty.unwrapOr(0)
log empty.isNone()  // true
```

`some` keeps the value's type, so a typed value produces a typed option.

## API reference

### Constructors

| Function | Returns | Notes |
| --- | --- | --- |
| `some(value)` | `option<T>` | A present option holding `value`. `some(null)` is present. |
| `none()` | `option` | An empty option. |

### `option` values

| Method | Returns | Notes |
| --- | --- | --- |
| `o.isSome()` | `boolean` | Whether the option holds a value, which may be `null`. |
| `o.isNone()` | `boolean` | Whether the option is empty. |
| `o.unwrap(message?)` | `T` | The value. Throws `StateError` when the option is empty, or `message` when given, as `result.unwrap` does. |
| `o.unwrapOr(fallback: T)` | `T` | The value, or `fallback` when the option is empty. |
| `o.expect(message)` | `T` | The value, or throws `message` when the option is empty. |

`log` prints an option as `some(value)` or `none`.

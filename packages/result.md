# result

A `result<T, E>` is the value of an operation that either succeeded with a `T` or failed with an
`E`, usually an `error`. Package functions that can fail because of the outside world (a missing
file, a network error, bad input data) return `result<T, error>`.

`result` is a built-in language type and the `result` package value is always available; no import
is needed. See [Errors and results](../guide/errors.md) for how results unwrap themselves, `catch`,
and `try`.

## Example

```osl
def findUser(string id) result<string, error> (
  if id != "1" ( return result.err(error("NotFoundError", "no user " ++ id)) )
  return result.ok("Ada")
)

string name = findUser("1")        // a typed declaration unwraps the result
log name                           // Ada

auto missing = findUser("2")       // auto keeps the result
log missing.isErr()                // true
log missing.unwrapOr("guest")      // guest
log missing.unwrapErr().kind       // NotFoundError
log missing                        // NotFoundError: no user 2
```

Checked conversions produce a typed result too:

```osl
result<int8, error> parsed = "42".tryAs<int8>
int8 value = parsed.unwrapOr(0)
log value
```

See [checked conversion](../guide/types.md#checked-conversion) for validation rules.

## Unit

`unit` is the single empty value. Use it for operations that succeed with nothing to return:

```osl
def save(string name) result<, error> (
  if name == "" return result.err(error("ValueError", "name is required"))
  return result.ok()
)

if save("notes") ( log "saved" )
```

`result.ok()` with no arguments is a `unit` success. In a `result` type either side may be left
empty to mean `unit`, so `result<, error>` is `result<unit, error>`. In a condition, or anywhere a
`boolean` is expected, a `result<unit, error>` means "did it succeed".

## API reference

### `result`

| Method | Returns | Notes |
| --- | --- | --- |
| `result.ok(value?: any)` | `result` | A successful result holding `value`, or `unit` with no argument. |
| `result.err(error: any)` | `result` | A failed result, usually holding an `error` such as `error("NotFoundError", "no such user")`. |
| `result.fromGo(value: any, err: any)` | `result` | Turns a Go value and error pair into a result: `ok(value)` when `err` is `null`, otherwise a failed result with a typed error. A Go error gets the kind that describes it, a `"Kind: message"` string keeps its kind, and anything else is a `RuntimeError`. |

### `result` values

An unparameterized `result` keeps both sides as `any`. A `result<T>` keeps the success type and
types its error side as `string`; use `result<T, error>` to type both.

| Method | Returns | Notes |
| --- | --- | --- |
| `r.isOk()` | `boolean` | Whether the result holds a value. |
| `r.isErr()` | `boolean` | Whether the result holds an error. |
| `r.unwrap(message?)` | `T` | The value. When the result failed, throws its error, or `message` when given. |
| `r.unwrapOr(fallback: T)` | `T` | The value, or `fallback` when the result failed. |
| `r.expect(message)` | `T` | The value, or throws `message` when the result failed. |
| `r.unwrapErr(message?)` | `E` | The error. Throws `StateError`, or `message` when given, when the result holds a value. |
| `r.expectErr(message)` | `E` | The error, or throws `message` when the result holds a value. |
| `r.unwrapAs(type)` | `type` | The value checked against an OSL type, as in `r.unwrapAs(int)` or `r.unwrapAs(string[])`; `any` accepts every value. Throws the error when the result failed and `TypeError` when the value has another type. |

`log` prints an ok result as its value and a failed one as its error, `Kind: message`, without
throwing. `typeof` reports `"result"`.

## Deprecated

These still work for one release with their old behaviour and draw an `OSL-DEPRECATED` warning:

| Deprecated | Use instead |
| --- | --- |
| `r.fromGo(value, err)` on a result value | `result.fromGo(value, err)` |

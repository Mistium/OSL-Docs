# result

Use `result` to return either a success value or an error value from APIs that should not throw immediately.

`result` is a built-in language type. It needs no package import.

## Example

```osl
auto ok = result.ok(42)
log ok.unwrapOr(0)
```

Checked conversions produce a typed result without needing an import:

```osl
result<int8, error> parsed = text.tryAs<int8>
int8 value = parsed.unwrapOr(0)
```

See [checked conversion](../guide/types.md#checked-conversion) for validation rules.

## Errors

Build error values with `error(message)` and read them back through `.message`:

```osl
error problem = error("disk is full")
log problem.message

result<int, error> missing = result.err(error("not found"))
log missing.unwrapErr().message
```

`error` values work with `throw`, `try`, `catch`, string conversion, and every
`result` accessor. Older code may carry plain strings instead; both are valid
error payloads, but new code should use `error`.

## Unit

`unit` is the single empty value. Use it for operations that succeed with
nothing to return:

```osl
def save(string name) result<, error> (
  if name == "" return result.err(error("name is required"))
  return result.ok()
)
```

`result.ok()` with no arguments produces a `unit` success. In a `result`
declaration, either side may be left empty to mean `unit`, so
`result<, error>` is `result<unit, error>` and `result<int,>` is
`result<int, unit>`.

## API reference

### `result`

| Method | Returns |
| --- | --- |
| `result.ok(v: any)` | `result` |
| `result.err(e: any)` | `result` |

### `result` values

Methods available on `result` values constructed by the language or returned by APIs.
An unparameterized `result` preserves success and error values as `any`. A `result<T>` keeps the
success type and defaults its error accessor to `string`; use `result<T, E>` to specify both sides.

| Method | Returns | Notes |
| --- | --- | --- |
| `value.isOk()` | `boolean` |  |
| `value.isErr()` | `boolean` |  |
| `value.unwrap()` | `any` | Returns the success value, or fails for an error result. |
| `value.unwrapOr(def: any)` | `any` | Returns the contained value or a fallback. |
| `value.expect(msg: any)` | `any` | Returns the contained value or fails with a custom message. |
| `value.unwrapErr()` | `any` | Returns the error value, or fails for a success result. |
| `value.expectErr(msg: any)` | `any` | Uses the same error-side accessor with a custom failure message. |
| `value.fromGo(val: any, err: error)` | `result` | Creates from go. |

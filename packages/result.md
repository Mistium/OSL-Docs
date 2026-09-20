# result

Use `result` to return either a success value or an error value from APIs that should not throw immediately.

`result` is a built-in language type. It needs no package import.

## Example

```osl
auto ok = result.ok(42)
log ok.unwrapOr(0)
```

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

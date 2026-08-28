# result

Use `result` to return either a success value or an error value from APIs that should not throw immediately.

```osl
import "std:result"
```

## Example

```osl
import "std:result"

auto ok = result.ok(42)
log ok.unwrapOr(0)
```

## API reference

### `result`

| Method | Returns |
| --- | --- |
| `result.ok(v: any)` | `*Result` |
| `result.err(e: any)` | `*Result` |

### `Result` values

Methods available on `Result` values returned by this package or constructed by the language.
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
| `value.fromGo(val: any, err: error)` | `*Result` | Creates from go. |

## Notes

- Prefer `import "std:result"`; the older `import "osl/result"` spelling remains supported.

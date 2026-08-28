# option

Use `option` to model a value that may be present (`some`) or absent (`none`) without relying on `null`.

```osl
import "std:option"
```

## Example

```osl
import "std:option"

auto value = some(42)
log value.unwrapOr(0)
```

## API reference

### `Option` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.isSome()` | `boolean` |  |
| `value.isNone()` | `boolean` |  |
| `value.unwrap()` | `T` | Returns the stored value, or fails for `none`. |
| `value.unwrapOr(def: T)` | `T` | Returns the contained value or a fallback. |
| `value.expect(msg: any)` | `T` | Uses the same checked accessor with a custom failure message. |

## Notes

- Prefer `import "std:option"`; the older `import "osl/option"` spelling remains supported.

## Behavior and limits

`some(null)` remains a present option; presence is not inferred from whether
the stored value is null.

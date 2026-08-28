# option

Use `option` to model a value that may be present (`some`) or absent (`none`) without relying on `null`.

```javascript
import "std:option"
```

## Example

```javascript
import "std:option"

auto value = some(42)
log value.unwrapOr(0)
```

## API reference

### `Option` values

| Method | Returns | Description |
| --- | --- | --- |
| `value.isSome()` | `boolean` | Reports whether the option contains a value. |
| `value.isNone()` | `boolean` | Reports whether the option is empty. |
| `value.unwrap()` | `T` | Returns through the shared checked accessor or fails. |
| `value.unwrapOr(def: T)` | `T` | Returns the contained value or a fallback. |
| `value.expect(msg: any)` | `T` | Uses the same checked accessor with a custom failure message. |

## Notes

- Prefer `import "std:option"`; the older `import "osl/option"` spelling remains supported.

## Edge-case behavior

`some(null)` remains a present option; presence is not inferred from whether
the stored value is null.

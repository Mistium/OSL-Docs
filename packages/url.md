# url

Use `url` for parsing, building, joining, escaping, and editing URLs and query strings.

```osl
import "std:url"
```

## Example

```osl
import "std:url"

auto u = url.parse("https://example.com?a=1")
log u["host"]
```

## API reference

### `url`

| Method | Returns | Notes |
| --- | --- | --- |
| `url.parse(raw: any)` | `object` | Parses a URL into its components. |
| `url.build(parts: object)` | `string` | Builds a URL using the same scalar and repeated query-value applicator as `encode` and `withParams`. |
| `url.encode(m: object)` | `string` | Encodes scalar and array values as a query string. |
| `url.decode(query: any)` | `object` | Decodes a URL-encoded query string into an object. |
| `url.escape(s: any)` | `string` |  |
| `url.unescape(s: any)` | `string` |  |
| `url.isValid(raw: any)` | `boolean` | Requires a valid URL with both a scheme and host. |
| `url.join(base: any, ref: any)` | `string` |  |
| `url.withParams(raw: any, params: object)` | `string` | Adds or replaces scalar and repeated query values using the same rules as `encode`. |
| `url.param(raw: any, key: any)` | `string` |  |

## Notes

- Prefer `import "std:url"`; the older `import "osl/url"` spelling remains supported.

## Behavior and limits

Parsing preserves encoded paths and repeated query keys. Malformed escapes and invalid ports are
rejected.

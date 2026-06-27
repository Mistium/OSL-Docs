# url

> URL parsing, building and query-string handling

Use `url` for parsing, building, joining, escaping, and editing URLs and query strings.

```javascript
import "osl/url"
```

## Example

```javascript
import "osl/url"

auto u = url.parse("https://example.com?a=1")
log u["host"]
```

## API reference

### `url`

| Method | Returns | Description |
| --- | --- | --- |
| `url.parse(raw: any)` | `object` | Parses input data. |
| `url.build(parts: object)` | `string` | Runs the build operation. |
| `url.encode(m: object)` | `string` | Runs the encode operation. |
| `url.escape(s: any)` | `string` | Runs the escape operation. |
| `url.unescape(s: any)` | `string` | Runs the unescape operation. |
| `url.isValid(raw: any)` | `boolean` | Reports whether the input is valid. |
| `url.join(base: any, ref: any)` | `string` | Runs the join operation. |
| `url.withParams(raw: any, params: object)` | `string` | Runs the with params operation. |
| `url.param(raw: any, key: any)` | `string` | Runs the param operation. |

## Notes

- Standard-library imports accept both `import "osl/url"` and `import "url"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

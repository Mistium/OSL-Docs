# json

> JSON parsing and encoding

Use `json` for parsing JSON into OSL values, serialising values, pretty-printing, and validating JSON strings.

```javascript
import "osl/json"
```

## Example

```javascript
import "osl/json"

auto parsed = json.parse("{\"ok\":true}")
if parsed.isOk() (
  log parsed.unwrap()["ok"]
)
```

## API reference

### `json`

| Method | Returns | Description |
| --- | --- | --- |
| `json.parse(data: any, options: object)` | `*Result` | Parses input data. |
| `json.stringify(data: any)` | `string` | Serialises a value to text. |
| `json.format(data: any)` | `string` | Formats a value for display. |
| `json.isValid(data: any)` | `boolean` | Reports whether the input is valid. |
| `json.isObject(data: any)` | `boolean` | Reports whether object. |
| `json.isArray(data: any)` | `boolean` | Reports whether array. |

## Notes

- Standard-library imports accept both `import "osl/json"` and `import "json"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

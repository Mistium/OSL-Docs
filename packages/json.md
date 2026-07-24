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
| `json.inspectFile(path: any, keys: array, maxBytes: number, maxValues: number)` | `*Result` | Validates a JSON file without loading its object tree and collects up to `maxValues` string values stored directly under the selected keys. The successful value is `{values, counts, root, size}`. |

## Inspecting large files

```javascript
import "osl/json"

result inspected = json.inspectFile("project.json", ["md5ext"], 1073741824, 2000)
if inspected.isOk() (
  object details = inspected.unwrap()
  log details.values.assert(object).md5ext
)
```

## Notes

- Standard-library imports accept both `import "osl/json"` and `import "json"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

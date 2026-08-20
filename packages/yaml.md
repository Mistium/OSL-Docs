# yaml

> YAML parsing and encoding

Use `yaml` for parsing YAML, writing YAML, converting to or from JSON, and editing map values.

```javascript
import "std:yaml"
```

## Example

```javascript
import "std:yaml"

auto data = yaml.parse("name: Ada")
log data["name"]
```

## API reference

### `yaml`

| Method | Returns | Description |
| --- | --- | --- |
| `yaml.parse(source: any)` | `any` | Parses input data. |
| `yaml.stringify(data: any)` | `string` | Serializes through the shared marshal-to-string path. |
| `yaml.toJSON(yamlData: any)` | `string` | Parses YAML and uses the same marshal-to-string path for JSON. |
| `yaml.fromJSON(jsonData: any)` | `any` | Parses a JSON object, returning `null` for invalid input. |
| `yaml.get(data: any, key: any)` | `any` | Returns the value at the string-converted key. |
| `yaml.set(data: object, key: any, value: any)` | `object` | Sets a value at the string-converted key. |
| `yaml.merge(data1: object, data2: object)` | `object` | Clones the first map and recursively merges nested maps from the second. |
| `yaml.keys(data: object)` | `array` | Returns all keys. |
| `yaml.values(data: object)` | `array` | Collects all values using the standard map iterator. |
| `yaml.has(data: object, key: any)` | `boolean` | Reports whether the value exists. |
| `yaml.delete(data: object, key: any)` | `object` | Deletes a value. |

## Notes

- Prefer `import "std:yaml"`; the older `import "osl/yaml"` spelling remains supported.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Anchors, aliases, duplicate keys, non-string map keys, multi-document input,
and deep nesting return deterministic results or controlled errors.

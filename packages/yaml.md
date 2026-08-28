# yaml

Use `yaml` for parsing YAML, writing YAML, converting to or from JSON, and editing map values.

```osl
import "std:yaml"
```

## Example

```osl
import "std:yaml"

auto data = yaml.parse("name: Ada")
log data["name"]
```

## API reference

### `yaml`

| Method | Returns | Notes |
| --- | --- | --- |
| `yaml.parse(source: any)` | `any` | Parses input data. |
| `yaml.stringify(data: any)` | `string` | Serializes an OSL value as YAML. |
| `yaml.toJSON(yamlData: any)` | `string` | Parses YAML and returns JSON text. |
| `yaml.fromJSON(jsonData: any)` | `any` | Parses a JSON object, returning `null` for invalid input. |
| `yaml.get(data: any, key: any)` | `any` | Returns the value at the string-converted key. |
| `yaml.set(data: object, key: any, value: any)` | `object` | Sets a value at the string-converted key. |
| `yaml.merge(data1: object, data2: object)` | `object` | Clones the first map and recursively merges nested maps from the second. |
| `yaml.keys(data: object)` | `array` | Returns all keys. |
| `yaml.values(data: object)` | `array` | Collects all values using the standard map iterator. |
| `yaml.has(data: object, key: any)` | `boolean` |  |
| `yaml.delete(data: object, key: any)` | `object` | Deletes a value. |

## Notes

- Prefer `import "std:yaml"`; the older `import "osl/yaml"` spelling remains supported.

## Behavior and limits

Anchors, aliases, duplicate keys, non-string map keys, multiple documents, and excessive nesting
produce defined results or return an error instead of panicking.

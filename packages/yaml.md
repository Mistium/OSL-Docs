# yaml

> YAML parsing and encoding

Use `yaml` for parsing YAML, writing YAML, converting to or from JSON, and editing map values.

```javascript
import "osl/yaml"
```

## Example

```javascript
import "osl/yaml"

auto data = yaml.parse("name: Ada")
log data["name"]
```

## API reference

### `yaml`

| Method | Returns | Description |
| --- | --- | --- |
| `yaml.parse(source: any)` | `any` | Parses input data. |
| `yaml.stringify(data: any)` | `string` | Serialises a value to text. |
| `yaml.toJSON(yamlData: any)` | `string` | Converts to json. |
| `yaml.fromJSON(jsonData: any)` | `any` | Creates from json. |
| `yaml.get(data: any, key: any)` | `any` | Returns a value. |
| `yaml.set(data: object, key: any, value: any)` | `object` | Sets a value. |
| `yaml.merge(data1: object, data2: object)` | `object` | Runs the merge operation. |
| `yaml.keys(data: object)` | `array` | Returns all keys. |
| `yaml.values(data: object)` | `array` | Returns all values. |
| `yaml.has(data: object, key: any)` | `boolean` | Reports whether the value exists. |
| `yaml.delete(data: object, key: any)` | `object` | Deletes a value. |

## Notes

- Standard-library imports accept both `import "osl/yaml"` and `import "yaml"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

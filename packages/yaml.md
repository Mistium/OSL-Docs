# yaml

Use `yaml` to parse YAML text into OSL values and to write values as YAML.

```osl
import "std:yaml"
```

## Example

```osl
import "std:yaml"

object config = yaml.parse("name: Ada\nport: 8080\ntags:\n  - web\n  - api\n")
log config.name     // Ada
log config.port + 1 // 8081

log yaml.stringify(config, {indent: 2})
```

`yaml.parse` returns `result<any, error>`. Assigning it to a typed variable unwraps it and throws on malformed YAML. Use `catch`, `try(...)`, or `auto` to handle the error yourself:

```osl
import "std:yaml"

auto parsed = yaml.parse("a: 1\na: 2")
if parsed.isErr() (
  log parsed.unwrapErr().message
)
```

## API reference

### `yaml`

| Function | Returns | Notes |
| --- | --- | --- |
| `yaml.parse(text: string)` | `result<any, error>` | Parses one YAML document. Mappings become objects with string keys, sequences become arrays, and scalars become strings, numbers, booleans, or `null`. An empty document is `null`. |
| `yaml.parseFile(path: string)` | `result<any, error>` | Reads a file and parses it like `parse`. |
| `yaml.isValid(text: string)` | `boolean` | Whether `yaml.parse` accepts the text. |
| `yaml.stringify(value: any, options?: object)` | `string` | Writes a value as YAML with object keys in sorted order and a trailing newline. Options: `indent` (spaces per level, 2 to 16, default 4). |

### Errors

| Function | Kind | When |
| --- | --- | --- |
| `parse`, `parseFile` | `ParseError` | Malformed YAML, duplicate keys, or recursive aliases. The message names the line. |
| `parseFile` | `NotFoundError`, `PermissionError`, `IOError` | The file can't be read. |
| `stringify` | throws `TypeError` | Values YAML can't represent, such as functions. |
| `stringify` | throws `ValueError` | A value that contains itself. |

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning. The object helpers change `data` in place, as they always did.

| Deprecated | Use instead |
| --- | --- |
| `yaml.toJSON(text)` | `json.stringify(yaml.parse(text))` |
| `yaml.fromJSON(text)` | `json.parse(text)` |
| `yaml.get(data, key)` | `data[key]` |
| `yaml.set(data, key, value)` | `data[key] = value` |
| `yaml.keys(data)` | `data.getKeys().sort()` |
| `yaml.values(data)` | `data.getValues()` |
| `yaml.has(data, key)` | `data.contains(key)` |
| `yaml.delete(data, key)` | `data.delete(key)` |
| `yaml.merge(a, b)`, `yaml.mergeCloned(a, b)` | `{...a, ...b}` for a shallow merge, or a loop for nested objects |

## Behavior and limits

- Timestamps stay strings exactly as written: `since: 2024-01-02` parses as `"2024-01-02"`.
- Non-string mapping keys become strings, so `1: one` gives the key `"1"`.
- Anchors and aliases are expanded. A text with several documents (`---`) parses only the first.
- The older `import "osl/yaml"` spelling still works with a migration warning.

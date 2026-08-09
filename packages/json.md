# json

> JSON parsing and encoding

Use `json` for parsing JSON into OSL values, serialising values, pretty-printing, validating JSON strings, and streaming large JSON files.

```javascript
import "osl/json"
```

## Example

```javascript
import "osl/json"

auto parsed = json.parse("{\"ok\":true}", {})
if parsed.isOk() (
  log parsed.unwrap()["ok"]
)
```

## API reference

### `json`

| Method | Returns | Description |
| --- | --- | --- |
| `json.parse(data: any, options: object)` | `*Result` | Parses one root value using the same trailing-data validation as streams. |
| `json.parseObject(data: any)` | `*Result` | Parses one JSON object, returning an error result for invalid JSON or another root type. |
| `json.parseArray(data: any)` | `*Result` | Parses one JSON array, returning an error result for invalid JSON or another root type. |
| `json.stringify(data: any)` | `string` | Serialises a value as compact JSON without HTML escaping. |
| `json.format(data: any)` | `string` | Serialises the same value as two-space-indented JSON. |
| `json.isValid(data: any)` | `boolean` | Reports whether the input is valid. |
| `json.isObject(data: any)` | `boolean` | Reports whether object. |
| `json.isArray(data: any)` | `boolean` | Reports whether array. |
| `json.open(path: any, maxBytes?: number)` | `*json.Stream` | Opens one JSON document for incremental token reading. |

## Streaming large files

`json.open(path, maxBytes?)` returns a `*json.Stream`. The optional byte limit rejects an oversized file before it is read. Opening and parsing errors are reported by `stream.ok()` and `stream.error()`.

```javascript
import "osl/json"

*json.Stream stream = json.open("project.json", 1073741824)
while stream.more() (
  object event = stream.next()
  if event.type == "key" and event.value == "extensionURLs" (
    object urls = stream.readStringMap(100).unwrap().assert(object)
    log urls
  )
)
if !stream.ok() (
  log stream.error()
)
stream.close()
```

### Stream tokens

`stream.next()` returns an object with `type`, `value`, and `depth` fields. Object and array boundaries share one container-event path.

| Type | Value |
| --- | --- |
| `object-start`, `object-end` | `null` |
| `array-start`, `array-end` | `null` |
| `key` | The object key string |
| `string`, `number`, `boolean` | The decoded scalar |
| `null` | `null` |
| `eof` | `null`, returned when no token remains |

Root values have depth `0`. Keys and values directly inside a root object have depth `1`.

### Stream methods

#### `stream.more()` → `boolean`

Returns `true` when another token is available. It returns `false` at the end of the document or after a parsing error. Check `stream.ok()` after a loop to distinguish those cases.

#### `stream.next()` → `object`

Consumes and returns the next token as `{type, value, depth}`. It returns an `eof` token when no token remains.

#### `stream.readScalarMap(maxValues)` → `*Result`

Consumes the next value as a flat JSON object and returns it. Values may be strings, numbers, booleans, or `null`. Nested objects and arrays return an error. `maxValues` bounds the number of object entries.

#### `stream.readStringMap(maxValues)` → `*Result`

Like `readScalarMap`, but every value must be a string.

#### `stream.skip()` → `boolean`

Consumes the next complete JSON value. Objects and arrays are skipped recursively without being loaded into memory. Returns `false` at the end of the document or after a parsing error.

#### `stream.ok()` → `boolean`

Returns `false` if opening or parsing the document failed.

#### `stream.error()` → `string`

Returns the opening or parsing error, or an empty string when there is no error.

#### `stream.close()` → `boolean`

Closes the file and returns whether closing succeeded.

## Notes

- Standard-library imports accept both `import "osl/json"` and `import "json"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Parsing supports any JSON root value, rejects trailing data, numeric overflow,
and excessive nesting, and bounds stream reads. Numbers decode as `float64`, so
large integers outside its exact range may lose precision.

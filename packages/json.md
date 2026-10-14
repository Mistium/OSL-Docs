# json

Use `json` to parse JSON text into OSL values, encode values as JSON, check JSON strings, and read large JSON files one token at a time.

```osl
import "std:json"
```

## Example

```osl
import "std:json"

object config = json.parse("{\"name\": \"osl\", \"tags\": [\"a\", \"b\"]}")
log config.name
log json.stringify(config, {indent: 2})

object settings = json.parse("{nope}") catch (err) (
  log err.kind ++ ": " ++ err.message
  return
)
log settings
```

`json.parse` returns `result<any, error>`. Assigning it to a typed variable unwraps it and throws the error on failure. Use `catch`, `try(...)`, or `auto` to handle the error yourself:

```osl
import "std:json"

auto parsed = json.parse("[1, 2]", {type: "object"})
if parsed.isErr() (
  log parsed.unwrapErr().message // json.parse: expected a JSON object, got array
)
```

Pass a type argument to check the parsed value against an OSL type. A value that doesn't match fails the result with a `ParseError` naming where the mismatch is, with array positions counted from 1:

```osl
import "std:json"

log json.parse<int>("41") + 1                 // 42
int[] scores = json.parse<int[]>("[90, 72]")
log scores                                    // [90,72]
log json.parse<int[]>("[1, \"two\"]").unwrapErr().message
// json.parse: at [2]: expected int, got string
```

## API reference

### `json`

| Function | Returns | Notes |
| --- | --- | --- |
| `json.parse(text: string, options?: object)` | `result<any, error>` | Parses one JSON document. Options: `type` (`"object"`, `"array"`, or `"any"`, the default). |
| `json.parse<T>(text: string)` | `result<T, error>` | Parses and checks the value against `T`. A mismatch fails with `ParseError` naming the 1-based path, the expected type, and the JSON value found, such as `at users[2].age: expected int, got string`. A key a struct doesn't declare fails too. |
| `json.parseFile(path: string, options?: object)` | `result<any, error>` | Reads and parses a file. Takes the same options as `parse`. |
| `json.stringify(value: any, options?: object)` | `string` | Encodes a value as JSON with object keys in sorted order. Options: `indent` (spaces per level, default `0` for compact output). |
| `json.isValid(text: string)` | `boolean` | Whether `json.parse` accepts the text. |
| `json.isObject(text: string)` | `boolean` | Whether the text is valid JSON with an object at the root. |
| `json.isArray(text: string)` | `boolean` | Whether the text is valid JSON with an array at the root. |
| `json.open(path: string, options?: object)` | `result<*json.Stream, error>` | Opens a JSON file for reading one token at a time. Options: `maxBytes` (refuse larger files; no limit by default). |

### Errors

| Function | Kind | When |
| --- | --- | --- |
| `parse`, `parseFile` | `ParseError` | Malformed JSON, duplicate object keys, numbers out of range, trailing data, or a root that doesn't match `type`. The message names the line and column. |
| `parse<T>` | `ParseError` | The document doesn't fit `T`. The message names the path, such as `at [2].y`. |
| `parseFile`, `open` | `NotFoundError`, `PermissionError`, `IOError` | The file can't be read. |
| `open` | `ValueError` | The file is larger than `maxBytes`. |
| `stringify` | throws `ValueError` | `NaN`, infinite numbers, and cyclic values. |
| `stringify` | throws `TypeError` | Values JSON can't represent, such as functions. |

An unknown option key throws `ValueError` naming the accepted keys.

## Streaming large files

`json.open` returns a `*json.Stream`. It reads the file as you go, so a large document never has to fit in memory.

```osl
import "std:json"

*json.Stream stream = json.open("project.json", {maxBytes: 1073741824})
for event in stream.events() (
  if event.type == "key" and event.depth == 1 (
    if event.value == "extensionURLs" (
      object urls = stream.readObject({maxKeys: 100, stringsOnly: true})
      log urls
    ) else if event.value == "targets" (
      stream.skip()
    )
  )
)
stream.close()
```

### `*json.Stream` methods

| Method | Returns | Notes |
| --- | --- | --- |
| `stream.events()` | `iter<json.Event>` | Iterates over the rest of the document one token at a time. The loop shares the stream's position, so `skip()` and `readObject()` inside it consume tokens. Throws `ParseError` (with line and column) when the file is malformed; wrap the loop in `try(...)` to handle it. |
| `stream.skip()` | `result<boolean, error>` | Skips the next value without decoding it, however deeply nested. After a `key` event it skips that key's value. `false` at the end of the document or when the next token closes the enclosing container. Fails with `ParseError` for malformed JSON. |
| `stream.readObject(options?: object)` | `result<object, error>` | Reads the next value, which must be a flat object of strings, numbers, booleans, or `null`. Options: `maxKeys` (fail with `ValueError` when the object has more keys) and `stringsOnly` (require string values, default `false`). Fails with `ParseError` for any other shape. |
| `stream.close()` | `result<unit, error>` | Closes the file. Closing twice does nothing. |

Every method except `close` throws `StateError` once the stream is closed.

### Events

Each event is a `json.Event` record `{type, value, depth}`:

| `type` | `value` |
| --- | --- |
| `object-start`, `object-end`, `array-start`, `array-end` | `null` |
| `key` | The object key |
| `string`, `number`, `boolean` | The decoded scalar |
| `null` | `null` |

`depth` is how many containers enclose the token. The root value has depth `0`, and keys and values directly inside a root object have depth `1`.

## Changes from earlier versions

`json.parseObject`, `json.parseArray`, and `json.format` are gone: pass `{type: "object"}`, `{type: "array"}`, or `{indent: 2}` to `parse` and `stringify` instead. `json.open` takes its limit only as `{maxBytes}`. On a stream, `more()`/`next()` became `for event in stream.events()`, and `readScalarMap(n)`/`readStringMap(n)` became `readObject({maxKeys: n})` (add `stringsOnly: true` for the string form).

## Behavior and limits

- Any JSON value can be the root. Nesting deeper than 1000 levels (10000 in a stream) fails with `ParseError`.
- JSON numbers are 64-bit floating point, so very large integers can lose precision.
- `stringify` doesn't escape HTML characters. It sees a consistent snapshot of shared objects and arrays, so it is safe while another thread changes them.
- The older `import "osl/json"` spelling still works with a migration warning.

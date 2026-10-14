# mime

Use `mime` to look up media types by file extension, and to parse and format `Content-Type` values.

```osl
import "std:mime"
```

## Example

```osl
import "std:mime"

string contentType = mime.typeByFilename("photos/cat.png") ?? "application/octet-stream"
log contentType                         // image/png
log mime.extByType("image/jpeg")        // .jpg

auto ct = mime.parse("text/html; charset=\"UTF-8\"")
log ct.type                             // text/html
log ct.params["charset"]                // UTF-8
log mime.format("text/plain", {charset: "utf-8"}) // text/plain; charset=utf-8
```

## API reference

### Lookups

These return `null` when the extension or type is unknown.

| Function | Returns | Notes |
| --- | --- | --- |
| `mime.typeByExt(ext: string)` | `string?` | The media type for an extension, with or without the dot: `"json"` or `".json"` gives `"application/json"`. Text types carry a charset, as in `"text/html; charset=utf-8"`. |
| `mime.typeByFilename(path: string)` | `string?` | The media type for a file name or path, from its extension. |
| `mime.extByType(mediaType: string)` | `string?` | The usual extension for a media type, with its dot (`".png"`). Parameters are ignored. |

### Content-Type values

| Function | Returns | Notes |
| --- | --- | --- |
| `mime.parse(text: string)` | `result<{type, params}, error>` | Splits a `Content-Type` value into its lowercased media type and a `params` object mapping each lowercased parameter name to its unquoted value. Fails with `ParseError` when the text isn't a `type/subtype` pair or repeats a parameter. |
| `mime.format(mediaType: string, params: object)` | `string` | Builds a `Content-Type` value, quoting parameter values where needed. Throws `ValueError` when the type or a parameter name isn't a valid token. |

### Categories

All return `boolean`. Case and parameters are ignored.

| Function | True for |
| --- | --- |
| `mime.isText(mediaType)` | `text/*`, JSON, XML, JavaScript, and `+json` and `+xml` types. |
| `mime.isImage(mediaType)` | `image/*` |
| `mime.isAudio(mediaType)` | `audio/*` |
| `mime.isVideo(mediaType)` | `video/*` |
| `mime.isTextFile(path)` | A file name or path whose extension has a text type. The file is not opened. |
| `mime.isImageFile(path)` | A file name or path whose extension has an image type. |
| `mime.isAudioFile(path)` | A file name or path whose extension has an audio type. |
| `mime.isVideoFile(path)` | A file name or path whose extension has a video type. |

For compatibility, `isText`, `isImage`, `isAudio`, and `isVideo` still treat a value without `/` as a file name or extension (`"notes.txt"`, `"txt"`). Use the `File` forms for paths.

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning.

| Deprecated | Use instead |
| --- | --- |
| `mime.byFilename(name)` (returns `""` when unknown) | `mime.typeByFilename(path)` (returns `null`) |
| `mime.resolve(input)` | `mime.parse(text).type` for a media type, or `mime.typeByFilename(path)` / `mime.typeByExt(ext)` for a file name |
| The `valid` key of `mime.parse` (always `true` now) | A malformed value fails `parse` with `ParseError`. |

## Behavior and limits

- The older `import "osl/mime"` spelling still works with a migration warning.

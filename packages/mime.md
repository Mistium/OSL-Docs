# mime

Use `mime` to inspect MIME types, file extensions, media categories, charsets, and content disposition headers.

```osl
import "std:mime"
```

## API reference

### `mime`

| Method | Returns | Notes |
| --- | --- | --- |
| `mime.typeByExt(ext: any)` | `string` |  |
| `mime.byFilename(name: any)` | `string` | Resolves the filename's final extension through `typeByExt`. |
| `mime.extByType(mtype: any)` | `string` |  |
| `mime.parse(contentType: any)` | `object` | Parses input data. |
| `mime.format(mtype: any, params: object)` | `string` | Formats a value for display. |
| `mime.resolve(input: any)` | `string` | Normalizes a MIME type, extension, or filename using final-extension semantics. |
| `mime.isText(input: any)` | `boolean` |  |
| `mime.isImage(input: any)` | `boolean` |  |
| `mime.isAudio(input: any)` | `boolean` |  |
| `mime.isVideo(input: any)` | `boolean` |  |

## Notes

- Prefer `import "std:mime"`; the older `import "osl/mime"` spelling remains supported.

## Behavior and limits

MIME parsing accepts parameters, quoted values, and case differences. Unknown extensions and
malformed media types return empty or failure values instead of panicking.

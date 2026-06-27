# mime

> MIME-type lookup and parsing

Use `mime` to inspect MIME types, file extensions, media categories, charsets, and content disposition headers.

```javascript
import "osl/mime"
```

## API reference

### `mime`

| Method | Returns | Description |
| --- | --- | --- |
| `mime.typeByExt(ext: any)` | `string` | Runs the type by ext operation. |
| `mime.byFilename(name: any)` | `string` | Runs the by filename operation. |
| `mime.extByType(mtype: any)` | `string` | Runs the ext by type operation. |
| `mime.parse(contentType: any)` | `object` | Parses input data. |
| `mime.format(mtype: any, params: object)` | `string` | Formats a value for display. |
| `mime.resolve(input: any)` | `string` | Runs the resolve operation. |
| `mime.isText(input: any)` | `boolean` | Reports whether text. |
| `mime.isImage(input: any)` | `boolean` | Reports whether image. |
| `mime.isAudio(input: any)` | `boolean` | Reports whether audio. |
| `mime.isVideo(input: any)` | `boolean` | Reports whether video. |

## Notes

- Standard-library imports accept both `import "osl/mime"` and `import "mime"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

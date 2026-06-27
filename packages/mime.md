# mime

> MIME type lookup by extension/filename and content-type parsing

```javascript
import "osl/mime"
```

## Methods

- `mime.typeByExt(ext)` → `string`
- `mime.byFilename(name)` → `string`
- `mime.extByType(mtype)` → `string`
- `mime.parse(contentType)` → `object`
- `mime.format(mtype, params)` → `string`
- `mime.resolve(input)` → `string`
- `mime.isText(input)` → `boolean`
- `mime.isImage(input)` → `boolean`
- `mime.isAudio(input)` → `boolean`
- `mime.isVideo(input)` → `boolean`

# exif

Use `exif` to inspect and remove EXIF metadata without decoding or re-encoding image pixels.

```osl
import "std:exif"
```

## API reference

| Method | Returns | Notes |
| --- | --- | --- |
| `exif.has(data: any)` | `boolean` | Reports EXIF data in raw TIFF or EXIF blocks and in JPEG, PNG, or WebP containers. |
| `exif.orientation(data: any)` | `number` | Returns the EXIF orientation from 1 through 8. Missing or invalid metadata returns 1. |
| `exif.strip(data: any)` | `byte[]?` | Removes EXIF segments or chunks from JPEG, PNG, and WebP data. |

`data` may be a string, `byte[]`, or an array of byte values. Unsupported input returns `null`.
Malformed and unsupported image containers are returned unchanged. Raw TIFF data can be inspected,
but cannot be stripped without rewriting the TIFF image and is therefore returned unchanged.

JPEG stripping removes only APP1 segments with the `Exif` signature, so XMP APP1 data is preserved.
PNG stripping removes `eXIf` chunks. WebP stripping removes `EXIF` chunks, clears the EXIF feature
flag, and updates the RIFF container size.

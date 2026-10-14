# exif

Use `exif` to read an image's EXIF orientation and to remove EXIF metadata without decoding or
re-encoding the pixels.

```osl
import "std:exif"
```

## Example

```osl
import "std:exif"
import "std:fs"

byte[] photo = fs.readFileBytes("photo.jpg")
if exif.has(photo) (
  log "orientation " ++ exif.orientation(photo)
  fs.writeFileBytes("clean.jpg", exif.strip(photo))
)
```

To turn a decoded image upright, use `img.decode(data, {autoOrient: true})` or
`pic.orient(exif.orientation(data))` from [img](img.md).

## API reference

### `exif`

| Function | Returns | Notes |
| --- | --- | --- |
| `exif.has(data: byte[])` | `boolean` | Whether `data` carries EXIF: a JPEG, PNG, or WebP image with an EXIF block, a TIFF image, or a raw EXIF block. Never fails; corrupt or unrecognised data gives `false`. |
| `exif.orientation(data: byte[])` | `result<int, error>` | The EXIF orientation, 1 to 8. 1 is upright; 6 means rotate 90 degrees clockwise to display. Reads JPEG, PNG, WebP, and TIFF images and raw EXIF blocks. 1 when there is no EXIF or no orientation tag, including GIF, BMP, ICO, and QOI images. |
| `exif.orientationFile(path: string)` | `result<int, error>` | `exif.orientation` for a file. |
| `exif.strip(data: byte[])` | `result<byte[], error>` | A copy of a JPEG, PNG, or WebP image with its EXIF removed and every other byte unchanged. An image without EXIF, and GIF, BMP, ICO, and QOI images, come back as an identical copy. |
| `exif.stripFile(path: string)` | `result<byte[], error>` | `exif.strip` for a file. The file itself isn't changed. |

## Errors

| Function | Kind | When |
| --- | --- | --- |
| `orientation`, `strip` | `ParseError` | Corrupt image or EXIF data, or data that isn't an image. |
| `orientation` | `UnsupportedError` | HEIF, AVIF, and JPEG XL images. |
| `strip` | `UnsupportedError` | TIFF, HEIF, AVIF, and JPEG XL images, and raw EXIF blocks. |
| `*File` variants | `NotFoundError`, `PermissionError`, `IOError` | The file can't be read. |

## Behavior and limits

JPEG stripping removes only APP1 segments with the `Exif` signature, so XMP data is kept. PNG
stripping removes `eXIf` chunks. WebP stripping removes `EXIF` chunks, clears the EXIF feature
flag, and updates the RIFF size.

# img

Use `img` for loading, creating, resizing, drawing, encoding, and saving raster images.

```osl
import "std:img"
```

## API reference

### `img`

| Method | Returns | Notes |
| --- | --- | --- |
| `img.open(path: string)` | `*img.Image` | Opens a PNG or JPEG file. |
| `img.openSize(path: string)` | `number, number` | Reads width and height without decoding the pixels. |
| `img.new(w: number, h: number)` | `*img.Image` | Creates a transparent image. |
| `img.clone(i: *img.Image)` | `*img.Image` | Copies an image and its pixels. |
| `img.resize(i: *img.Image, w: number, h: number)` | `*img.Image` | Resizes with Lanczos interpolation. |
| `img.resizeFast(i: *img.Image, w: number, h: number)` | `*img.Image` | Resizes with bilinear interpolation. |
| `img.resizeWidth(i: *img.Image, w: number)` | `*img.Image` | Changes the width and preserves the aspect ratio. |
| `img.resizeHeight(i: *img.Image, h: number)` | `*img.Image` | Changes the height and preserves the aspect ratio. |
| `img.resizeFit(i: *img.Image, maxW: number, maxH: number)` | `*img.Image` | Fits an image inside the given bounds. |
| `img.draw(dst: *img.Image, src: *img.Image, x: number, y: number)` | `boolean` | Replaces destination pixels with the source image. |
| `img.drawOver(dst: *img.Image, src: *img.Image, x: number, y: number)` | `boolean` | Alpha-composites the source over the destination. |
| `img.rotate(i: *img.Image, angle: number)` | `*img.Image` | Returns an image rotated by degrees. |
| `img.orient(i: *img.Image, orientation: number)` | `*img.Image` | Returns a copy transformed for an EXIF orientation from 1 through 8. |
| `img.fill(i: *img.Image, r: number, g: number, b: number, a: number)` | `boolean` | Fills the image with an RGBA color. Channels must be between 0 and 255. |
| `img.savePNG(i: *img.Image, path: string)` | `boolean` | Saves an image as PNG. |
| `img.saveJPEG(i: *img.Image, path: string, quality: number)` | `boolean` | Saves an image as JPEG. |
| `img.decodeBytes(data: byte[])` | `*img.Image` | Decodes PNG or JPEG bytes. |
| `img.sizeBytes(data: byte[])` | `object` | Reads `{w, h}` from PNG or JPEG bytes without decoding the pixels. |
| `img.isAnimatedBytes(data: byte[])` | `boolean` | Detects animated GIF, PNG, and WebP containers. |
| `img.encodePNGBytes(i: *img.Image)` | `byte[]` | Encodes an image as PNG. |
| `img.encodeJPEGBytes(i: *img.Image, q: number)` | `byte[]` | Encodes an image as JPEG. |
| `img.normalizeOrientation(i: *img.Image, reader)` | `*img.Image` | Applies orientation found in an EXIF reader. |
| `img.normalizeOrientationBytes(i: *img.Image, data: byte[])` | `*img.Image` | Applies orientation found in EXIF bytes. |

### `img.Image` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.close()` | `void` | Releases the pixels. Repeated calls are safe. |
| `value.width()` | `number` | Returns the width, or zero after `close`. |
| `value.height()` | `number` | Returns the height, or zero after `close`. |
| `value.size()` | `object` | Returns `{w, h}`, or an empty object after `close`. |

## Notes

- Prefer `import "std:img"`; the older `import "osl/img"` spelling remains supported.

## Behavior and limits

The decoder checks image dimensions before allocating the full image. Invalid sizes, non-finite
rotation angles, corrupt input, and write errors return failure values. Closing an image releases
its pixel data. Save methods report encoding and file-close errors. Orientation normalization
returns the original image when no transform is needed, and a new image when it applies a transform.

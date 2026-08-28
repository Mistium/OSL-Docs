# img

Use `img` for loading, creating, resizing, drawing, encoding, and saving raster images.

```osl
import "std:img"
```

## API reference

### `img`

| Method | Returns | Notes |
| --- | --- | --- |
| `img.open(path: string)` | `*imgImage` | Opens a PNG or JPEG file. |
| `img.openSize(path: string)` | `number, number` | Reads width and height without decoding the pixels. |
| `img.new(w: number, h: number)` | `*imgImage` | Creates a transparent image. |
| `img.clone(i: *imgImage)` | `*imgImage` | Copies an image and its pixels. |
| `img.resize(i: *imgImage, w: number, h: number)` | `*imgImage` | Resizes with Lanczos interpolation. |
| `img.resizeFast(i: *imgImage, w: number, h: number)` | `*imgImage` | Resizes with bilinear interpolation. |
| `img.resizeWidth(i: *imgImage, w: number)` | `*imgImage` | Changes the width and preserves the aspect ratio. |
| `img.resizeHeight(i: *imgImage, h: number)` | `*imgImage` | Changes the height and preserves the aspect ratio. |
| `img.resizeFit(i: *imgImage, maxW: number, maxH: number)` | `*imgImage` | Fits an image inside the given bounds. |
| `img.draw(dst: *imgImage, src: *imgImage, x: number, y: number)` | `boolean` | Replaces destination pixels with the source image. |
| `img.drawOver(dst: *imgImage, src: *imgImage, x: number, y: number)` | `boolean` | Alpha-composites the source over the destination. |
| `img.rotate(i: *imgImage, angle: number)` | `*imgImage` | Returns an image rotated by degrees. |
| `img.fill(i: *imgImage, r: number, g: number, b: number, a: number)` | `boolean` | Fills the image with an RGBA color. Channels must be between 0 and 255. |
| `img.savePNG(i: *imgImage, path: string)` | `boolean` | Saves an image as PNG. |
| `img.saveJPEG(i: *imgImage, path: string, quality: number)` | `boolean` | Saves an image as JPEG. |
| `img.decodeBytes(data: byte[])` | `*imgImage` | Decodes PNG or JPEG bytes. |
| `img.encodePNGBytes(i: *imgImage)` | `byte[]` | Encodes an image as PNG. |
| `img.encodeJPEGBytes(i: *imgImage, q: number)` | `byte[]` | Encodes an image as JPEG. |

### `imgImage` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.Close()` | `void` | Releases the pixels. Repeated calls are safe. |
| `value.Width()` | `number` | Returns the width, or zero after `Close`. |
| `value.Height()` | `number` | Returns the height, or zero after `Close`. |
| `value.Size()` | `object` | Returns `{w, h}`, or an empty object after `Close`. |

## Notes

- Prefer `import "std:img"`; the older `import "osl/img"` spelling remains supported.

## Behavior and limits

The decoder checks image dimensions before allocating the full image. Invalid sizes, non-finite
rotation angles, corrupt input, and write errors return failure values. Closing an image releases
its pixel data. Save methods report encoding and file-close errors.

# img

> Load, transform and save images

Use `img` for loading, creating, resizing, drawing, encoding, and saving raster images.

```javascript
import "osl/img"
```

## API reference

### `img`

| Method | Returns | Description |
| --- | --- | --- |
| `img.open(path: string)` | `*imgImage` | Opens a resource. |
| `img.openSize(path: string)` | `number, number` | Opens size. |
| `img.new(w: number, h: number)` | `*imgImage` | Creates a new value. |
| `img.clone(i: *imgImage)` | `*imgImage` | Runs the clone operation. |
| `img.resize(i: *imgImage, w: number, h: number)` | `*imgImage` | Runs the resize operation. |
| `img.resizeFast(i: *imgImage, w: number, h: number)` | `*imgImage` | Runs the resize fast operation. |
| `img.resizeWidth(i: *imgImage, w: number)` | `*imgImage` | Runs the resize width operation. |
| `img.resizeHeight(i: *imgImage, h: number)` | `*imgImage` | Runs the resize height operation. |
| `img.resizeFit(i: *imgImage, maxW: number, maxH: number)` | `*imgImage` | Runs the resize fit operation. |
| `img.draw(dst: *imgImage, src: *imgImage, x: number, y: number)` | `boolean` | Runs the draw operation. |
| `img.drawOver(dst: *imgImage, src: *imgImage, x: number, y: number)` | `boolean` | Runs the draw over operation. |
| `img.rotate(i: *imgImage, angle: number)` | `*imgImage` | Runs the rotate operation. |
| `img.rotate90(src: *_image.RGBA, a: number)` | `*imgImage` | Runs the rotate90 operation. |
| `img.rotateAny(src: *_image.RGBA, angle: number)` | `*imgImage` | Runs the rotate any operation. |
| `img.normalizeOrientation(i: *imgImage, r: io.Reader)` | `*imgImage` | Runs the normalize orientation operation. |
| `img.fill(i: *imgImage, r: unumber8, g: unumber8, b: unumber8, a: unumber8)` | `boolean` | Runs the fill operation. |
| `img.savePNG(i: *imgImage, path: string)` | `boolean` | Saves png. |
| `img.saveJPEG(i: *imgImage, path: string, quality: number)` | `boolean` | Saves jpeg. |
| `img.decode(r: reader)` | `*imgImage` | Decodes an image from an io.Reader. |
| `img.decodeBytes(data: bytes)` | `*imgImage` | Decodes an image from a byte array. |
| `img.decodeSize(r: reader)` | `number, number` | Returns width, height without decoding. |
| `img.encodePNG(w: writer, i: *imgImage)` | `boolean` | Encodes image to PNG via io.Writer. |
| `img.encodeJPEG(w: writer, i: *imgImage, q: number)` | `boolean` | Encodes image to JPEG via io.Writer. |
| `img.encodePNGBytes(i: *imgImage)` | `bytes` | Encodes image to PNG bytes. |
| `img.encodeJPEGBytes(i: *imgImage, q: number)` | `bytes` | Encodes image to JPEG bytes. |

### `imgImage` values

Methods available on `imgImage` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.Close()` | `void` | Runs the close operation. |
| `value.Width()` | `number` | Runs the width operation. |
| `value.Height()` | `number` | Runs the height operation. |
| `value.Size()` | `object` | Returns `{w: number, h: number}`. |

## Notes

- Standard-library imports accept both `import "osl/img"` and `import "img"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

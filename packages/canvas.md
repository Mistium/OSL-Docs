# canvas

> In-memory pixel canvas

Use `canvas` for simple in-memory pixel buffers that can be filled, edited by pixel index or coordinate, and exported.

```javascript
import "osl/canvas"
```

## API reference

### Factory

Call `canvas(w, h, bgHex)` to create a new canvas instance, then call methods on it:

```javascript
auto c = canvas(100, 100, "#fff")
log c.width()
```

### Canvas instance

After calling `canvas(w, h, bgHex)` to create a canvas, call these methods on the instance:

| Method | Returns | Description |
| --- | --- | --- |
| `c.width()` | `number` | Returns canvas width. |
| `c.height()` | `number` | Returns canvas height. |
| `c.pixels()` | `number` | Returns number of pixels. |
| `c.setPixel(idx: any, hexColor: any)` | `void` | Sets pixel at index (0-based). |
| `c.getPixel(idx: any)` | `string` | Returns pixel at index (0-based). |
| `c.setPixelAt(x: any, y: any, hexColor: any)` | `void` | Sets pixel at x, y (0-based). |
| `c.getPixelAt(x: any, y: any)` | `string` | Returns pixel at x, y (0-based). |
| `c.fill(hexColor: any)` | `void` | Fills entire canvas with color. |
| `c.clear()` | `void` | Clears all pixels. |
| `c.stretch(newW: any, newH: any)` | `void` | Resizes canvas. |
| `c.toURL()` | `string` | Converts to data URL. |
| `c.toArr()` | `array` | Converts to array. |

## Notes

- Pixel positions are **0-based** (unlike OSL arrays and strings, which are 1-indexed): linear indices run from `0` to `c.pixels() - 1`, and coordinates from `(0, 0)` to `(c.width() - 1, c.height() - 1)`. Out-of-range reads return `"#000000"`.
- Standard-library imports accept both `import "osl/canvas"` and `import "canvas"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

# canvas

Use `canvas` for simple in-memory pixel buffers that can be filled, edited by pixel index or coordinate, and exported.

```osl
import "std:canvas"
```

## API reference

### Factory

Call `canvas(w, h, bgHex)` to create a new canvas instance, then call methods on it:

```osl
auto c = canvas(100, 100, "#fff")
log c.width()
```

### Canvas instance

After calling `canvas(w, h, bgHex)` to create a canvas, call these methods on the instance:

| Method | Returns | Notes |
| --- | --- | --- |
| `c.width()` | `number` | Returns canvas width. |
| `c.height()` | `number` | Returns canvas height. |
| `c.pixels()` | `number` | Returns number of pixels. |
| `c.setPixel(idx: any, hexColor: any)` | `void` | Maps a 0-based index to coordinates and uses `setPixelAt`. |
| `c.getPixel(idx: any)` | `string` | Maps a 0-based index to coordinates and uses `getPixelAt`. |
| `c.setPixelAt(x: any, y: any, hexColor: any)` | `void` | Sets pixel at x, y (0-based). |
| `c.getPixelAt(x: any, y: any)` | `string` | Returns pixel at x, y (0-based). |
| `c.fill(hexColor: any)` | `void` | Fills every pixel with the given color. |
| `c.clear()` | `void` | Restores every pixel to the original background color. |
| `c.stretch(newW: any, newH: any)` | `void` | Resizes canvas. |
| `c.toURL()` | `string` | Converts to data URL. |
| `c.toArr()` | `array` | Returns the pixels as an array. |

## Notes

- Pixel positions are **0-based** (unlike OSL arrays and strings, which are 1-indexed): linear indices run from `0` to `c.pixels() - 1`, and coordinates from `(0, 0)` to `(c.width() - 1, c.height() - 1)`. Out-of-range reads return `"#000000"`.
- Prefer `import "std:canvas"`; the older `import "osl/canvas"` spelling remains supported.

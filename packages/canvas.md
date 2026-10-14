# canvas

`canvas` is a built-in in-memory pixel buffer. It needs no import.

**The whole `canvas` type is deprecated.** Use `img.new(width, height, {fill: background})` from
[img](img.md) instead, which also draws shapes, paths, gradients, and text, applies filters, and
encodes to PNG, JPEG, GIF, BMP, and TIFF. `canvas(...)` and every canvas method except `toImage`
draw an `OSL-DEPRECATED` warning and still work for one release.

## Moving to img

`c.toImage()` copies a canvas into an `*img.Image`, so existing code can switch over one step at a
time. Changes to either copy don't affect the other.

```osl
import "std:img"

auto pic = img.new(100, 100, {fill: "#ffffff"})
pic.setPixel(10, 10, "#ff0000")
log pic.pixel(10, 10)
pic.save("dot.png")
```

## API reference

Pixel coordinates count from 0, 0 at the top-left corner. A pixel index counts from 0 along rows:
`index = y * width + x`. Colors are `"#rgb"`, `"#rrggbb"`, `"#rrggbbaa"`, or `{r, g, b, a}`; an
invalid color, index, or point throws `ValueError`.

| Call | Returns | Use instead |
| --- | --- | --- |
| `canvas(width: int, height: int, background)` | `canvas` | `img.new(width, height, {fill: background})` |
| `c.toImage()` | `*img.Image` | Not deprecated. Throws `ValueError` for a 0x0 canvas. |
| `c.width()` | `int` | `pic.width()` |
| `c.height()` | `int` | `pic.height()` |
| `c.pixels()` | `int` (width * height) | `pic.width() * pic.height()`; `pic.pixels()` returns the pixel bytes |
| `c.pixel(index: int)` | `string` | `pic.pixel(x, y)` with `x = index % width`, `y = floor(index / width)` |
| `c.pixelAt(x: int, y: int)` | `string` | `pic.pixel(x, y)` |
| `c.setPixel(index: int, color)` | `void` | `pic.setPixel(x, y, color)` |
| `c.setPixelAt(x: int, y: int, color)` | `void` | `pic.setPixel(x, y, color)` |
| `c.fill(color)` | `void` | `pic.fill(color)` |
| `c.clear()` | `void` (back to the background color) | `pic.fill(background)` |
| `c.stretch(width: int, height: int)` | `void` (in place, nearest pixel) | `pic = pic.resize(width, height, {filter: "nearest"})` |
| `c.toURL()` | `string` (PNG data URL) | `pic.toDataURL()` |
| `c.toArray()` | `int[]` (r, g, b, a per pixel) | `pic.pixels()` |
| `c.toArr()` | `array` | `pic.pixels()` |
| `c.getPixel(index)` | `string` (`"#000000"` when out of range) | `pic.pixel(x, y)` |
| `c.getPixelAt(x, y)` | `string` (`"#000000"` when out of range) | `pic.pixel(x, y)` |

`pixel` and `pixelAt` return `"#rrggbb"`, or `"#rrggbbaa"` for a pixel that isn't opaque, and throw
`ValueError` for a bad index or point. The older `getPixel` and `getPixelAt` keep returning
`"#000000"` for a point outside the canvas.

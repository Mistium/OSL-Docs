---
description: The built-in canvas pixel buffer is deprecated; see what it did and how to move the same code to std:img.
package: canvas
builtin: true
---

# canvas

`canvas(width, height, background)` is a built-in in-memory pixel buffer that you could fill, resize and export. It is **deprecated**: [img](img.md) does everything it did, and also draws shapes, paths and text, applies filters, reads and writes files, and reads and sets single pixels. Every canvas method gives a deprecation warning when you use it. Existing code keeps working, and a canvas converts to an image with `toImage()`, so you can move over a piece at a time.

Read this page to understand old code. For new code, use `img.new`.

## What a canvas does

A canvas is made with a size and a background colour (`"#rgb"`, `"#rrggbb"`, `"#rrggbbaa"` or `{r, g, b, a}`). Its size can be 0, up to 100000 pixels a side and 100 megapixels. A bad colour or size throws `ValueError`.

```osl fragment
auto c = canvas(4, 2, "#ffffff")
log c.width() c.height() c.pixels()   // 4 2 8
c.fill("#ff0000")                     // every pixel red
c.clear()                             // back to the background, white
c.stretch(8, 4)                       // resize in place, nearest pixel
log c.toURL()                         // a "data:image/png;base64,..." string
```

Unlike img, a canvas has no way to read or set one pixel, and no drawing at all.

## Moving to img

`canvas.toImage()` returns a copy as an `*img.Image`, so the two don't affect each other. It throws `ValueError` for a canvas with no pixels, since an image is at least 1 by 1.

```osl fragment
auto c = canvas(4, 2, "#ffffff")
*img.Image pic = c.toImage()
```

Everything else maps to a method of the image:

| Canvas | Use instead |
| --- | --- |
| `canvas(w, h, bg)` | `img.new(w, h, {fill: bg})` |
| `c.width()`, `c.height()` | `pic.width()`, `pic.height()` |
| `c.pixels()` | `pic.width() * pic.height()` (`pic.pixels()` is the pixel bytes) |
| `c.fill(color)` | `pic.fill(color)` |
| `c.clear()` | `pic.fill(background)` |
| `c.stretch(w, h)` | `pic = pic.resize(w, h, {filter: "nearest"})` (a copy, not in place) |
| `c.toURL()` | `pic.toDataURL().unwrap()` |
| `c.toArray()`, `c.toArr()` | `pic.pixels()`, as bytes |

The same steps with img run without a warning, and the image can be saved too:

```osl
import "std:img"

*img.Image pic = img.new(4, 2, {fill: "#ffffff"})
log pic.width() pic.height() pic.width() * pic.height()

pic.fill("#ff0000")
log pic.pixel(1, 1)

pic.fill("#ffffff")
auto bigger = pic.resize(8, 4, {filter: "nearest"})
log bigger.width() bigger.height()
log bigger.toDataURL().unwrap().startsWith("data:image/png;base64,")
log pic.pixels().len
```

```output
4 2 8
#ff0000
8 4
true
32
```

## Reference

All of these are deprecated.

| Method | Returns | Notes |
| --- | --- | --- |
| `canvas(width, height, background)` | `canvas` | Makes the canvas, filled with the background. |
| `c.width()`, `c.height()` | `int` | The size in pixels. |
| `c.pixels()` | `int` | The pixel count, width times height. |
| `c.fill(color)` | none | Sets every pixel to a colour. |
| `c.clear()` | none | Sets every pixel back to the background it was made with. |
| `c.stretch(width, height)` | none | Resizes in place, sampling the nearest pixel. |
| `c.toURL()` | `string` | A PNG data URL. Throws `ValueError` for a canvas with no pixels. |
| `c.toArray()` | `int[]` | The pixels as 0 to 255 channel values, four per pixel, row by row. |
| `c.toArr()` | `any[]` | The same as a general array. |
| `c.toImage()` | `*img.Image` | A copy as an image. Not deprecated. |

> [!note]
> `canvas` is a type name, so a variable can't be called `canvas`.

:::quiz
Why does using `canvas(100, 100, "white")` print a warning?

- [ ] Colours must be hex.
- [x] `canvas` is deprecated: `img.new` does everything it did and more.
- [ ] The size is too large.

Every canvas method is deprecated. `c.toImage()` converts one to an `*img.Image`.
:::

:::exercise title="Move to img"
This old code made a 3 by 2 canvas. Write the same with `img.new` and print the width and height.

```osl
import "std:img"

*img.Image pic = img.new(1, 1)
log pic.width() pic.height()
```

```output
3 2
```

> [!hint]
> `img.new(width, height, {fill: "white"})`.

```osl solution
import "std:img"

*img.Image pic = img.new(3, 2, {fill: "white"})
log pic.width() pic.height()
```

```output
3 2
```
:::


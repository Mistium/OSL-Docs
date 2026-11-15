---
description: Create, draw on, filter, resize, decode and encode images, and use the same image value everywhere else in the standard library.
package: img
---

# img

`std:img` is OSL's image type. You can make one, draw shapes, paths and text on it, filter and transform it, read and write PNG, JPEG, GIF, BMP and TIFF (and decode WebP, AVIF and more), and inspect files without decoding them. It needs no display and no system libraries, so it runs anywhere, in a test or on a server.

An `*img.Image` is also the common currency of the other graphics packages. [qr](qr.md) and [svg](svg.md) produce one, [window](window.md) and [ui](ui.md) can show one, and [serve](serve.md) can send one. If you write code that takes or returns an image, use this type.

```osl fragment
import "std:img"
```

## Making an image and reading pixels

`img.new(width, height, options)` makes an image that is transparent, or filled with the `fill` option. A colour is a CSS name (`"white"`), `"#rrggbb"`, `"#rrggbbaa"` or `{r, g, b, a}`. Pixels are counted from 1: `1, 1` is the top-left one.

```osl
import "std:img"

*img.Image pic = img.new(40, 30, {fill: "white"})
log pic.width() pic.height()
log pic.pixel(1, 1)

pic.setPixel(2, 1, "#2f6feb")
pic.setPixel(3, 1, {r: 255, g: 0, b: 0, a: 128})
log pic.pixel(2, 1)
log pic.pixel(3, 1)
```

```output
40 30
#ffffff
#2f6feb
#ff000080
```

`pixel` gives back a colour string: `#rrggbb` when it is opaque and `#rrggbbaa` when it is not. `setPixel` replaces a pixel without blending. An image is a class: assigning it shares it, and `pic.clone()` makes an independent copy. Variables that hold one are written `*img.Image`.

## Drawing shapes

Drawing methods change the image in place. Each takes a position as `{x, y}` and an options object. Shapes take `fill` and `stroke` colours (and `lineWidth`); lines take `color`.

```osl
import "std:img"

*img.Image pic = img.new(60, 40, {fill: "white"})

pic.rectangle({x: 5, y: 5, width: 20, height: 10}, {fill: "#2f6feb"})
pic.circle({x: 45, y: 20}, 8, {fill: "red", stroke: "black"})
pic.line({x: 1, y: 40}, {x: 60, y: 40}, {color: "green", lineWidth: 2})
pic.polygon([{x: 5, y: 25}, {x: 25, y: 25}, {x: 15, y: 38}], {fill: "orange"})

log pic.pixel(10, 8)
log pic.pixel(45, 20)
log pic.pixel(15, 30)
log pic.pixel(30, 10)
```

```output
#2f6feb
#ff0000
#ffa500
#ffffff
```

Also available: `ellipse`, `polyline` (a line through several points, with `lineJoin`) and `rectangle` with `radius` for rounded corners. Edges are anti-aliased, so a pixel on an edge is a blend. Colours also take a gradient or a pattern:

```osl
import "std:img"

*img.Image pic = img.new(100, 10)
auto fade = img.linearGradient({x: 1, y: 1}, {x: 100, y: 1}, ["red", "blue"])
pic.rectangle({x: 1, y: 1, width: 100, height: 10}, {fill: fade})

log fade.colorAt(0) fade.colorAt(0.5) fade.colorAt(1)
log pic.pixel(1, 5)
log pic.pixel(100, 5)
```

```output
#ff0000 #800080 #0000ff
#fe0001
#0000ff
```

`img.radialGradient(center, radius, stops)` works the same way, and `img.pattern(image)` tiles an image.

## Text

`pic.text(text, {x, y}, options)` draws text with its top-left corner at the point. Options include `size`, `color`, `font`, `align` and `maxWidth` for wrapping. `img.measureText` measures text without drawing it, so you can size an image to fit:

```osl
import "std:img"

auto size = img.measureText("Hello, world", {size: 20})
log size.lines
log size.width > 100 size.height > 20

*img.Image label = img.new(floor(size.width) + 20, floor(size.height) + 10, {fill: "white"})
label.text("Hello, world", {x: 10, y: 5}, {size: 20, color: "black"})
log label.width() label.height()
```

```output
["Hello, world"]
true true
128 33
```

The default font is `"sans"`. For your own, load one with `img.decodeFontFile("fonts/Inter.ttf")` and pass the result as `font`.

## Paths

A path is a list of straight and curved segments you build once and draw many times. Building methods return the path, so they chain. `img.parsePath` reads the `d` attribute of an SVG `<path>`:

```osl
import "std:img"

auto triangle = img.path().moveTo({x: 5, y: 5}).lineTo({x: 30, y: 5}).lineTo({x: 5, y: 25}).close()
log triangle.bounds()

*img.Image pic = img.new(40, 30, {fill: "white"})
pic.drawPath(triangle, {fill: "navy"})
log pic.pixel(8, 8) pic.pixel(35, 28)

auto heart = img.parsePath("M 10 30 C 10 10 30 10 30 30 Z").unwrap()
log heart.bounds().width

log img.parsePath("M 10 oops").isErr()
```

```output
{"height":20,"width":25,"x":5,"y":5}
#000080 #ffffff
20
true
```

Path coordinates are SVG coordinates (the top-left corner is 0, 0), which is one off from pixel coordinates. A path can also be moved with `translate`, `scale` and `rotate`.

## Saving, encoding and decoding

`pic.save(path)` writes the file and picks the format from the extension. `img.decodeFile(path)` reads one back. Both return a `result`, because files go missing and data can be corrupt:

```osl
import "std:img"
import "std:fs"

fs.remove("shape.png", {force: true}).unwrap()

*img.Image pic = img.new(40, 30, {fill: "white"})
pic.rectangle({x: 5, y: 5, width: 20, height: 10}, {fill: "#2f6feb"})
pic.save("shape.png").unwrap()

auto info = img.infoFile("shape.png").unwrap()
log info.format info.width info.height info.hasAlpha

*img.Image back = img.decodeFile("shape.png").unwrap()
log back.pixel(10, 10)

log img.decodeFile("missing.png").unwrapErr().kind
```

```output
png 40 30 false
#2f6feb
NotFoundError
```

`img.infoFile` reads only the header, which is how to check an upload's size before you spend memory on decoding it. For data you hold in memory, `pic.encode("png")` returns bytes, `img.decode(bytes)` and `img.info(bytes)` read them, and `pic.toDataURL()` makes a `data:` URL for HTML:

```osl
import "std:img"

*img.Image pic = img.new(8, 8, {fill: "red"})
byte[] png = pic.encode("png").unwrap()
byte[] jpeg = pic.encode("jpeg", {quality: 80}).unwrap()
log img.info(png).unwrap().format img.info(jpeg).unwrap().format
log pic.toDataURL().unwrap().startsWith("data:image/png;base64,")

log img.decode([1, 2, 3, 4]).unwrapErr().kind
```

```output
png jpeg
true
UnsupportedError
```

Encoding supports PNG, JPEG, GIF, BMP and TIFF. Decoding also reads WebP, AVIF, HEIC, JPEG XL, ICO and QOI. For an animation, `img.frames(bytes)` iterates over every frame, with `frame.delay()` in milliseconds.

> [!note]
> JPEG photos can carry an orientation flag. Decode with `{autoOrient: true}` to get them the right way up, or call `pic.orient(img.info(data).unwrap().orientation)`. [exif](exif.md) reads the rest of the metadata.

## Resizing, cropping and turning

These return a copy and leave the original alone. Pass 0 for one side of `resize` to keep the aspect ratio. `fit` is `"fill"`, `"contain"` or `"cover"`, and `filter` is `"lanczos"` (the default), `"bicubic"`, `"bilinear"` or `"nearest"` for pixel art:

```osl
import "std:img"

*img.Image pic = img.new(40, 30, {fill: "white"})
pic.rectangle({x: 1, y: 1, width: 20, height: 30}, {fill: "red"})

auto half = pic.resize(20, 0)
log half.width() half.height()

auto thumb = pic.resize(16, 16, {fit: "cover"})
log thumb.width() thumb.height()

auto part = pic.crop({x: 1, y: 1, width: 10, height: 10})
log part.width() part.pixel(1, 1)

auto turned = pic.rotate(90)
log turned.width() turned.height()
log pic.flipX().pixel(40, 5)
```

```output
20 15
16 16
10 #ff0000
30 40
#ff0000
```

`crop` takes a rectangle `{x, y, width, height}` and throws a `ValueError` if it reaches outside the image.

## Filters

Filters return a copy too. They follow CSS: `grayscale`, `invert`, `brightness(amount)`, `contrast(amount)`, `saturate(amount)`, `hueRotate(degrees)`, `blur(radius)`, `sharpen(amount)`, `threshold(level)`, `opacity(amount)`, `pixelate(size)` and `tint(color, amount)`:

```osl
import "std:img"

*img.Image gray = img.new(2, 2, {fill: "#808080"})
log gray.brightness(2).pixel(1, 1)
log gray.invert().pixel(1, 1)
log gray.threshold(0.4).pixel(1, 1)
log gray.tint("red", 0.5).pixel(1, 1)
```

```output
#ffffff
#7f7f7f
#ffffff
#c04040
```

For an effect the filters don't cover, `mapPixels` calls a function with each pixel as `{r, g, b, a}` and its position. Return a colour, or `null` to keep the pixel. It costs about a second per megapixel, so it suits small images:

```osl
import "std:img"

*img.Image pic = img.new(3, 1)
pic.setPixel(1, 1, "#ff0000")
pic.setPixel(2, 1, "#00ff00")
pic.setPixel(3, 1, "#0000ff")

auto swapped = pic.mapPixels(def(c, x, y) -> {r: c.b, g: c.g, b: c.r, a: c.a})
log swapped.pixel(1, 1) swapped.pixel(2, 1) swapped.pixel(3, 1)
```

```output
#0000ff #00ff00 #ff0000
```

## Combining images

`target.draw(source, x, y)` paints one image onto another with the source's top-left pixel at `x, y`. Options are `blend`, `opacity`, `width` and `height`. `mask` hides an image wherever another is dark (with `channel: "luminance"`) or transparent:

```osl
import "std:img"

*img.Image base = img.new(4, 4, {fill: "red"})
*img.Image patch = img.new(2, 2, {fill: "blue"})

base.draw(patch, 2, 2)
log base.pixel(2, 2) base.pixel(1, 1)

base.draw(patch, 1, 1, {opacity: 0.5})
log base.pixel(1, 1)

*img.Image mask = img.new(4, 4, {fill: "black"})
mask.rectangle({x: 1, y: 1, width: 2, height: 4}, {fill: "white"})
*img.Image green = img.new(4, 4, {fill: "green"})
green.mask(mask, {channel: "luminance"})
log green.pixel(1, 1) green.pixel(4, 1)
```

```output
#0000ff #ff0000
#800080
#008000 #00000000
```

## Raw pixels

`pic.pixels()` returns every pixel as bytes (red, green, blue, alpha, row by row), and `img.fromPixels(width, height, bytes)` builds an image back from them. It is the way to hand an image to code that wants raw data:

```osl
import "std:img"

*img.Image pic = img.new(2, 1)
pic.setPixel(1, 1, "#ff8000")
pic.setPixel(2, 1, "#0000ff")

byte[] raw = pic.pixels()
log raw.len
log raw[1] raw[2] raw[3] raw[4]

*img.Image copy = img.fromPixels(2, 1, raw)
log copy.pixel(1, 1) copy.pixel(2, 1)
```

```output
8
255 128 0 255
#ff8000 #0000ff
```

## Closing

Images keep their pixels until the garbage collector takes them. For a large image you are done with, `pic.close()` frees them at once. Using a closed image throws a `StateError`.

:::exercise title="Checkerboard"
Make a 4 by 4 image, black and white like a checkerboard with a white pixel at 1, 1, then print the colours of the pixels at 1, 1, 2, 1 and 1, 2. Use `setPixel` and a nested loop.

```osl
import "std:img"

*img.Image board = img.new(4, 4, {fill: "white"})

log board.pixel(1, 1) board.pixel(2, 1) board.pixel(1, 2)
```

```output
#ffffff #000000 #000000
```

> [!hint]
> A pixel is black when `(x + y) % 2 == 1`.

```osl solution
import "std:img"

*img.Image board = img.new(4, 4, {fill: "white"})
for y in 1 to 4 (
  for x in 1 to 4 (
    if (x + y) % 2 == 1 (
      board.setPixel(x, y, "black")
    )
  )
)

log board.pixel(1, 1) board.pixel(2, 1) board.pixel(1, 2)
```

```output
#ffffff #000000 #000000
```
:::

:::quiz
`pic.resize(100, 100)` is called on a 400 by 400 image. What is `pic`?

- [ ] Now 100 by 100.
- [x] Still 400 by 400. `resize` returns a new image.
- [ ] Closed.

Filters and transforms return a copy. Drawing methods, like `rectangle`, change the image in place.
:::

:::exercise title="A white square with a red dot"
Make a 5 by 5 white image, draw a red pixel in the middle with `setPixel`, and print the colours of the middle pixel and the corner.

```osl
import "std:img"

*img.Image pic = img.new(5, 5, {fill: "white"})

log pic.pixel(1, 1)
```

```output
#ff0000 #ffffff
```

> [!hint]
> The middle of a 5 by 5 image is pixel 3, 3.

```osl solution
import "std:img"

*img.Image pic = img.new(5, 5, {fill: "white"})
pic.setPixel(3, 3, "red")

log pic.pixel(3, 3) pic.pixel(1, 1)
```

```output
#ff0000 #ffffff
```
:::

## API reference

::api

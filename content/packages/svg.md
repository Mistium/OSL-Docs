---
description: Turn SVG documents into images, read their size and viewBox without drawing them, and register fonts for SVG text.
package: svg
---

# svg

`std:svg` renders an SVG document into an `*img.Image`, so vector artwork (icons, logos, charts) can be scaled to any size and then saved, drawn or shown like any other [image](img.md). It also reads a document's size without drawing it.

Reach for it when you have SVG text or files and need pixels: thumbnails, icons at several sizes, or a chart a server draws as PNG.

## Rendering

`svg.render(text)` returns a result holding an image of the document's own size:

```osl
import "std:svg"

string doc = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 200 100">
  <rect width="200" height="100" fill="white"/>
  <circle cx="50" cy="50" r="30" fill="#ff0000"/>
</svg>`

auto pic = svg.render(doc).unwrap()
log pic.width() pic.height()
log pic.pixel(25, 25)
log pic.pixel(90, 40)
```

```output
100 50
#ff0000
#ffffff
```

The document says `width="100"` and a `viewBox` twice as large, so the image is 100 by 50 and the drawing is scaled to fit. The circle is red where the pixel is inside it, and white elsewhere. Where nothing is drawn, the image is transparent.

## Choosing a size

Vector art stays sharp at any size, so ask for the size you want. `scale` multiplies the document's size. `width` or `height` alone keep the aspect ratio, and both stretch the drawing to fit:

```osl
import "std:svg"

string doc = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50">`,
  `<rect width="100" height="50" fill="blue"/>`,
  `</svg>`
].join("")

auto twice = svg.render(doc, {scale: 2}).unwrap()
log twice.width() twice.height()

auto narrow = svg.render(doc, {width: 40}).unwrap()
log narrow.width() narrow.height()

auto exact = svg.render(doc, {width: 30, height: 30}).unwrap()
log exact.width() exact.height()
```

```output
200 100
40 20
30 30
```

Giving `scale` together with `width` or `height` throws a `ValueError`, since they would contradict each other.

## Reading the size without rendering

`svg.info(text)` resolves the width and height a browser would give the document, and its `viewBox` (or `null` when it has none). It is cheap, so use it to decide whether to render at all:

```osl
import "std:svg"

string doc = [
  `<svg xmlns="http://www.w3.org/2000/svg" `,
  `width="100" height="50" viewBox="0 0 200 100"/>`
].join("")
auto info = svg.info(doc).unwrap()
log info.width info.height
log info.viewBox

string plain = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>`
log svg.info(plain).unwrap().viewBox
```

```output
100 50
{"height":100,"width":200,"x":0,"y":0}
null
```

## From files, and when it fails

Every function has a `File` version that takes a path: `svg.renderFile`, `svg.infoFile`. All of them return results. Text that is not an SVG is a `ParseError`, and a missing file is a `NotFoundError`:

```osl
import "std:svg"
import "std:fs"

string source = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">`,
  `<rect width="10" height="10" fill="blue"/>`,
  `</svg>`
].join("")
fs.writeFile("icon.svg", source).unwrap()

auto icon = svg.renderFile("icon.svg", {scale: 3}).unwrap()
log icon.width() icon.pixel(30, 30)

log svg.render("<html>").unwrapErr().kind
log svg.renderFile("missing.svg").unwrapErr().kind
fs.remove("icon.svg").unwrap()
```

```output
30 #0000ff
ParseError
NotFoundError
```

## Saving the result

The image is an ordinary `*img.Image`, so use its methods to save or change it:

```osl
import "std:svg"
import "std:img"
import "std:fs"

fs.remove("logo.png", {force: true}).unwrap()

string doc = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">`,
  `<circle cx="32" cy="32" r="30" fill="orange"/>`,
  `</svg>`
].join("")
auto logo = svg.render(doc, {scale: 2}).unwrap()
logo.save("logo.png").unwrap()

auto info = img.infoFile("logo.png").unwrap()
log info.width info.height info.format
fs.remove("logo.png").unwrap()
```

```output
128 128 png
```

## Fonts

SVG text draws with a default font. To use a font from a file, register it first under the family name the SVG asks for with `svg.addFont(family, path)`. It returns a result, and fails with `ParseError` if the file is not a font:

```osl norun
import "std:svg"

svg.addFont("Inter", "fonts/Inter.ttf").unwrap()
string doc = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="40">`,
  `<text x="4" y="28" font-family="Inter" font-size="24">Hello</text>`,
  `</svg>`
].join("")
auto pic = svg.render(doc).unwrap()
pic.save("hello.png").unwrap()
```

> [!note]
> `svg.addFont` registers a font for every place SVGs are drawn, including [raylib](raylib.md)'s SVG loading.

:::quiz
An SVG says `width="100" height="50"`. You call `svg.render(doc, {scale: 3})`. How big is the image?

- [ ] 100 by 50.
- [x] 300 by 150.
- [ ] 3 by 3.

`scale` multiplies the document's own size. Vector art stays sharp at any size.
:::

:::exercise title="An icon at two sizes"
Render the same 16 by 16 SVG at 16 and at 64 pixels wide, and print both widths.

```osl
import "std:svg"

string icon = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">`,
  `<circle cx="8" cy="8" r="7" fill="#2f6feb"/>`,
  `</svg>`
].join("")

log svg.render(icon).unwrap().width()
```

```output
16
64
```

> [!hint]
> Pass `{width: 64}` as the second argument for the larger one.

```osl solution
import "std:svg"

string icon = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">`,
  `<circle cx="8" cy="8" r="7" fill="#2f6feb"/>`,
  `</svg>`
].join("")

log svg.render(icon).unwrap().width()
log svg.render(icon, {width: 64}).unwrap().width()
```

```output
16
64
```
:::

## API reference

::api

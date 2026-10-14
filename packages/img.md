# img

Use `img` to inspect, decode, create, draw on, filter, and encode raster images. It reads every
frame of animated GIF, PNG (APNG), and WebP files, and keeps ICC color profiles from decode to
encode.

```osl
import "std:img"
```

## Example

```osl
import "std:img"

*img.Image pic = img.decodeFile("photo.jpg", {autoOrient: true}) catch (err) (
  log "can't open photo: " ++ err.message
  return
)
auto thumb = pic.resize(320, 240, {fit: "cover"})
thumb.save("thumb.jpg", {quality: 85})
log thumb.width() ++ "x" ++ thumb.height()
```

`img.decodeFile` returns a result. Used as a value it unwraps itself and throws on failure, so
`*img.Image pic = img.decodeFile(path)` is enough when a bad file should stop the program.

Methods that return an image (`resize`, `crop`, `rotate`, the filters) leave the receiver alone and
return a new image. Methods that draw (`fill`, `draw`, `line`, `rectangle`, `text`, ...) change the
image in place and return nothing.

## API reference

### `img`

| Function | Returns | Notes |
| --- | --- | --- |
| `img.info(data: byte[])` | `result<img.Info, error>` | Reads format, size, frame count, alpha, and orientation from the header without decoding pixels. |
| `img.infoFile(path: string)` | `result<img.Info, error>` | `img.info` for a file, reading only the parts it needs. |
| `img.decode(data: byte[], options?)` | `result<*img.Image, error>` | Decodes PNG, JPEG, GIF, WebP, BMP, TIFF, ICO, CUR, and QOI. An animation gives its first frame as displayed, a TIFF its first page, an ICO its largest icon. Option: `autoOrient` (default `false`) turns the image upright from its EXIF orientation. |
| `img.decodeFile(path: string, options?)` | `result<*img.Image, error>` | `img.decode` for a file, with the same options. |
| `img.frames(data: byte[])` | `result<iter<*img.Image>, error>` | Decodes every frame, page, or icon one at a time as the loop asks for it. |
| `img.framesFile(path: string)` | `result<iter<*img.Image>, error>` | `img.frames` for a file. |
| `img.new(width: int, height: int, options?)` | `*img.Image` | A new image, transparent unless `fill` gives a color, gradient, or pattern. Each side is 1 to 100000 pixels, at most 100 megapixels in total. |
| `img.fromPixels(width: int, height: int, data: byte[])` | `*img.Image` | Builds an image from raw RGBA bytes laid out as `pic.pixels()` returns them. |
| `img.path()` | `*img.Path` | A new empty path. |
| `img.parsePath(text: string)` | `result<*img.Path, error>` | Reads SVG path data (the `d` attribute): `M L H V C S Q T A Z`, absolute and relative. |
| `img.linearGradient(from: object, to: object, stops: array, options?)` | `*img.Gradient` | A gradient along the line between two `{x, y}` points. |
| `img.radialGradient(center: object, radius: number, stops: array, options?)` | `*img.Gradient` | A gradient in circles around `center`, reaching the last stop at `radius`. |
| `img.pattern(image: *img.Image)` | `*img.Pattern` | `image` tiled across the plane from pixel 0, 0. The pattern copies the image. |
| `img.decodeFont(data: byte[], options?)` | `result<*img.Font, error>` | Reads a TTF or OTF font, or one font of a TTC/OTC collection. Option: `index`, which font of a collection, counting from 1 (default 1). |
| `img.decodeFontFile(path: string, options?)` | `result<*img.Font, error>` | `img.decodeFont` for a file. |
| `img.measureText(text: string, options?)` | `img.TextMetrics` | Lays text out as `pic.text` would, without drawing. Options: `font`, `size`, `maxWidth`, `lineHeight`. |

### `*img.Image`

| Method | Returns | Notes |
| --- | --- | --- |
| `pic.width()` | `int` | Width in pixels. |
| `pic.height()` | `int` | Height in pixels. |
| `pic.size()` | `{width, height}` | Both sides in pixels. |
| `pic.pixel(x: int, y: int)` | `string` | The color at x, y as `"#rrggbb"`, or `"#rrggbbaa"` when not opaque. Every fully transparent pixel is `"#00000000"`. |
| `pic.setPixel(x: int, y: int, color)` | `void` | Replaces one pixel (no blending). |
| `pic.fill(color)` | `void` | Replaces every pixel with a color, gradient, or pattern (no blending). |
| `pic.draw(source: *img.Image, x: int, y: int, options?)` | `void` | Paints `source` with its top-left corner at x, y. See [Compositing](#compositing). |
| `pic.resize(width: int, height: int, options?)` | `*img.Image` | A scaled copy. Pass 0 for one side to keep the aspect ratio. See [Resizing](#resizing). |
| `pic.crop(rect: object)` | `*img.Image` | A copy of `{x, y, width, height}`. The rectangle must lie inside the image. |
| `pic.rotate(degrees: number)` | `*img.Image` | A copy turned clockwise. Multiples of 90 are exact; other angles enlarge the copy and leave transparent corners. |
| `pic.orient(orientation: int)` | `*img.Image` | A copy turned and flipped so an image stored with EXIF orientation 1-8 displays upright. |
| `pic.flipX()` | `*img.Image` | A copy mirrored left to right. |
| `pic.flipY()` | `*img.Image` | A copy mirrored top to bottom. |
| `pic.clone()` | `*img.Image` | An independent copy, with the color profile and frame details. |
| `pic.encode(format: string, options?)` | `result<byte[], error>` | Encodes as `"png"`, `"jpeg"` (`"jpg"`), `"gif"`, `"bmp"`, or `"tiff"` (`"tif"`). Option: `quality` (JPEG only, 1-100, default 90). |
| `pic.save(path: string, options?)` | `result<unit, error>` | Encodes and writes a file. The format comes from the extension (`.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.tif`, `.tiff`) unless the `format` option names one. Option: `quality`. |
| `pic.toDataURL(options?)` | `result<string, error>` | A `data:image/...;base64,` URL. Options: `format` (default `"png"`), `quality`. |
| `pic.colorProfile()` | `byte[]?` | The embedded ICC profile, or `null`. |
| `pic.setColorProfile(profile: byte[])` | `void` | Replaces the profile that `encode` and `save` embed. Empty bytes remove it. |
| `pic.pixels()` | `byte[]` | A copy of every pixel as RGBA bytes (not premultiplied), row by row. Pixel x, y starts at index `(y * width + x) * 4 + 1`. |
| `pic.setPixels(data: byte[])` | `void` | Replaces every pixel from bytes laid out as `pixels()` returns them. |
| `pic.mapPixels(fn)` | `*img.Image` | A copy where each pixel is `fn(color, x, y)`. `color` is `{r, g, b, a}`; `fn` returns a new color, or `null` to keep the pixel. About a second per megapixel. |
| `pic.mask(mask: *img.Image, options?)` | `void` | Multiplies this image's alpha by `mask`'s, so it shows only where `mask` is opaque. Option: `channel`, `"alpha"` (default) or `"luminance"`. The mask must be the same size. |
| `pic.delay()` | `number` | How long this animation frame is shown, in milliseconds. 0 for a still image or a frame with no delay. |
| `pic.bounds()` | `{x, y, width, height}` | The region this animation frame changed. The whole image for anything else. |
| `pic.index()` | `int` | This frame's position in its file, from 1. |
| `pic.close()` | `void` | Releases the pixels. Closing twice does nothing; any other method on a closed image throws `StateError`. |

Shape, path, and text methods are listed under [Drawing](#drawing), and filters under
[Filters](#filters).

### Records

| Type | Keys |
| --- | --- |
| `img.Info` | `format` (`"png"`, `"jpeg"`, `"gif"`, `"webp"`, `"bmp"`, `"tiff"`, `"ico"`, `"cur"`, `"avif"`, `"heic"`, `"jxl"`, or `"qoi"`), `width`, `height` (as stored, before orientation), `frames` (`int?`: animation frames, TIFF pages, or ICO icons; `null` for an animated JPEG XL), `animated` (more than one animation frame), `hasAlpha` (`boolean?`, `null` when it can't be known without decoding), `orientation` (EXIF orientation 1-8, 1 when absent) |
| `img.TextMetrics` | `width` (widest line), `height`, `ascent`, `descent`, `lineHeight`, `lines` (each line's text after wrapping), all in pixels |

`img.info` recognises PNG and APNG, JPEG, GIF, WebP, BMP, TIFF, ICO, CUR, AVIF, HEIC, JPEG XL, and
QOI, including the formats `img.decode` can't decode.

```osl
import "std:img"
import "std:fs"

byte[] data = fs.readFileBytes("photo.jpg")
auto info = img.info(data)
log info.format ++ " " ++ info.width ++ "x" ++ info.height ++ ", orientation " ++ info.orientation
```

### Colors

Wherever a method takes a color it accepts `"#rrggbb"`, `"#rrggbbaa"`, `"#rgb"`, `"#rgba"`, a CSS
color name such as `"white"` or `"transparent"`, or `{r, g, b, a}` with 0-255 channels. Fills,
strokes, and text colors also accept an `*img.Gradient` or `*img.Pattern`. An invalid color throws
`ValueError`.

## Animated images

`img.frames` yields each frame as it is displayed: a full-size image with every earlier frame's
blending and disposal applied. A TIFF yields each page, an ICO each icon, and any other still image
yields itself once.

```osl
import "std:img"

for frame in img.framesFile("anim.gif") (
  log "frame " ++ frame.index() ++ ": " ++ frame.delay() ++ " ms, changed " ++ frame.bounds().width ++ "x" ++ frame.bounds().height
  frame.save("frame-" ++ frame.index() ++ ".png")
)
```

A delay of 0 means the file sets none; browsers show such frames for about 100 ms. A frame that
turns out to be corrupt during the loop throws `ParseError`.

## Resizing

`pic.resize(width, height, options?)` options:

| Option | Values |
| --- | --- |
| `fit` | `"fill"` (default, exactly width x height), `"contain"` (largest size that fits inside, keeping the aspect ratio), `"cover"` (fills width x height, keeping the aspect ratio and cropping the overflow evenly) |
| `filter` | `"lanczos"` (default, sharpest), `"bicubic"`, `"mitchell"`, `"bilinear"` (faster), `"nearest"` (blocky, for pixel art) |

## Compositing

`pic.draw(source, x, y, options?)` clips anything outside the destination. Options:

| Option | Values |
| --- | --- |
| `blend` | `"over"` (default, source transparency shows the destination through), `"replace"` (source pixels and transparency replace the destination), `"multiply"`, `"screen"`, `"overlay"`, `"darken"`, `"lighten"`, `"add"`, `"difference"` |
| `opacity` | 0-1, default 1 |
| `width`, `height` | The size to draw `source` at. 0 or absent for one side keeps the aspect ratio; both absent draws it at its own size. |
| `filter` | Resampling filter when scaling, as for `resize` (default `"lanczos"`) |

A destination without a color profile takes the source's.

## Drawing

Points are `{x, y}` and rectangles `{x, y, width, height}`, in pixels from the top-left corner
(0, 0). Coordinates may be fractional. Every drawing method changes the image in place.

| Method | Notes |
| --- | --- |
| `pic.line(from: object, to: object, options?)` | A straight line. |
| `pic.polyline(points: array, options?)` | Connected lines through an array of points. |
| `pic.rectangle(rect: object, options?)` | Option `radius` rounds the corners. |
| `pic.circle(center: object, radius: number, options?)` | |
| `pic.ellipse(center: object, radii: object, options?)` | `radii` is `{x, y}`. |
| `pic.polygon(points: array, options?)` | A closed shape. Self-overlapping parts are inside (nonzero rule). |
| `pic.drawPath(path: *img.Path, options?)` | Each subpath fills as if closed (nonzero rule). The outline closes only subpaths that `close()` closed. |
| `pic.text(text: string, point: object, options?)` | Text with `point` at its top-left corner by default. `"\n"` starts a new line. |

### Drawing options

| Option | Applies to | Values |
| --- | --- | --- |
| `fill` | shapes, paths | Color, gradient, or pattern for the inside. |
| `stroke` | shapes, paths | Color, gradient, or pattern for the outline. With neither `fill` nor `stroke`, a shape is outlined in black. The outline is centred on the edge and painted over the fill. |
| `color` | `line`, `polyline`, `text` | Color, gradient, or pattern. Default black. |
| `lineWidth` | lines, outlines | Pixels, default 1. |
| `lineCap` | `line`, `polyline` | `"butt"` (default), `"round"`, `"square"` |
| `lineJoin` | `polyline`, outlines | `"miter"` (default), `"round"`, `"bevel"` |
| `miterLimit` | `polyline`, outlines | Default 10. |
| `dash` | lines, outlines | Alternating dash and gap lengths in pixels. `[]` is solid. |
| `dashOffset` | lines, outlines | Pixels into the dash pattern to start. |
| `opacity` | all | 0-1, default 1. |
| `blend` | all | As for `pic.draw`, default `"over"`. |
| `antialias` | all | Default `true`; `false` gives hard pixel edges. |
| `radius` | `rectangle` | Corner radius in pixels, default 0. |

### Text options

| Option | Values |
| --- | --- |
| `font` | `"sans"` (default), `"sans-bold"`, `"sans-italic"`, `"sans-bold-italic"`, `"mono"`, `"mono-bold"`, `"mono-italic"`, `"mono-bold-italic"`, or an `*img.Font` from `img.decodeFont` |
| `size` | Em size in pixels, default 16. |
| `color` | Default black. |
| `align` | Where `point` sits on each line: `"left"` (default), `"center"`, `"right"` |
| `baseline` | Where `point` sits vertically: `"top"` (default, top of the first line), `"middle"` (of the whole text), `"alphabetic"` (first line's baseline), `"bottom"` (of the last line) |
| `maxWidth` | Wraps lines at spaces to fit, splitting longer words. |
| `lineHeight` | Pixels between baselines. Default is the font's line spacing. |

`opacity`, `blend`, and `antialias` work as for shapes. Characters the chosen font lacks are drawn
from the built-in sans font when it has them (Latin, Greek, and Cyrillic), otherwise as the font's
missing-glyph box. Color emoji are not drawn. `font.name()` returns an `*img.Font`'s full name.

```osl
import "std:img"

auto pic = img.new(400, 200, {fill: img.linearGradient({x: 0, y: 0}, {x: 0, y: 200}, ["#0b1d3a", "#4b2a6b"])})
pic.rectangle({x: 20, y: 20, width: 360, height: 160}, {stroke: "#ffffff88", lineWidth: 2, radius: 16})
pic.circle({x: 320, y: 70}, 30, {fill: img.radialGradient({x: 310, y: 60}, 40, ["#fffbe8", "#f5d76e"])})
pic.line({x: 40, y: 150}, {x: 360, y: 150}, {color: "#e0e1dd", dash: [8, 6], lineCap: "round"})

auto size = img.measureText("Hello", {size: 40, font: "sans-bold"})
pic.text("Hello", {x: 200, y: 100 - (size.height / 2)}, {size: 40, font: "sans-bold", align: "center", color: "white"})
pic.save("card.png")
```

### Paths

`img.path()` returns an empty `*img.Path`. Building methods change the path and return it, so calls
chain. Angles are degrees, with 0 pointing right and 90 pointing down.

| Method | Notes |
| --- | --- |
| `path.moveTo(point)` | Starts a new subpath. |
| `path.lineTo(point)` | A straight line from the current point. |
| `path.quadTo(control, point)` | A quadratic Bézier curve. |
| `path.cubicTo(control1, control2, point)` | A cubic Bézier curve. |
| `path.arc(center, radius, options?)` | An arc joined to the current point by a line, as canvas `arc()`. Options: `start` (default 0), `end` (default 360), `counterclockwise` (default `false`). |
| `path.arcTo(control, point, radius)` | An arc rounding the corner at `control`, as canvas `arcTo()`. The path continues from the arc's end. |
| `path.rect(rect, options?)` | A closed rectangle subpath. Option: `radius`. |
| `path.circle(center, radius)` | A closed circle subpath. |
| `path.ellipse(center, radii)` | A closed ellipse subpath. |
| `path.close()` | Joins back to the start of the subpath. |
| `path.translate(x, y)` | Moves everything already in the path. |
| `path.rotate(degrees, options?)` | Turns the path clockwise around 0, 0 or the `center` option. |
| `path.scale(x, y, options?)` | Stretches the path from 0, 0 or the `center` option. Negative factors mirror it. |
| `path.bounds()` | `{x, y, width, height}?`: the smallest rectangle holding the path, or `null` when it draws nothing. Does not return the path. |
| `path.clone()` | An independent copy. Does not return the path. |

```osl
import "std:img"

auto pic = img.new(200, 200, {fill: "white"})
auto star = img.path().moveTo({x: 100, y: 10}).lineTo({x: 130, y: 190}).lineTo({x: 10, y: 70}).lineTo({x: 190, y: 70}).lineTo({x: 70, y: 190}).close()
pic.drawPath(star, {fill: "gold", stroke: "black", lineJoin: "round"})
pic.drawPath(img.parsePath("M 10 190 Q 100 120 190 190"), {stroke: "#3a6ea5", lineWidth: 3})
pic.save("star.png")
```

### Gradients and patterns

`stops` is an array of colors spread evenly, or of `{offset, color}` objects with offsets from 0 to
1. Colors blend premultiplied, so fading to `"transparent"` keeps the color. Option `spread` sets
what happens past the ends: `"pad"` (default), `"repeat"`, or `"reflect"`.

`gradient.colorAt(offset: number)` returns the color at an offset as `"#rrggbb"` or `"#rrggbbaa"`,
for picking colors from a scale.

## Filters

Each filter returns a new image and leaves the receiver alone, so filters chain.

| Method | Notes |
| --- | --- |
| `pic.grayscale()` | Luminance as CSS `grayscale(1)`. |
| `pic.invert()` | 255 minus each channel. Alpha is kept. |
| `pic.brightness(amount: number)` | Multiplies each color: 1 unchanged, 0 black, 2 twice as bright. 0-1000. |
| `pic.contrast(amount: number)` | 1 unchanged, 0 solid gray, 2 double contrast. 0-1000. |
| `pic.saturate(amount: number)` | As CSS `saturate()`: 1 unchanged, 0 gray. 0-1000. |
| `pic.hueRotate(degrees: number)` | As CSS `hue-rotate()`. |
| `pic.blur(radius: number)` | Gaussian blur with standard deviation `radius` pixels, as CSS `blur()`. Edges repeat. 0-1000. |
| `pic.sharpen(amount: number, options?)` | Unsharp mask: 0 unchanged, 1 strong. Option `radius` (default 1). |
| `pic.tint(color, amount: number)` | Mixes every color toward `color` by `amount` (0-1). |
| `pic.threshold(level: number)` | White where luminance is at least `level` (0-1), black elsewhere. |
| `pic.opacity(amount: number)` | Multiplies every alpha by `amount` (0-1). |
| `pic.pixelate(size: int)` | Averages `size` x `size` blocks. |

An out-of-range amount throws `ValueError`.

```osl
import "std:img"

auto pic = img.decodeFile("photo.jpg")
pic.grayscale().contrast(1.2).blur(1.5).save("moody.png")
```

## Raw pixels

`pic.pixels()` and `img.fromPixels` move whole images to and from RGBA bytes. `pic.mapPixels(fn)`
calls an OSL function once per pixel, for small images and effects the filters don't cover.

```osl
import "std:img"

auto pic = img.new(64, 64, {fill: "#3a6ea5"})
def stripes(object c, int x, int y) object? (
  if (x / 8) % 2 == 0 ( return null )
  return {r: 255 - c.r, g: 255 - c.g, b: 255 - c.b, a: c.a}
)
auto striped = pic.mapPixels(stripes)
log striped.pixel(0, 0) ++ " " ++ striped.pixel(8, 0)
```

## Working with other packages

| Call | Package | Notes |
| --- | --- | --- |
| `svg.render(text, options?)`, `svg.renderFile(path, options?)` | [svg](svg.md) | Rasterise an SVG into an `*img.Image`. |
| `raylib.textureFromImage(pic)` | [raylib](raylib.md) | Uploads an image to the GPU as a texture. |
| `raylib.screenshot()` | [raylib](raylib.md) | The window contents as an `*img.Image`. |
| `image.toImage()` | [raylib](raylib.md) | Converts a CPU-side `*raylib.Image` to an `*img.Image`. |
| `doc.drawImage(pic, rect)` | [pdf](pdf.md) | Draws an image on a PDF page. |
| `c.toImage()` | [canvas](canvas.md) | Converts a `canvas` value. |
| `exif.orientation(data)`, `exif.strip(data)` | [exif](exif.md) | Read or remove EXIF metadata without re-encoding. |

## Errors

| Function | Kind | When |
| --- | --- | --- |
| `info`, `decode`, `frames`, `parsePath`, `decodeFont` | `ParseError` | Corrupt or truncated data, or invalid path data (the message names the character). |
| `info`, `decode`, `frames` | `UnsupportedError` | Unrecognised data. `decode` and `frames` also fail this way for AVIF, HEIC, and JPEG XL (which `info` can inspect), and for images over 100 megapixels. |
| `encode`, `save`, `toDataURL` | `UnsupportedError` | WebP, AVIF, HEIC, JPEG XL, ICO, and QOI can't be encoded. |
| `decodeFont` | `UnsupportedError` | WOFF and WOFF2 web fonts. |
| `decodeFont` | `ValueError` | `index` is past the last font of a collection. |
| `*File` variants, `save` | `NotFoundError`, `PermissionError`, `IOError` | The file can't be read or written. |
| any | `ValueError` (thrown) | A bad size, point, rectangle, color, option, or out-of-range amount. |
| any | `StateError` (thrown) | The image is closed. |

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning. Most returned `null` or
`false` on failure; their replacements fail with a typed error.

| Deprecated | Use instead |
| --- | --- |
| `img.open(path)` | `img.decodeFile(path)` |
| `img.decodeBytes(data)` | `img.decode(data)` |
| `img.openSize(path)` | `img.infoFile(path)` |
| `img.sizeBytes(data)` | `img.info(data)` |
| `img.isAnimatedBytes(data)` | `img.info(data).animated` |
| `img.encodePNGBytes(pic)` | `pic.encode("png")` |
| `img.encodeJPEGBytes(pic, q)` | `pic.encode("jpeg", {quality: q})` |
| `img.savePNG(pic, path)` | `pic.save(path)` |
| `img.saveJPEG(pic, path, q)` | `pic.save(path, {quality: q})` |
| `img.clone(pic)` | `pic.clone()` |
| `img.resize(pic, w, h)` | `pic.resize(w, h)` |
| `img.resizeFast(pic, w, h)` | `pic.resize(w, h, {filter: "bilinear"})` |
| `img.resizeWidth(pic, w)` | `pic.resize(w, 0)` |
| `img.resizeHeight(pic, h)` | `pic.resize(0, h)` |
| `img.resizeFit(pic, maxW, maxH)` | `pic.resize(maxW, maxH, {fit: "contain"})` |
| `img.draw(dst, src, x, y)` | `dst.draw(src, x, y, {blend: "replace"})` |
| `img.drawOver(dst, src, x, y)` | `dst.draw(src, x, y)` |
| `img.rotate(pic, angle)` | `pic.rotate(degrees)` |
| `img.orient(pic, orientation)` | `pic.orient(orientation)` |
| `img.normalizeOrientationBytes(pic, data)` | `img.decode(data, {autoOrient: true})`, or `pic.orient(img.info(data).orientation)` |
| `img.fill(pic, r, g, b, a)` | `pic.fill(color)` |
| `img.setColorProfile(pic, profile)` | `pic.setColorProfile(profile)`, which checks the profile |
| `w` and `h` keys of `pic.size()` | `width` and `height` |

`img.normalizeOrientation(pic, reader)` has been removed; use `{autoOrient: true}` when decoding.

## Behavior and limits

Decoding checks the dimensions before allocating, and refuses images over 100 megapixels. Images are
held as non-premultiplied RGBA, so translucent pixels keep their exact colors.

Decoding keeps an embedded ICC profile from JPEG, PNG, and WebP. `clone`, `resize`, `rotate`,
`orient`, and the filters carry it to the image they return, and `draw` copies it onto a destination
that has none. PNG and JPEG encoding write it back. Profiles over 8 MB are rejected.

GIF encoding keeps the exact colors of an image with up to 256 of them and otherwise dithers to a
fixed palette. Pixels under 50% opacity become transparent.

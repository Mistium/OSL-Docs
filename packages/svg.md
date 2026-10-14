# svg

Use `svg` to render SVG documents into [img](img.md) images, read their size and viewBox, and
register fonts for SVG text.

```osl
import "std:svg"
```

## Example

```osl
import "std:svg"

string logo = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><circle cx='12' cy='12' r='10' fill='#3a6ea5'/></svg>"

auto info = svg.info(logo)
log info.width ++ "x" ++ info.height

auto pic = svg.render(logo, {width: 256})
pic.save("logo.png")
log pic.width() ++ "x" ++ pic.height()
```

## API reference

### `svg`

| Function | Returns | Notes |
| --- | --- | --- |
| `svg.render(text: string, options?)` | `result<*img.Image, error>` | Draws SVG text into a new transparent `*img.Image`. |
| `svg.renderFile(path: string, options?)` | `result<*img.Image, error>` | `svg.render` for a file. |
| `svg.info(text: string)` | `result<svg.Info, error>` | Reads the intrinsic size and viewBox without rendering. |
| `svg.infoFile(path: string)` | `result<svg.Info, error>` | `svg.info` for a file. |
| `svg.addFont(family: string, path: string)` | `result<unit, error>` | Registers a TTF or OTF file as `family`, so SVG text in that family uses it wherever SVGs are drawn (`svg.render`, `raylib.loadSVG`). |

### Render options

By default the image is the document's intrinsic size in CSS pixels (as `svg.info` reports it),
rounded up.

| Option | Notes |
| --- | --- |
| `scale` | Multiplies the intrinsic size. Default 1. Can't be combined with `width` or `height`. |
| `width`, `height` | The image size in pixels. Give one to keep the aspect ratio, or both to stretch the drawing to exactly that size. |

Each option must be more than 0.

### `svg.Info`

| Key | Type | Notes |
| --- | --- | --- |
| `width`, `height` | `number` | The size in CSS pixels a browser gives the image, resolved from the root's `width`, `height`, and `viewBox`. Units such as `cm` are converted. |
| `viewBox` | `{x, y, width, height}?` | The root's viewBox in user units, or `null` when it has none. |

```osl
import "std:svg"

auto box = svg.info("<svg xmlns='http://www.w3.org/2000/svg' width='2cm' height='50'/>").viewBox
if box == null (
  log "no viewBox"
) else (
  log box.width
)
```

## Errors

| Function | Kind | When |
| --- | --- | --- |
| `info`, `render` | `ParseError` | The text isn't an SVG document, or (`render`) it has no size. |
| `render` | `ValueError` | The image would be over 100000 pixels a side or 100 megapixels. |
| `addFont` | `ParseError` | The file isn't a font. |
| `*File` variants, `addFont` | `NotFoundError`, `PermissionError`, `IOError` | The file can't be read. |
| `render` | `ValueError` (thrown) | An option that isn't more than 0, or `scale` together with `width` or `height`. |

## Changes from earlier versions

`svg.size(path)` and `svg.viewBox(path)` have been removed. Use `svg.infoFile(path)`, which reports
failures and returns `width`, `height`, and `viewBox` in one record.

# pdf

Use `pdf` to write PDF documents with flowing text, shapes, images, tables, bookmarks, and
document properties.

```osl
import "std:pdf"
```

## Example

```osl
import "std:pdf"

auto doc = pdf.new({pageSize: "a4", title: "Report"})
doc.setFontSize(20)
doc.text("Quarterly report")
doc.setFontSize(12)
doc.newLine()
doc.text("Sales grew in every region this quarter, led by the north.", {wrap: true})
doc.table(["Region", "Sales"], [["North", "120"], ["South", "95"]])
doc.rectangle({x: 72, y: 300, width: 200, height: 40}, {fill: "#eef3fb", stroke: "#3a6ea5"})
doc.text("Boxed note", {x: 82, y: 312})
doc.addPage()
doc.text("Appendix")
doc.addBookmark("Appendix", 2)
doc.save("report.pdf")
log doc.pageCount()
```

Positions are in points (1/72 inch) from the **top-left** corner of the page.

## API reference

### `pdf`

| Function | Returns | Notes |
| --- | --- | --- |
| `pdf.new(options?)` | `*pdf.Document` | An empty document with one blank page. |
| `pdf.decode(data: byte[])` | `result<*pdf.Document, error>` | Reads a PDF this package wrote back into a document that can be inspected, added to, and saved again. Text written to it flows onto a new page; bookmarks aren't kept. |
| `pdf.decodeFile(path: string)` | `result<*pdf.Document, error>` | `pdf.decode` for a file. |
| `pdf.mergeFiles(paths: string[])` | `result<*pdf.Document, error>` | A new document with the pages of each file in order, keeping each page's size. The files must have been written by this package. |
| `pdf.splitFile(path: string, dir: string)` | `result<string[], error>` | Writes each page to `dir/page_N.pdf` (N from 1), creating `dir` if needed, and returns the paths. |

#### `pdf.new` options

| Option | Notes |
| --- | --- |
| `pageSize` | `"letter"` (default), `"legal"`, `"tabloid"`, `"a3"`, `"a4"`, or `"a5"`, in any case. |
| `landscape` | Turns the page sideways. |
| `width`, `height` | A custom page size in points (both or neither, up to 14400), instead of `pageSize`. |
| `margin` | Points. Default 72, or a quarter of the shorter side on smaller pages. |
| `fontSize` | Points. Default 12. |
| `title`, `author`, `subject` | Document properties. |

### `*pdf.Document`

| Method | Returns | Notes |
| --- | --- | --- |
| `doc.text(content: string, options?)` | `void` | Writes text, which may have several lines. Without a position it flows from the left margin below the previous text, starting a new page at the bottom margin. Options: `x` and `y` (both or neither) put the top of the first line there without moving the flow; `wrap` breaks lines at spaces to fit inside the right margin; `color` (default black). |
| `doc.newLine()` | `void` | Moves the flow down one line. |
| `doc.textWidth(text: string)` | `number` | Width in points at the current font size. |
| `doc.line(from: object, to: object, options?)` | `void` | A line between two `{x, y}` points. Options: `color`, `lineWidth` (default 1). |
| `doc.rectangle(rect: object, options?)` | `void` | `{x, y, width, height}`. Options: `fill`, `stroke`, `lineWidth`. With neither `fill` nor `stroke` it is outlined in black. |
| `doc.circle(center: object, radius: number, options?)` | `void` | Options as for `rectangle`. |
| `doc.image(data: byte[], rect: object)` | `result<unit, error>` | Draws PNG, JPEG, or GIF bytes stretched to fill `rect`. Transparency is dropped. |
| `doc.imageFile(path: string, rect: object)` | `result<unit, error>` | `doc.image` for a file. |
| `doc.drawImage(image: *img.Image, rect: object)` | `void` | Draws an [img](img.md) image stretched to fill `rect`, without encoding it first. Translucent pixels are blended onto white. Later changes to the image don't change the document. |
| `doc.table(headers: array, rows: array)` | `void` | A table where the flow has reached, with equal-width columns between the margins. A row that doesn't fit starts a new page; text too wide for its column is cut short with "…"; cells past the last header are left out. The flow continues below. |
| `doc.addPage()` | `void` | Finishes the current page and starts a blank one. |
| `doc.pageCount()` | `int` | Pages so far, the current one included. A new document has 1. |
| `doc.pageSize()` | `{width, height}` | The current page size in points. |
| `doc.pageText(page: int)` | `string` | The text written to a page (1-based), one line per text line. |
| `doc.fontSize()` / `doc.setFontSize(size: number)` | `number` / `void` | The font size in points for text written from now on (more than 0, at most 1000). |
| `doc.margin()` / `doc.setMargin(margin: number)` | `number` / `void` | The margin for flowing text, wrapping, and tables, from the next page (or this one if it's still empty). |
| `doc.title()` / `doc.setTitle(title: string)` | `string` / `void` | The title property, shown as the viewer's window title. `""` removes it. |
| `doc.author()` / `doc.setAuthor(author: string)` | `string` / `void` | The author property. |
| `doc.subject()` / `doc.setSubject(subject: string)` | `string` / `void` | The subject property. |
| `doc.watermark()` / `doc.setWatermark(text: string)` | `string` / `void` | Text drawn diagonally in light grey across every page, including pages already written. `""` removes it. |
| `doc.addBookmark(title: string, page: int, options?)` | `void` | Adds an entry to the viewer's bookmarks panel that opens `page` (1-based). Option: `level` (default 0); level n nests under the closest earlier entry of level n-1. |
| `doc.encode()` | `byte[]` | The document as PDF bytes. The document can still be added to. |
| `doc.save(path: string)` | `result<unit, error>` | Writes the document to a file. The document can still be added to. |

Colors are any CSS color that [`colors.parse`](colors.md) reads, such as `"#3a6ea5"`, `"navy"`, or
`"rgb(58 110 165 / 50%)"`, or `{r, g, b, a}` objects with 0-255 channels.

```osl
import "std:pdf"
import "std:img"

auto chart = img.new(300, 150, {fill: "white"})
chart.rectangle({x: 20, y: 60, width: 60, height: 80}, {fill: "#3a6ea5"})
chart.rectangle({x: 120, y: 20, width: 60, height: 120}, {fill: "#f4a261"})

auto doc = pdf.new()
doc.text("Sales by region")
doc.drawImage(chart, {x: 72, y: 110, width: 300, height: 150})
doc.save("chart.pdf")
```

## Errors

| Function | Kind | When |
| --- | --- | --- |
| `decode`, `decodeFile`, `mergeFiles`, `splitFile` | `ParseError` | The data isn't a PDF. |
| `decode`, `decodeFile`, `mergeFiles`, `splitFile` | `UnsupportedError` | The PDF was written by other software. |
| `image`, `imageFile` | `ParseError` | The data isn't an image it can decode. |
| `*File` functions, `save` | `NotFoundError`, `PermissionError`, `IOError` | A file can't be read or written. |
| any | `ValueError` (thrown) | An unknown page size or option, only one of `x`/`y` or `width`/`height`, a malformed point or rectangle, a negative size, an invalid color, a page that doesn't exist, empty `headers` or `paths`. |
| `table` | `TypeError` (thrown) | A row that isn't an array. |
| `drawImage` | `TypeError`, `StateError` (thrown) | A `null` image, or a closed one. |

## Changes from earlier versions

`pdf.create()` and the `*pdf.PDF` type it returned have been removed, along with `pdf.merge` and
`pdf.split`. Use `pdf.new(options?)`, `pdf.mergeFiles`, and `pdf.splitFile`. The old methods
measured `y` from the bottom-left corner; `*pdf.Document` measures from the top-left.

## Behavior and limits

Text uses the standard PDF Helvetica font. Characters outside Windows-1252 (such as emoji or CJK)
print as `?`. `pdf.decode`, `mergeFiles`, and `splitFile` read only PDFs that this package wrote.

---
description: Write PDF documents with flowing text, tables, shapes, images, bookmarks and watermarks, and merge and split PDFs you wrote.
package: pdf
---

# pdf

`std:pdf` writes PDF files. A document is a stack of pages. You add text that flows from the top margin down and onto new pages, tables, lines and shapes at exact positions, and images from [img](img.md). Then you save the file or take its bytes.

Reach for it for invoices, reports, tickets and anything a person will print or attach to an email. It only reads back PDFs it wrote itself, so it is not a general PDF parser.

## A first document

`pdf.new()` returns a document with one blank page. `doc.text(content)` writes a line where the flow has reached, and `doc.save(path)` writes the file:

```osl
import "std:pdf"
import "std:fs"

fs.remove("hello.pdf", {force: true}).unwrap()

auto doc = pdf.new()
doc.text("Hello, PDF")
doc.text("A second line.")
doc.save("hello.pdf").unwrap()

auto back = pdf.decodeFile("hello.pdf").unwrap()
log back.pageCount()
log back.pageText(1)
fs.remove("hello.pdf").unwrap()
```

```output
1
Hello, PDF
A second line.
```

`pageText(n)` returns the text written to page `n`, one line per line. It is also a quick way to test what a document says. `doc.encode()` returns the file as bytes instead, for sending it over the network.

## Page setup

Options to `pdf.new` choose the page: `pageSize` (`"letter"`, the default, `"legal"`, `"tabloid"`, `"a3"`, `"a4"` or `"a5"`), `landscape`, or a custom `width` and `height` in points (72 to an inch). `margin` defaults to 72 points, `fontSize` to 12, and `title`, `author` and `subject` set the document's properties:

```osl
import "std:pdf"

auto doc = pdf.new({pageSize: "a4", title: "Report", author: "Ada"})
log doc.pageSize()
log doc.margin() doc.fontSize()
log doc.title() doc.author()

auto wide = pdf.new({pageSize: "a4", landscape: true})
log wide.pageSize()
```

```output
{"height":842,"width":595}
72 12
Report Ada
{"height":595,"width":842}
```

Change settings for text written from now on with `setFontSize(points)`, `setMargin(points)`, `setTitle`, `setAuthor` and `setSubject`.

## Flowing text

Text starts at the top margin and moves down. A line that would pass the bottom margin starts a new page. `newLine()` leaves a blank line, `addPage()` starts a page on purpose, and `wrap: true` breaks a long line at the margins:

```osl
import "std:pdf"

auto doc = pdf.new({pageSize: "a5"})
doc.setFontSize(20)
doc.text("Quarterly report")
doc.setFontSize(12)
doc.newLine()
string summary = [
  "Sales rose in every region this quarter,",
  "and the table below shows how the numbers break down by product."
].join(" ")
doc.text(summary, {wrap: true})
log doc.pageText(1)

doc.addPage()
doc.text("Second page")
log doc.pageCount()
```

```output
Quarterly report
Sales rose in every region this quarter, and the
table below shows how the numbers break down by
product.

2
```

Without `wrap`, a long line stays on one line, so wrap prose. Characters outside Windows-1252 (the Western European set) print as `?`. `doc.textWidth(text)` tells you how wide a string is in points, for lining things up.

Text can be placed at an exact spot with `x` and `y`, counted in points from the top-left corner, which is `{x: 1, y: 1}`. Give both or neither.

## Tables

`table(headers, rows)` draws a table where the flow has reached, with equal-width columns, a rule under the headers and under each row. The flow carries on below it, and a row that doesn't fit moves to a new page:

```osl
import "std:pdf"

auto doc = pdf.new()
doc.text("Stock")
doc.table(["Product", "Units"], [["Tea", 120], ["Coffee", 80]])
doc.text("Total: 200")

log doc.pageText(1)
```

```output
Stock
Product
Units
Tea
120
Coffee
80
Total: 200
```

Text too wide for its column is cut short with "…", and cells beyond the last header are left out. Each row must be an array.

## Lines and shapes

`line`, `rectangle` and `circle` draw at exact positions, in points from the top-left. Colours are `"#rrggbb"`, `"#rrggbbaa"` or `{r, g, b, a}`. A rectangle with neither `fill` nor `stroke` is outlined in black:

```osl
import "std:pdf"

auto doc = pdf.new()
doc.rectangle({x: 72, y: 100, width: 100, height: 50}, {fill: "#2f6feb"})
doc.circle({x: 300, y: 125}, 25, {stroke: "#ff0000", lineWidth: 2})
doc.line({x: 72, y: 200}, {x: 300, y: 200}, {color: "#808080"})
log doc.encode().len > 500
```

```output
true
```

Shapes don't move the text flow, so keep them clear of it or place text with `x` and `y`.

## Images

`doc.drawImage(image, rect)` draws an `*img.Image` stretched to fill `{x, y, width, height}` in points. Anything you draw or filter with [img](img.md), a [qr](qr.md) code included, goes in as it is. Translucent pixels are blended onto white:

```osl
import "std:pdf"
import "std:img"
import "std:qr"

auto doc = pdf.new()
*img.Image swatch = img.new(20, 20, {fill: "orange"})
doc.drawImage(swatch, {x: 72, y: 100, width: 40, height: 40})

*img.Image code = qr.code("https://rotur.dev").unwrap()
doc.drawImage(code, {x: 72, y: 160, width: 100, height: 100})
log doc.encode().len > 1000
```

```output
true
```

`doc.image(bytes, rect)` and `doc.imageFile(path, rect)` do the same from PNG, JPEG or GIF bytes or a file, and return a result.

## Bookmarks and watermarks

`addBookmark(title, page, options)` adds an entry to the viewer's bookmark panel. `level` nests it under the closest earlier entry one level up. `setWatermark(text)` draws light grey text diagonally across every page, including pages already written:

```osl
import "std:pdf"

auto doc = pdf.new()
doc.text("Introduction")
doc.addPage()
doc.text("Details")

doc.addBookmark("Introduction", 1)
doc.addBookmark("Details", 2, {level: 1})
doc.setWatermark("DRAFT")
log doc.watermark()

doc.setWatermark("")
log doc.watermark() == ""
```

```output
DRAFT
true
```

## Merging and splitting

`pdf.mergeFiles(paths)` returns a new document with every page of the given files in order. `pdf.splitFile(path, dir)` writes each page to `dir/page_N.pdf` and returns the paths. Both work only on files this package wrote:

```osl
import "std:pdf"
import "std:fs"

fs.remove("book.pdf", {force: true}).unwrap()
fs.remove("pages", {force: true}).unwrap()

auto doc = pdf.new()
doc.text("One")
doc.addPage()
doc.text("Two")
doc.save("book.pdf").unwrap()

auto parts = pdf.splitFile("book.pdf", "pages").unwrap()
log parts

auto joined = pdf.mergeFiles(parts.reverse()).unwrap()
log joined.pageCount()
log joined.pageText(1)

log pdf.decode([1, 2, 3]).unwrapErr().kind
```

```output
["pages/page_1.pdf","pages/page_2.pdf"]
2
Two

ParseError
```

A PDF from other software is an `UnsupportedError`, and bytes that aren't a PDF are a `ParseError`.

:::quiz
Where does `doc.text("Hi")` put the text?

- [x] Where the flow has reached: from the top margin down, then onto a new page.
- [ ] At the bottom of the page.
- [ ] At `{x: 1, y: 1}`, always.

Give `x` and `y` to place text at an exact point instead.
:::

:::exercise title="A two-page document"
Write "One" on the first page and "Two" on a second page, then print the page count.

```osl
import "std:pdf"

auto doc = pdf.new()
doc.text("One")

log doc.pageCount()
```

```output
2
```

> [!hint]
> `doc.addPage()` starts a new page.

```osl solution
import "std:pdf"

auto doc = pdf.new()
doc.text("One")
doc.addPage()
doc.text("Two")

log doc.pageCount()
```

```output
2
```
:::

## API reference

::api

# pdf

Use `pdf` to build PDF documents with text, lines, shapes, images, pages, metadata, and simple layout helpers.

```osl
import "std:pdf"
```

## Example

```osl
import "std:pdf"

auto doc = pdf.create()
doc.textAt(40, 40, "Hello")
doc.save("hello.pdf")
```

## API reference

### `pdf`

| Method | Returns | Notes |
| --- | --- | --- |
| `pdf.create()` | `*PDF` | Creates a document through `createCustom` with 612 by 792 dimensions. |
| `pdf.createCustom(width: any, height: any)` | `*PDF` | Creates a custom-sized document, falling back to default dimensions when invalid. |
| `pdf.save(path: any)` | `boolean` | Finishes the current page and writes the document. |
| `pdf.generateContent()` | `string` | Serializes page and content objects in combined output blocks. |
| `pdf.generateHeader()` | `string` | Serializes the catalog and page-tree header. |
| `pdf.generateKids()` | `string` |  |
| `pdf.addPage()` | `void` | Finishes the current page and starts another. |
| `pdf.text(content: any)` | `string` |  |
| `pdf.textAt(x: any, y: any, content: any)` | `string` | Emits the positioned text command directly into the page buffer. |
| `pdf.fontSize()` | `number` |  |
| `pdf.setFontSize(size: any)` | `void` | Sets font size. |
| `pdf.setMargin(margin: any)` | `void` | Sets margin. |
| `pdf.newLine()` | `void` |  |
| `pdf.paragraph(text: any)` | `string` |  |
| `pdf.line(x1: any, y1: any, x2: any, y2: any)` | `boolean` |  |
| `pdf.rectangle(x: any, y: any, width: any, height: any)` | `boolean` | Draws a rectangle using shared coordinate conversion. |
| `pdf.fillRectangle(x: any, y: any, width: any, height: any, color: any)` | `boolean` | Draws a filled rectangle using the same coordinate conversion. |
| `pdf.circle(x: any, y: any, radius: any)` | `boolean` |  |
| `pdf.image(x: any, y: any, width: any, height: any, imagePath: any)` | `boolean` |  |
| `pdf.addImageBytes(x: any, y: any, width: any, height: any, data: byte[])` | `boolean` | Adds an image from encoded bytes. |
| `pdf.table(headers: array, rows: array)` | `boolean` |  |
| `pdf.escapeString(str: string)` | `string` |  |
| `pdf.setMetadata(title: any, author: any, subject: any)` | `void` | Sets metadata. |
| `pdf.addWatermark(text: any)` | `string` | Adds watermark. |
| `pdf.getPageCount()` | `number` | Returns page count. |
| `pdf.merge(pdfFiles: array)` | `*PDF` |  |
| `pdf.split(pdfPath: any, outputDir: any)` | `boolean` |  |
| `pdf.addBookmark(level: any, title: any, page: any)` | `boolean` | Adds bookmark. |
| `pdf.getPageText(pageNum: any)` | `string` | Returns page text. |
| `pdf.getInfo(filePath: any)` | `object` | Returns info. |

## Notes

- Prefer `import "std:pdf"`; the older `import "osl/pdf"` spelling remains supported.

## Behavior and limits

The writer escapes text before adding it to PDF content streams. Invalid page dimensions use the
defaults. Missing images are rejected. Saving an empty document produces one blank page. Write
errors are reported.

# pdf

> Generate PDF documents

Use `pdf` to build PDF documents with text, lines, shapes, images, pages, metadata, and simple layout helpers.

```javascript
import "osl/pdf"
```

## Example

```javascript
import "osl/pdf"

auto doc = pdf.create()
doc.textAt(40, 40, "Hello")
doc.save("hello.pdf")
```

## API reference

### `pdf`

| Method | Returns | Description |
| --- | --- | --- |
| `pdf.create()` | `*PDF` | Creates a document through `createCustom` with 612 by 792 dimensions. |
| `pdf.createCustom(width: any, height: any)` | `*PDF` | Creates a custom-sized document, falling back to default dimensions when invalid. |
| `pdf.save(path: any)` | `boolean` | Flushes the pending page through the shared page path and writes the document. |
| `pdf.generateContent()` | `string` | Serializes page and content objects in combined output blocks. |
| `pdf.generateHeader()` | `string` | Serializes the catalog and page-tree header. |
| `pdf.generateKids()` | `string` | Runs the generate kids operation. |
| `pdf.addPage()` | `void` | Flushes the current page through the shared page path. |
| `pdf.text(content: any)` | `string` | Runs the text operation. |
| `pdf.textAt(x: any, y: any, content: any)` | `string` | Emits the positioned text command directly into the page buffer. |
| `pdf.fontSize()` | `number` | Runs the font size operation. |
| `pdf.setFontSize(size: any)` | `void` | Sets font size. |
| `pdf.setMargin(margin: any)` | `void` | Sets margin. |
| `pdf.newLine()` | `void` | Runs the new line operation. |
| `pdf.paragraph(text: any)` | `string` | Runs the paragraph operation. |
| `pdf.line(x1: any, y1: any, x2: any, y2: any)` | `boolean` | Runs the line operation. |
| `pdf.rectangle(x: any, y: any, width: any, height: any)` | `boolean` | Draws a rectangle using shared coordinate conversion. |
| `pdf.fillRectangle(x: any, y: any, width: any, height: any, color: any)` | `boolean` | Draws a filled rectangle using the same coordinate conversion. |
| `pdf.circle(x: any, y: any, radius: any)` | `boolean` | Runs the circle operation. |
| `pdf.image(x: any, y: any, width: any, height: any, imagePath: any)` | `boolean` | Runs the image operation. |
| `pdf.addImageBytes(x: any, y: any, width: any, height: any, data: bytes)` | `boolean` | Adds image bytes. |
| `pdf.table(headers: array, rows: array)` | `boolean` | Runs the table operation. |
| `pdf.escapeString(str: string)` | `string` | Runs the escape string operation. |
| `pdf.setMetadata(title: any, author: any, subject: any)` | `void` | Sets metadata. |
| `pdf.addWatermark(text: any)` | `string` | Adds watermark. |
| `pdf.getPageCount()` | `number` | Returns page count. |
| `pdf.merge(pdfFiles: array)` | `*PDF` | Runs the merge operation. |
| `pdf.split(pdfPath: any, outputDir: any)` | `boolean` | Runs the split operation. |
| `pdf.addBookmark(level: any, title: any, page: any)` | `boolean` | Adds bookmark. |
| `pdf.getPageText(pageNum: any)` | `string` | Returns page text. |
| `pdf.getInfo(filePath: any)` | `object` | Returns info. |

## Notes

- Standard-library imports accept both `import "osl/pdf"` and `import "pdf"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Text is escaped through one PDF string escaper before serialization. Invalid
dimensions fall back to defaults, missing image paths are rejected, blank
documents produce a blank page, and write failures are reported.

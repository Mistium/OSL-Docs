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
| `pdf.create()` | `*PDF` | Creates a new value. |
| `pdf.createCustom(width: any, height: any)` | `*PDF` | Creates custom. |
| `pdf.save(path: any)` | `boolean` | Runs the save operation. |
| `pdf.generateContent()` | `string` | Runs the generate content operation. |
| `pdf.generateHeader()` | `string` | Runs the generate header operation. |
| `pdf.generateKids()` | `string` | Runs the generate kids operation. |
| `pdf.addPage()` | `void` | Adds page. |
| `pdf.text(content: any)` | `string` | Runs the text operation. |
| `pdf.textAt(x: any, y: any, content: any)` | `string` | Runs the text at operation. |
| `pdf.fontSize()` | `number` | Runs the font size operation. |
| `pdf.setFontSize(size: any)` | `void` | Sets font size. |
| `pdf.setMargin(margin: any)` | `void` | Sets margin. |
| `pdf.newLine()` | `void` | Runs the new line operation. |
| `pdf.paragraph(text: any)` | `string` | Runs the paragraph operation. |
| `pdf.line(x1: any, y1: any, x2: any, y2: any)` | `boolean` | Runs the line operation. |
| `pdf.rectangle(x: any, y: any, width: any, height: any)` | `boolean` | Runs the rectangle operation. |
| `pdf.fillRectangle(x: any, y: any, width: any, height: any, color: any)` | `boolean` | Runs the fill rectangle operation. |
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

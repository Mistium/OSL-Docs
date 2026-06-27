# pdf

> PDF generation and manipulation

```javascript
import "osl/pdf"
```

## Methods

- `pdf.create()` → `PDF`
- `pdf.createCustom(width, height)` → `PDF`
- `pdf.save(path)` → `boolean`
- `pdf.addPage()`
- `pdf.text(content)` → `string`
- `pdf.textAt(x, y, content)` → `string`
- `pdf.fontSize()` → `number`
- `pdf.setFontSize(size)`
- `pdf.setMargin(margin)`
- `pdf.newLine()`
- `pdf.paragraph(text)` → `string`
- `pdf.line(x1, y1, x2, y2)` → `boolean`
- `pdf.rectangle(x, y, width, height)` → `boolean`
- `pdf.fillRectangle(x, y, width, height, color)` → `boolean`
- `pdf.circle(x, y, radius)` → `boolean`
- `pdf.image(x, y, width, height, imagePath)` → `boolean`
- `pdf.addImageBytes(x, y, width, height, data)` → `boolean`
- `pdf.table(headers, rows)` → `boolean`
- `pdf.setMetadata(title, author, subject)`
- `pdf.addWatermark(text)` → `string`
- `pdf.getPageCount()` → `number`
- `pdf.merge(pdfFiles)` → `PDF`
- `pdf.split(pdfPath, outputDir)` → `boolean`
- `pdf.addBookmark(level, title, page)` → `boolean`
- `pdf.getPageText(pageNum)` → `string`
- `pdf.getInfo(filePath)` → `object`

# qr

Use `qr` for QR codes, simple barcode-like outputs, and saving generated codes as image files.

```osl
import "std:qr"
```

## API reference

### `qr`

| Method | Returns | Notes |
| --- | --- | --- |
| `qr.generate(data: any, size: any, outputFile: any)` | `boolean` | Writes a QR code to a PNG file. |
| `qr.generateColored(data: any, size: any, colorArg: any, outputFile: any)` | `boolean` | Uses the same payload/size normalization with a custom foreground color. |
| `qr.generateToDataURL(data: any, size: any)` | `string` | Uses the same normalized raster as a base64 PNG data URL. |
| `qr.calculateModuleCount(data: string)` | `number` |  |
| `qr.generateQRMatrix(data: string, size: number)` | `[]array` |  |
| `qr.calculateModules(data: string)` | `array` |  |
| `qr.addFinderPatterns(matrix: []array)` | `void` | Adds finder patterns. |
| `qr.addAlignmentPatterns(matrix: []array)` | `void` | Adds alignment patterns. |
| `qr.addTimingPatterns(matrix: []array)` | `void` | Adds timing patterns. |
| `qr.addVersionInfo(matrix: []array)` | `void` | Adds version info. |
| `qr.getAlignmentPositions(size: number)` | `array` | Returns alignment positions. |
| `qr.shouldAvoidAlignment(x: number, y: number, size: number)` | `boolean` | Reports whether a position overlaps a finder-pattern margin. |
| `qr.generate128(data: any)` | `boolean` | Validates data and writes a Code 128-style barcode PNG. |
| `qr.generateEAN13(data: any)` | `boolean` | Validates 12 digits and writes an EAN-13 barcode PNG. |
| `qr.generateUPCA(data: any)` | `boolean` | Validates 11 digits and writes a UPC-A barcode PNG. |
| `qr.generateCode39(data: any)` | `boolean` | Validates Code 39 characters and writes a barcode PNG. |
| `qr.generateBarcode(data: any, length: any)` | `string` | Generates a numeric barcode string of the requested length. |
| `qr.generateSimpleBarcode(data: string)` | `string` |  |
| `qr.generateCode39Barcode(data: any)` | `string` | Uppercases and validates Code 39 text before adding start/stop markers. |
| `qr.calculateChecksum(data: string)` | `string` |  |
| `qr.verifyBarcode(data: any)` | `boolean` | Verifies barcode. |
| `qr.writeBarcode(barcode: string, data: any)` | `boolean` | Writes barcode. |
| `qr.scanBarcode(imagePath: any)` | `string` |  |
| `qr.getInfo(filePath: any)` | `object` | Returns info. |
| `qr.decode(imagePath: any)` | `string` | Returns the current explicit not-implemented diagnostic. |

## Notes

- Prefer `import "std:qr"`; the older `import "osl/qr"` spelling remains supported.

## Behavior and limits

QR payloads are limited to 2,953 bytes and generated images to 4,096 pixels per side. Barcode
helpers reject invalid numeric input. PNG creation, encoding, and file-close errors are reported.

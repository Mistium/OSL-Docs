# qr

> QR codes and barcodes

Use `qr` for QR codes, simple barcode-like outputs, and saving generated codes as image files.

```javascript
import "std:qr"
```

## API reference

### `qr`

| Method | Returns | Description |
| --- | --- | --- |
| `qr.generate(data: any, size: any, outputFile: any)` | `boolean` | Renders bounded modules through the shared rectangle path to a checked PNG file. |
| `qr.generateColored(data: any, size: any, colorArg: any, outputFile: any)` | `boolean` | Uses the same payload/size normalization with a custom foreground color. |
| `qr.generateToDataURL(data: any, size: any)` | `string` | Uses the same normalized raster as a base64 PNG data URL. |
| `qr.calculateModuleCount(data: string)` | `number` | Runs the calculate module count operation. |
| `qr.generateQRMatrix(data: string, size: number)` | `[]array` | Runs the generate qrmatrix operation. |
| `qr.calculateModules(data: string)` | `array` | Runs the calculate modules operation. |
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
| `qr.generateBarcode(data: any, length: any)` | `string` | Normalizes length and uses shared numeric validation. |
| `qr.generateSimpleBarcode(data: string)` | `string` | Runs the generate simple barcode operation. |
| `qr.generateCode39Barcode(data: any)` | `string` | Uppercases and validates Code 39 text before adding start/stop markers. |
| `qr.calculateChecksum(data: string)` | `string` | Runs the calculate checksum operation. |
| `qr.verifyBarcode(data: any)` | `boolean` | Verifies barcode. |
| `qr.writeBarcode(barcode: string, data: any)` | `boolean` | Writes barcode. |
| `qr.scanBarcode(imagePath: any)` | `string` | Runs the scan barcode operation. |
| `qr.getInfo(filePath: any)` | `object` | Returns info. |
| `qr.decode(imagePath: any)` | `string` | Returns the current explicit not-implemented diagnostic. |

## Notes

- Prefer `import "std:qr"`; the older `import "osl/qr"` spelling remains supported.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

QR-style raster helpers bound payloads to 2953 bytes and images to 4096 pixels;
QR modules and barcode bars share rectangle rasterization, while barcode helpers share numeric validation. PNG encode, close,
and create failures are reported.

# qr

> QR codes and barcodes

Use `qr` for QR codes, simple barcode-like outputs, and saving generated codes as image files.

```javascript
import "osl/qr"
```

## API reference

### `qr`

| Method | Returns | Description |
| --- | --- | --- |
| `qr.generate(data: any, size: any, outputFile: any)` | `boolean` | Runs the generate operation. |
| `qr.generateColored(data: any, size: any, colorArg: any, outputFile: any)` | `boolean` | Runs the generate colored operation. |
| `qr.generateToDataURL(data: any, size: any)` | `string` | Runs the generate to data url operation. |
| `qr.calculateModuleCount(data: string)` | `number` | Runs the calculate module count operation. |
| `qr.generateQRMatrix(data: string, size: number)` | `[]array` | Runs the generate qrmatrix operation. |
| `qr.calculateModules(data: string)` | `array` | Runs the calculate modules operation. |
| `qr.addFinderPatterns(matrix: []array)` | `void` | Adds finder patterns. |
| `qr.addAlignmentPatterns(matrix: []array)` | `void` | Adds alignment patterns. |
| `qr.addTimingPatterns(matrix: []array)` | `void` | Adds timing patterns. |
| `qr.addVersionInfo(matrix: []array)` | `void` | Adds version info. |
| `qr.getAlignmentPositions(size: number)` | `array` | Returns alignment positions. |
| `qr.shouldAvoidAlignment(x: number, y: number, size: number)` | `boolean` | Runs the should avoid alignment operation. |
| `qr.generate128(data: any)` | `boolean` | Runs the generate128 operation. |
| `qr.generateEAN13(data: any)` | `boolean` | Runs the generate ean13 operation. |
| `qr.generateUPCA(data: any)` | `boolean` | Runs the generate upca operation. |
| `qr.generateCode39(data: any)` | `boolean` | Runs the generate code39 operation. |
| `qr.generateBarcode(data: any, length: any)` | `string` | Runs the generate barcode operation. |
| `qr.generateSimpleBarcode(data: string)` | `string` | Runs the generate simple barcode operation. |
| `qr.generateCode39Barcode(data: any)` | `string` | Runs the generate code39 barcode operation. |
| `qr.calculateChecksum(data: string)` | `string` | Runs the calculate checksum operation. |
| `qr.verifyBarcode(data: any)` | `boolean` | Verifies barcode. |
| `qr.writeBarcode(barcode: string, data: any)` | `boolean` | Writes barcode. |
| `qr.scanBarcode(imagePath: any)` | `string` | Runs the scan barcode operation. |
| `qr.getInfo(filePath: any)` | `object` | Returns info. |

## Notes

- Standard-library imports accept both `import "osl/qr"` and `import "qr"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

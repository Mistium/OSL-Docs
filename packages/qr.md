# qr

> QR code generation and barcode utilities

```javascript
import "osl/qr"
```

## Methods

- `qr.generate(data, size, outputFile)` → `boolean`
- `qr.generateColored(data, size, colorArg, outputFile)` → `boolean`
- `qr.generateToDataURL(data, size)` → `string`
- `qr.generate128(data)` → `boolean`
- `qr.generateEAN13(data)` → `boolean`
- `qr.generateUPCA(data)` → `boolean`
- `qr.generateCode39(data)` → `boolean`
- `qr.generateBarcode(data, length)` → `string`
- `qr.generateSimpleBarcode(data)` → `string`
- `qr.generateCode39Barcode(data)` → `string`
- `qr.calculateChecksum(data)` → `string`
- `qr.verifyBarcode(data)` → `boolean`
- `qr.writeBarcode(barcode, data)` → `boolean`
- `qr.decode(imagePath)` → `string`
- `qr.scanBarcode(imagePath)` → `string`
- `qr.getInfo(filePath)` → `object`

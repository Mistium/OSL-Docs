# qr

Use `qr` to draw QR codes and Code 128, EAN-13, UPC-A, and Code 39 barcodes as PNG images, and to
read them back from images.

```osl
import "std:qr"
```

## Example

```osl
import "std:qr"

qr.save("https://osl.mistium.com", "site.png", {size: 320})
qr.save("590123412345", "product.png", {kind: "ean13"})

string? text = qr.scanFile("site.png")
log text ?? "no code found"
log qr.checkDigit("590123412345") // 7
```

## API reference

### `qr`

| Function | Returns | Notes |
| --- | --- | --- |
| `qr.encode(text: string, options?)` | `result<byte[], error>` | Draws `text` as a QR code or barcode and returns PNG bytes. |
| `qr.save(text: string, path: string, options?)` | `result<unit, error>` | Writes the PNG to a file. Same options as `encode`. |
| `qr.matrix(text: string, options?)` | `result<boolean[][], error>` | The modules as rows of booleans (`true` is dark), without the quiet zone. A barcode gives one row, `true` for a bar. Option: `kind`. |
| `qr.scan(data: byte[])` | `result<string?, error>` | Reads a QR code or barcode from PNG, JPEG, or GIF bytes. `null` when the image has no readable code. |
| `qr.scanFile(path: string)` | `result<string?, error>` | `qr.scan` for a file. |
| `qr.checkDigit(digits: string)` | `result<int, error>` | The EAN-13 / UPC-A check digit for a code without one. |
| `qr.hasValidCheckDigit(digits: string)` | `boolean` | Whether an EAN-13 or UPC-A code is all digits and ends with the right check digit. |

### Options

| Option | Notes |
| --- | --- |
| `kind` | `"qr"` (default), `"code128"`, `"ean13"`, `"upca"`, or `"code39"`. |
| `color`, `background` | Default `"#000000"` on `"#ffffff"`. Hex strings or `{r, g, b, a}`. |
| `size` | QR only: the image's width and height in pixels, 1 to 4096, default 256. Grown when too small for the code. |
| `height` | Barcodes only: pixels, 1 to 4096, default 120. |

### What each kind accepts

| Kind | Text |
| --- | --- |
| `qr` | Up to 2953 bytes of any text. The smallest version that fits is chosen, with a four-module quiet zone. |
| `code128` | Any ASCII text. |
| `ean13` | 12 digits (the check digit is added), or 13 with a correct check digit. |
| `upca` | 11 digits (the check digit is added), or 12 with a correct check digit. |
| `code39` | Digits, A-Z (lower case is upper-cased), space, and `- . $ / + %`. |

Barcodes are drawn at 2 pixels per module with their quiet zones. `scan` reads codes that are
upright and unrotated, as `encode` makes them; a UPC-A barcode reads as its 12 digits.

## Errors

| Function | Kind | When |
| --- | --- | --- |
| `encode`, `save`, `matrix` | `ValueError` | `text` can't be encoded as that kind. The message says why. |
| `checkDigit` | `ValueError` | `digits` is empty or has anything but 0-9. |
| `scan`, `scanFile` | `ParseError` | The data isn't an image. |
| `save`, `scanFile` | `NotFoundError`, `PermissionError`, `IOError` | The file can't be read or written. |
| `encode`, `save` | `ValueError` (thrown) | An invalid option. |

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning. Most returned `false` or
`""` on failure.

| Deprecated | Use instead |
| --- | --- |
| `qr.generate(data, size, path)` | `qr.save(text, path, {size: size})` |
| `qr.generateColored(data, size, color, path)` | `qr.save(text, path, {size: size, color: color})` |
| `qr.generateToDataURL(data, size)` | `"data:image/png;base64," ++ btoa(qr.encode(text, {size: size}))` |
| `qr.generate128(data, path?)` | `qr.save(text, path, {kind: "code128"})` |
| `qr.generateEAN13(data, path?)` | `qr.save(text, path, {kind: "ean13"})` |
| `qr.generateUPCA(data, path?)` | `qr.save(text, path, {kind: "upca"})` |
| `qr.generateCode39(data, path?)` | `qr.save(text, path, {kind: "code39"})` |
| `qr.decode(path)`, `qr.scanBarcode(path)` | `qr.scanFile(path)` |
| `qr.barcodeError(kind, data)` | `qr.encode`, `qr.save`, and `qr.matrix` fail with a `ValueError` giving the reason |
| `qr.barcodeModules(kind, data)` | `qr.matrix(text, {kind: kind})` |
| `qr.generateBarcode(data, length)` | Pad the digits yourself and use `qr.checkDigit(digits)` |
| `qr.generateSimpleBarcode(digits)` | `digits ++ qr.checkDigit(digits)` |
| `qr.generateCode39Barcode(text)` | `"*" ++ text.toUpper() ++ "*"` for the readable form, `qr.encode(text, {kind: "code39"})` to draw it |
| `qr.calculateChecksum(digits)` | `qr.checkDigit(digits)` |
| `qr.verifyBarcode(digits)` | `qr.hasValidCheckDigit(digits)` |
| `qr.getInfo(path)` | `fs.stat(path)` |

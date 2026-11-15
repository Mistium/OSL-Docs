# qr

Use `qr` to make QR codes and barcodes and to read them back. A code is an image from
[`img`](img.md), so anything that takes an image takes one: a `std:ui` `<image>` tag shows it,
and `img` saves or encodes it.

```osl
import "std:qr"
import "std:img"

*img.Image code = qr.code("https://rotur.dev/link?code=AB12")!
code.save("code.png")!
```

`qr.read` reads codes from real images too, such as photos and screenshots: a code at an angle,
in perspective, blurred, on a busy background, or light on dark.

## Making a QR code

```osl
*img.Image code = qr.code(text, {size: 512, margin: 4, color: "#000000", background: "#ffffff", level: "M"})!
```

| Option | Default | Notes |
| --- | --- | --- |
| `size` | `256` | Width and height in pixels, 1-4096. Grows to fit at least one pixel per module. |
| `margin` | `4` | The blank border around the code, in modules, 0-64. |
| `color` | `"#000000"` | The dark modules. |
| `background` | `"#ffffff"` | The light modules and margin; may be transparent. |
| `level` | `"M"` | Error correction: `"L"` (7%), `"M"` (15%), `"Q"` (25%) or `"H"` (30%) of the code can be damaged and still read. Without `level`, text too long for M is made at L. |

Fails with `ValueError` when the text is too long for a QR code (2953 bytes at level L).

## Making a barcode

```osl
*img.Image bars = qr.barcode("590123412345", {kind: "ean13", height: 120})!
```

| Option | Default | Notes |
| --- | --- | --- |
| `kind` | `"code128"` | `"code128"`, `"ean13"`, `"upca"` or `"code39"`, in any case, with or without `-`. |
| `height` | `120` | In pixels, 1-4096. |
| `color` | `"#000000"` | The bars. |
| `background` | `"#ffffff"` | The spaces and quiet zones. |

EAN-13 takes 12 digits, or 13 with a check digit it checks; UPC-A takes 11 or 12. Code 39 takes
letters, digits, space and `- . $ / + %`. Fails with `ValueError` when the text can't be written
as that kind.

## Reading a code

```osl
string text = qr.read(img.open("photo.jpg")!)!
```

`qr.read(picture)` gives the text of the first QR code or barcode it finds in the image. It reads
QR codes, Code 128, Code 39, Code 93, EAN-13, EAN-8, UPC-A, UPC-E, ITF and Codabar. A UPC-A
barcode reads as its 12 digits, and so does an EAN-13 that starts with `0`, which is the same barcode:
`qr.read` gives it back without the `0`. Fails with `NotFoundError` when the image has no code it can
read, and `StateError` when the image is closed.

## API reference

| Function | Returns | Notes |
| --- | --- | --- |
| `qr.code(text: string, opts?: object)` | `result<*img.Image, error>` | A QR code image. |
| `qr.barcode(text: string, opts?: object)` | `result<*img.Image, error>` | A barcode image. |
| `qr.read(picture: *img.Image)` | `result<string, error>` | The text of a QR code or barcode in an image. |
| `qr.modules(text: string, opts?: object)` | `result<boolean[][], error>` | A code's grid, `true` for dark, without its quiet zone: a QR code's rows, or one row of a barcode's bars. Takes `kind` (`"qr"` by default, or a barcode kind) and `level`. |
| `qr.checkDigit(digits: string)` | `result<int, error>` | The check digit an EAN-13 or UPC-A code ends with. |

## Showing a code in a UI

```osl
import "std:ui"

auto code = qr.code("https://rotur.dev/link?code=AB12").unwrap()

def LoginCode() ui.node -> <column align=center>
  <image src=${code}/>
  <text>scan to log in</text>
</column>
```

## Upgrading from older versions

The older functions are gone. Each one maps onto the API above:

| Old | Now |
| --- | --- |
| `qr.encode(text, opts)` | `qr.code(text, opts)!.encode("png")` |
| `qr.save(text, path, opts)` | `qr.code(text, opts)!.save(path)` |
| `qr.matrix(text)` | `qr.modules(text)` |
| `qr.scan(bytes)` | `qr.read(img.decode(bytes)!)` |
| `qr.scanFile(path)` | `qr.read(img.open(path)!)` |
| `qr.generate`, `qr.generateColored`, `qr.generateToDataURL` | `qr.code`, then the image's `save` or `toDataURL` |
| `qr.generate128`, `qr.generateEAN13`, `qr.generateUPCA`, `qr.generateCode39` | `qr.barcode(text, {kind: ...})` |
| `qr.decode`, `qr.scanBarcode` | `qr.read` |
| `qr.hasValidCheckDigit`, `qr.verifyBarcode`, `qr.calculateChecksum` | `qr.checkDigit` |

---
description: Make QR codes and barcodes as images, read them back from any image, and get a code's grid to draw it yourself.
package: qr
---

# qr

`std:qr` makes QR codes and barcodes (Code 128, EAN-13, UPC-A and Code 39) and reads them back. A code is a plain `*img.Image` from [img](img.md), so whatever takes an image takes a code: save it as a file, resize it, draw it into another image, or show it in a [ui](ui.md) view.

Reach for it for sign-in links, tickets, labels and anything a phone camera should read.

## A QR code

`qr.code(text)` returns a result holding the image. It is 256 pixels square by default, black on white, with a blank border (the quiet zone) that scanners need:

```osl
import "std:qr"

auto code = qr.code("https://rotur.dev/link?code=AB12").unwrap()
log code.width() code.height()
```

```output
256 256
```

## Reading it back

`qr.read(image)` finds a code in an image and returns its text. It reads codes `qr.code` made and ones in photos or screenshots at any angle, and it also reads barcodes. When there is no code, it fails with `NotFoundError`:

```osl
import "std:qr"
import "std:img"

auto code = qr.code("https://rotur.dev/link?code=AB12").unwrap()
log qr.read(code).unwrap()

*img.Image blank = img.new(50, 50, {fill: "white"})
log qr.read(blank).unwrapErr().kind
```

```output
https://rotur.dev/link?code=AB12
NotFoundError
```

## Options

`size` is the image's width and height in pixels (it grows if needed to give each dot a whole pixel). `margin` is the border in modules, `color` and `background` are colours given as `"#rrggbb"`, `"#rrggbbaa"` or `{r, g, b, a}`. `level` is how much of the code may be damaged and still read: `"L"`, `"M"` (the default), `"Q"` or `"H"`.

```osl
import "std:qr"

auto code = qr.code("hi", {size: 100, margin: 2, level: "H", color: "#000080", background: "#ffffff"}).unwrap()
log code.width()
log code.pixel(1, 1)
log qr.read(code).unwrap()

log qr.code("x" * 5000).unwrapErr().kind
```

```output
100
#ffffff
hi
ValueError
```

Text too long for a QR code fails with `ValueError`. A higher `level` makes a denser code that survives more damage, which suits a logo laid over the middle.

> [!note]
> Unlike [img](img.md), the colour options here don't accept CSS names such as `"navy"`. Use hex or `{r, g, b, a}`.

## Saving and showing a code

Because it is an image, a code saves like one, and a `ui` view shows it with an `<image>` tag:

```osl
import "std:qr"
import "std:img"
import "std:ui"
import "std:fs"

fs.remove("code.png", {force: true}).unwrap()

*img.Image code = qr.code("hello").unwrap()
code.save("code.png").unwrap()
log qr.read(img.decodeFile("code.png").unwrap()).unwrap()

def View() ui.node (
  return <column pad=10>
    <text>Scan me</text>
    <image src=${code} width=100 height=100/>
  </column>
)
log ui.html(View).contains("data:image/png")
fs.remove("code.png").unwrap()
```

```output
hello
true
```

## Barcodes

`qr.barcode(text, options)` makes a barcode. `kind` is `"code128"` (the default, any text), `"ean13"`, `"upca"` or `"code39"` (upper-case letters, digits and `- . $ / + %` and space). `height` is in pixels. EAN-13 takes 12 or 13 digits, and UPC-A 11 or 12, adding or checking the last digit:

```osl
import "std:qr"

auto label = qr.barcode("HELLO-123", {kind: "code39", height: 40}).unwrap()
log label.height()
log qr.read(label).unwrap()

auto ean = qr.barcode("590123412345", {kind: "ean13"}).unwrap()
log qr.read(ean).unwrap()
log qr.checkDigit("590123412345").unwrap()

log qr.barcode("abc", {kind: "ean13"}).unwrapErr().kind
```

```output
40
HELLO-123
5901234123457
7
ValueError
```

`qr.checkDigit(digits)` computes the final digit for the code without it. A barcode that doesn't fit its kind fails with `ValueError`.

## Drawing a code yourself

`qr.modules(text)` returns the code as a grid of booleans, `true` for dark, with no quiet zone. Use it to draw a code another way, such as with [raylib](raylib.md) rectangles or in a terminal:

```osl
import "std:qr"

auto grid = qr.modules("hi").unwrap()
log grid.len grid[1].len

for row in grid (
  string line = ""
  for dark in row (
    line = line ++ (if dark then "##" else "  ")
  )
  log line
)
```

```output
21 21
##############    ########  ##############
##          ##    ####  ##  ##          ##
##  ######  ##  ####  ####  ##  ######  ##
##  ######  ##  ####    ##  ##  ######  ##
##  ######  ##  ##    ####  ##  ######  ##
##          ##  ####    ##  ##          ##
##############  ##  ##  ##  ##############
                ##  ######                
##  ##########          ##  ##########    
  ######  ##  ##    ##  ##    ##        ##
    ####    ####  ##  ##  ##    ########  
######  ##        ##          ####  ##    
######  ##  ##        ##  ##    ##  ##  ##
                ##    ########    ##    ##
##############      ##  ##  ####      ##  
##          ##  ##############    ##    ##
##  ######  ##  ##      ##    ##    ##    
##  ######  ##  ######  ##    ##    ##    
##  ######  ##  ##    ##  ##    ######    
##          ##    ####        ####  ##    
##############  ##  ####  ##    ########  
```

Pass `{kind: "code128"}` or another barcode kind to get one row of bars instead.

:::quiz
`qr.read` is given a blank white image. What does it return?

- [ ] An empty string.
- [x] An error result with kind `NotFoundError`.
- [ ] It throws and stops the program.

When there is no code it can read, the result is an error. Check it with `.isErr()` or `.unwrapErr()`.
:::

:::exercise title="Round trip"
Make a QR code for `"OSL"`, read it back, and print the text.

```osl
import "std:qr"

auto code = qr.code("OSL").unwrap()
log code.width()
```

```output
OSL
```

> [!hint]
> `qr.read(code)` returns a result. Unwrap it.

```osl solution
import "std:qr"

auto code = qr.code("OSL").unwrap()
log qr.read(code).unwrap()
```

```output
OSL
```
:::

## API reference

::api

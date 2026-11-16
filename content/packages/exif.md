---
description: Read an image's EXIF orientation and strip its EXIF metadata without re-encoding the pixels.
package: exif
---

# exif

Photos carry EXIF metadata: where they were taken, with what camera, and which way up the sensor was held. `std:exif` reads the orientation and removes the metadata, working on the bytes of the file so the picture itself is never re-encoded.

Use it when you accept uploads: fix the orientation so portraits aren't sideways, and strip the metadata before you publish a photo, since it can hold a location.

A phone photo already carries EXIF, but the examples need one that does so predictably. `withOrientation` in the `photo.osl` tab of each example adds an orientation tag to a JPEG that [img](img.md) encoded.

## Reading what a photo says

`exif.has(data)` says whether a JPEG, PNG, WebP or TIFF carries EXIF. It never fails: bad data gives `false`. `exif.orientation(data)` returns a result with a number from 1 to 8. 1 means upright, and 6 means "rotate 90 degrees clockwise to display". An image with no EXIF is 1, as is any format that cannot carry it, such as GIF or BMP. Data that is not an image is a `ParseError`:

```osl file=main.osl
import "std:exif"
import "std:img"
import "./photo.osl"

byte[] plain = img.new(4, 2, {fill: "red"}).encode("jpeg").unwrap()
byte[] tagged = withOrientation(plain, 6)

log exif.has(plain) exif.has(tagged)
log exif.orientation(plain).unwrap() exif.orientation(tagged).unwrap()
log exif.orientation([1, 2, 3]).unwrapErr().kind
```

```osl file=photo.osl
def withOrientation(byte[] jpeg, int value) byte[] (
  byte[] tiff = [
    0x4D, 0x4D, 0, 0x2A, 0, 0, 0, 8, 0, 1, 0x01, 0x12, 0, 3, 0, 0, 0, 1, 0,
    value.as<byte>, 0, 0, 0, 0, 0, 0
  ]
  byte[] body = [0x45, 0x78, 0x69, 0x66, 0, 0] + tiff
  int size = body.len + 2
  byte[] segment = [0xFF, 0xE1, floor(size / 256).as<byte>, (size % 256).as<byte>] + body
  return [jpeg[1], jpeg[2]] + segment + jpeg.trim(3, jpeg.len)
)
```

```output
false true
1 6
ParseError
```

## Turning the picture upright

An image with orientation 6 is stored sideways. `img.decode` turns it for you with `autoOrient`, or you can read the number and call `orient`. `img.info(data)` reports the same number in its `orientation` field:

```osl file=main.osl
import "std:exif"
import "std:img"
import "./photo.osl"

byte[] tagged = withOrientation(img.new(4, 2, {fill: "red"}).encode("jpeg").unwrap(), 6)

*img.Image raw = img.decode(tagged).unwrap()
log raw.width() raw.height()

*img.Image upright = img.decode(tagged, {autoOrient: true}).unwrap()
log upright.width() upright.height()

*img.Image same = raw.orient(exif.orientation(tagged).unwrap())
log same.width() same.height()
```

```osl file=photo.osl
def withOrientation(byte[] jpeg, int value) byte[] (
  byte[] tiff = [
    0x4D, 0x4D, 0, 0x2A, 0, 0, 0, 8, 0, 1, 0x01, 0x12, 0, 3, 0, 0, 0, 1, 0,
    value.as<byte>, 0, 0, 0, 0, 0, 0
  ]
  byte[] body = [0x45, 0x78, 0x69, 0x66, 0, 0] + tiff
  int size = body.len + 2
  byte[] segment = [0xFF, 0xE1, floor(size / 256).as<byte>, (size % 256).as<byte>] + body
  return [jpeg[1], jpeg[2]] + segment + jpeg.trim(3, jpeg.len)
)
```

```output
4 2
2 4
2 4
```

## Stripping metadata

`exif.strip(data)` returns a copy of a JPEG, PNG or WebP with the EXIF block removed. Every other byte is unchanged, so there is no quality loss. An image without EXIF comes back identical. TIFF, HEIF, AVIF and JPEG XL are an `UnsupportedError`:

```osl file=main.osl
import "std:exif"
import "std:img"
import "./photo.osl"

byte[] tagged = withOrientation(img.new(4, 2, {fill: "red"}).encode("jpeg").unwrap(), 6)

byte[] clean = exif.strip(tagged).unwrap()
log exif.has(tagged) exif.has(clean)
log clean.len < tagged.len
log exif.orientation(clean).unwrap()
```

```osl file=photo.osl
def withOrientation(byte[] jpeg, int value) byte[] (
  byte[] tiff = [
    0x4D, 0x4D, 0, 0x2A, 0, 0, 0, 8, 0, 1, 0x01, 0x12, 0, 3, 0, 0, 0, 1, 0,
    value.as<byte>, 0, 0, 0, 0, 0, 0
  ]
  byte[] body = [0x45, 0x78, 0x69, 0x66, 0, 0] + tiff
  int size = body.len + 2
  byte[] segment = [0xFF, 0xE1, floor(size / 256).as<byte>, (size % 256).as<byte>] + body
  return [jpeg[1], jpeg[2]] + segment + jpeg.trim(3, jpeg.len)
)
```

```output
true false
true
1
```

> [!important]
> Stripping removes the orientation too. If the photo is stored sideways, turn it upright first, save it, then strip.

## Files

`exif.orientationFile(path)` and `exif.stripFile(path)` do the same from a file. `stripFile` returns the cleaned bytes and leaves the file as it is, so write the result where you want it with `fs.writeFileBytes`.

:::quiz
A photo has orientation 6. What does that mean?

- [ ] It is upside down.
- [x] It must be rotated 90 degrees clockwise to display upright.
- [ ] It has six frames.

1 is upright, and the numbers 2 to 8 are the other turns and flips.
:::

:::exercise title="Is it upright?"
Finish `isUpright` so it returns `true` only for an image whose orientation is 1. Data that can't be read is not upright.

```osl
import "std:exif"
import "std:img"

def isUpright(byte[] data) boolean -> false

byte[] jpeg = img.new(4, 4, {fill: "red"}).encode("jpeg").unwrap()
log isUpright(jpeg)
log isUpright([1, 2, 3])
```

```output
true
false
```

> [!hint]
> `exif.orientation(data)` returns a result.

> [!hint]
> `exif.orientation(data).unwrapOr(0) == 1` treats a failure as 0.

```osl solution
import "std:exif"
import "std:img"

def isUpright(byte[] data) boolean -> exif.orientation(data).unwrapOr(0) == 1

byte[] jpeg = img.new(4, 4, {fill: "red"}).encode("jpeg").unwrap()
log isUpright(jpeg)
log isUpright([1, 2, 3])
```
:::

## API reference

::api

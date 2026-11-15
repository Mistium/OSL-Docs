---
description: Read an image's EXIF orientation and strip its EXIF metadata without re-encoding the pixels.
package: exif
---

# exif

Photos carry EXIF metadata: where they were taken, with what camera, and which way up the sensor was held. `std:exif` reads the orientation and removes the metadata, working on the bytes of the file so the picture itself is never re-encoded.

Reach for it when you accept uploads. Fix the orientation so portraits are not sideways, and strip the metadata before you publish a photo, since it can hold a location.

The examples build their own JPEG: a function adds an orientation tag to an image encoded by [img](img.md). Real photos from a phone already have one.

```osl
import "std:img"

def withOrientation(byte[] jpeg, int value) byte[] (
  byte[] tiff = [0x4D, 0x4D, 0, 0x2A, 0, 0, 0, 8, 0, 1, 0x01, 0x12, 0, 3, 0, 0, 0, 1, 0, value.as<byte>, 0, 0, 0, 0, 0, 0]
  byte[] body = [0x45, 0x78, 0x69, 0x66, 0, 0] + tiff
  int size = body.len + 2
  byte[] segment = [0xFF, 0xE1, floor(size / 256).as<byte>, (size % 256).as<byte>] + body
  return [jpeg[1], jpeg[2]] + segment + jpeg.trim(3, jpeg.len)
)

*img.Image pic = img.new(4, 2, {fill: "red"})
byte[] plain = pic.encode("jpeg").unwrap()
byte[] tagged = withOrientation(plain, 6)
log plain.len < tagged.len
```

```output
true
```

## Checking for metadata

`exif.has(data)` says whether a JPEG, PNG, WebP or TIFF carries EXIF. It never fails: bad data gives `false`.

```osl
import "std:exif"
import "std:img"

*img.Image pic = img.new(4, 2, {fill: "red"})
byte[] plain = pic.encode("jpeg").unwrap()
log exif.has(plain)
log exif.has([1, 2, 3])
```

```output
false
false
```

## Reading the orientation

`exif.orientation(data)` returns a result with a number from 1 to 8. 1 means upright, and 6 means "rotate 90 degrees clockwise to display". An image with no EXIF is 1, as is any format that cannot carry it, such as GIF or BMP. Data that is not an image is a `ParseError`:

```osl
import "std:exif"
import "std:img"

def withOrientation(byte[] jpeg, int value) byte[] (
  byte[] tiff = [0x4D, 0x4D, 0, 0x2A, 0, 0, 0, 8, 0, 1, 0x01, 0x12, 0, 3, 0, 0, 0, 1, 0, value.as<byte>, 0, 0, 0, 0, 0, 0]
  byte[] body = [0x45, 0x78, 0x69, 0x66, 0, 0] + tiff
  int size = body.len + 2
  byte[] segment = [0xFF, 0xE1, floor(size / 256).as<byte>, (size % 256).as<byte>] + body
  return [jpeg[1], jpeg[2]] + segment + jpeg.trim(3, jpeg.len)
)

byte[] plain = img.new(4, 2, {fill: "red"}).encode("jpeg").unwrap()
byte[] tagged = withOrientation(plain, 6)

log exif.orientation(plain).unwrap()
log exif.has(tagged) exif.orientation(tagged).unwrap()
log exif.orientation([1, 2, 3]).unwrapErr().kind
```

```output
1
true 6
ParseError
```

## Turning the picture upright

An image with orientation 6 is stored sideways. `img.decode` turns it for you with `autoOrient`, or you can ask for the number and call `orient`:

```osl
import "std:exif"
import "std:img"

def withOrientation(byte[] jpeg, int value) byte[] (
  byte[] tiff = [0x4D, 0x4D, 0, 0x2A, 0, 0, 0, 8, 0, 1, 0x01, 0x12, 0, 3, 0, 0, 0, 1, 0, value.as<byte>, 0, 0, 0, 0, 0, 0]
  byte[] body = [0x45, 0x78, 0x69, 0x66, 0, 0] + tiff
  int size = body.len + 2
  byte[] segment = [0xFF, 0xE1, floor(size / 256).as<byte>, (size % 256).as<byte>] + body
  return [jpeg[1], jpeg[2]] + segment + jpeg.trim(3, jpeg.len)
)

byte[] tagged = withOrientation(img.new(4, 2, {fill: "red"}).encode("jpeg").unwrap(), 6)

*img.Image raw = img.decode(tagged).unwrap()
log raw.width() raw.height()

*img.Image upright = img.decode(tagged, {autoOrient: true}).unwrap()
log upright.width() upright.height()

*img.Image same = raw.orient(exif.orientation(tagged).unwrap())
log same.width() same.height()
```

```output
4 2
2 4
2 4
```

`img.info(data)` reports the same number in its `orientation` field.

## Stripping metadata

`exif.strip(data)` returns a copy of a JPEG, PNG or WebP with the EXIF block removed. Every other byte is unchanged, so there is no quality loss. An image without EXIF comes back identical. TIFF, HEIF, AVIF and JPEG XL are an `UnsupportedError`:

```osl
import "std:exif"
import "std:img"

def withOrientation(byte[] jpeg, int value) byte[] (
  byte[] tiff = [0x4D, 0x4D, 0, 0x2A, 0, 0, 0, 8, 0, 1, 0x01, 0x12, 0, 3, 0, 0, 0, 1, 0, value.as<byte>, 0, 0, 0, 0, 0, 0]
  byte[] body = [0x45, 0x78, 0x69, 0x66, 0, 0] + tiff
  int size = body.len + 2
  byte[] segment = [0xFF, 0xE1, floor(size / 256).as<byte>, (size % 256).as<byte>] + body
  return [jpeg[1], jpeg[2]] + segment + jpeg.trim(3, jpeg.len)
)

byte[] tagged = withOrientation(img.new(4, 2, {fill: "red"}).encode("jpeg").unwrap(), 6)

byte[] clean = exif.strip(tagged).unwrap()
log exif.has(tagged) exif.has(clean)
log clean.len < tagged.len
log exif.orientation(clean).unwrap()
```

```output
true false
true
1
```

> [!important]
> Stripping removes the orientation too. If the photo is stored sideways, turn it upright first (see above), save it, then strip.

## Files

`exif.orientationFile(path)` and `exif.stripFile(path)` do the same from a file. `stripFile` returns the cleaned bytes and leaves the file as it is, so write the result where you want it with `fs.writeFileBytes`.

:::quiz
A photo has orientation 6. What does that mean?

- [ ] It is upside down.
- [x] It must be rotated 90 degrees clockwise to display upright.
- [ ] It has six frames.

1 is upright, and the numbers 2 to 8 are the other turns and flips.
:::

:::exercise title="Does it have EXIF?"
`has` says whether bytes carry EXIF. Build a plain JPEG from `img`, and print whether it has EXIF.

```osl
import "std:exif"
import "std:img"

byte[] jpeg = img.new(4, 4, {fill: "red"}).encode("jpeg").unwrap()
log jpeg.len > 0
```

```output
false
```

> [!hint]
> `exif.has(jpeg)` never fails.

```osl solution
import "std:exif"
import "std:img"

byte[] jpeg = img.new(4, 4, {fill: "red"}).encode("jpeg").unwrap()
log exif.has(jpeg)
```

```output
false
```
:::

## API reference

::api

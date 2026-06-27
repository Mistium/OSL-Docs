# img

> Memory-efficient image utilities following Go idioms

```javascript
import "osl/img"
```

## Methods

- `img.open(path)` → `imgImage`
- `img.decode(r)` → `imgImage`
- `img.decodeBytes(data)` → `imgImage`
- `img.openSize(path)`
- `img.decodeSize(r)`
- `img.encodePNG(w, i)` → `boolean`
- `img.encodeJPEG(w, i, q)` → `boolean`
- `img.encodePNGBytes(i)` → `bytes`
- `img.encodeJPEGBytes(i, q)` → `bytes`
- `img.new(w, h)` → `imgImage`
- `img.clone(i)` → `imgImage`
- `img.resize(i, w, h)` → `imgImage`
- `img.resizeFast(i, w, h)` → `imgImage`
- `img.resizeWidth(i, w)` → `imgImage`
- `img.resizeHeight(i, h)` → `imgImage`
- `img.resizeFit(i, maxW, maxH)` → `imgImage`
- `img.draw(dst, src, x, y)` → `boolean`
- `img.drawOver(dst, src, x, y)` → `boolean`
- `img.rotate(i, angle)` → `imgImage`
- `img.rotate90(src, a)` → `imgImage`
- `img.rotateAny(src, angle)` → `imgImage`
- `img.normalizeOrientation(i, r)` → `imgImage`
- `img.fill(i, r, g, b, a)` → `boolean`
- `img.savePNG(i, path)` → `boolean`
- `img.saveJPEG(i, path, quality)` → `boolean`

## Returned object: `imgImage`

Returned by `img` methods; call these on the value you get back.

- `imgImage.Close()`
- `imgImage.Width()` → `number`
- `imgImage.Height()` → `number`
- `imgImage.Size()` → `object`

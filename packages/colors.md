# colors

Use `colors` to construct color values for image, canvas, QR, PDF, and window drawing APIs.

```osl
import "std:colors"
```

## Example

```osl
import "std:colors"

auto red = colors.rgb(255, 0, 0)
auto transparent = colors.RGBA(0, 0, 0, 128)
```

## API reference

### `colors`

| Method | Returns | Notes |
| --- | --- | --- |
| `colors.RGBA(r: any, g: any, b: any, a: any)` | `color.RGBA` | Builds a color from red, green, blue, and alpha channels. |
| `colors.rgb(r: any, g: any, b: any)` | `color.RGBA` | Builds an RGBA color with alpha fixed to `255`. |
| `colors.gray(v: any)` | `color.Gray` |  |
| `colors.nrgba(r: any, g: any, b: any, a: any)` | `color.NRGBA` | Builds a non-premultiplied color through the same channel coercion. |
| `colors.hex(hex: any)` | `color.RGBA` |  |

## Notes

- Prefer `import "std:colors"`; the older `import "osl/colors"` spelling remains supported.

# colors

> Build colour values (used by image-producing packages)

Use `colors` to construct color values for image, canvas, QR, PDF, and window drawing APIs.

```javascript
import "osl/colors"
```

## Example

```javascript
import "osl/colors"

auto red = colors.rgb(255, 0, 0)
auto transparent = colors.RGBA(0, 0, 0, 128)
```

## API reference

### `colors`

| Method | Returns | Description |
| --- | --- | --- |
| `colors.RGBA(r: any, g: any, b: any, a: any)` | `color.RGBA` | Builds an RGBA color through shared channel coercion. |
| `colors.rgb(r: any, g: any, b: any)` | `color.RGBA` | Builds an RGBA color with alpha fixed to `255`. |
| `colors.gray(v: any)` | `color.Gray` | Runs the gray operation. |
| `colors.nrgba(r: any, g: any, b: any, a: any)` | `color.NRGBA` | Builds a non-premultiplied color through the same channel coercion. |
| `colors.hex(hex: any)` | `color.RGBA` | Runs the hex operation. |

## Notes

- Standard-library imports accept both `import "osl/colors"` and `import "colors"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

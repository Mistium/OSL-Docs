# canvas

> In-memory pixel canvas

Use `canvas` for simple in-memory pixel buffers that can be filled, edited by pixel index or coordinate, and exported.

```javascript
import "osl/canvas"
```

## API reference

### `canvas`

| Method | Returns | Description |
| --- | --- | --- |
| `canvas.width()` | `number` | Runs the width operation. |
| `canvas.height()` | `number` | Runs the height operation. |
| `canvas.pixels()` | `number` | Runs the pixels operation. |
| `canvas.setPixel(idx: any, hexColor: any)` | `void` | Sets pixel. |
| `canvas.getPixel(idx: any)` | `string` | Returns pixel. |
| `canvas.setPixelAt(x: any, y: any, hexColor: any)` | `void` | Sets pixel at. |
| `canvas.getPixelAt(x: any, y: any)` | `string` | Returns pixel at. |
| `canvas.fill(hexColor: any)` | `void` | Runs the fill operation. |
| `canvas.clear()` | `void` | Clears all stored values. |
| `canvas.stretch(newW: any, newH: any)` | `void` | Runs the stretch operation. |
| `canvas.toURL()` | `string` | Converts to url. |
| `canvas.toArr()` | `array` | Converts the value to an array. |

## Notes

- Standard-library imports accept both `import "osl/canvas"` and `import "canvas"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

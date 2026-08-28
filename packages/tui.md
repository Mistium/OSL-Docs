# tui

Use `tui` to build terminal output with cursor movement, colors, boxes, tables, prompts, menus, charts, and key input.

```osl
import "std:tui"
```

## Example

```osl
import "std:tui"

log tui.color("green", "OK")
log tui.table(["Name"], [["Ada"]])
```

## API reference

### `tui`

| Method | Returns | Notes |
| --- | --- | --- |
| `tui.write(value: any)` | `void` | Writes to stdout without adding a newline. |
| `tui.clear()` | `void` | Clears all stored values. |
| `tui.clearLine()` | `void` |  |
| `tui.clearLines(count: any)` | `void` |  |
| `tui.moveCursor(x: any, y: any)` | `void` |  |
| `tui.moveUp(n: any)` | `void` |  |
| `tui.moveDown(n: any)` | `void` |  |
| `tui.moveRight(n: any)` | `void` |  |
| `tui.moveLeft(n: any)` | `void` |  |
| `tui.saveCursor()` | `void` | Saves cursor. |
| `tui.restoreCursor()` | `void` |  |
| `tui.hideCursor()` | `void` |  |
| `tui.showCursor()` | `void` |  |
| `tui.color(colorName: string, text: any)` | `string` | Applies a foreground color through shared ANSI wrapping. |
| `tui.bgColor(colorName: string, text: any)` | `string` | Applies a background color through shared ANSI wrapping. |
| `tui.style(styleName: string, text: any)` | `string` | Wraps text with the named ANSI style. |
| `tui.rgbColor(r: any, g: any, b: any, text: any)` | `string` | Applies RGB foreground color through shared RGB formatting. |
| `tui.rgbBg(r: any, g: any, b: any, text: any)` | `string` | Applies RGB background color through shared RGB formatting. |
| `tui.progress(current: any, total: any, width: any)` | `string` |  |
| `tui.spinner(finished: boolean)` | `string` |  |
| `tui.horizontal(width: any)` | `string` |  |
| `tui.vertical(height: any)` | `array` |  |
| `tui.box(title: any, content: any)` | `string` |  |
| `tui.drawBox(x: any, y: any, width: any, height: any, title: any)` | `void` |  |
| `tui.table(headers: array, rows: array)` | `string` | Formats headers and data through one padded-row renderer. |
| `tui.tableColored(headers: array, rows: array, colorFn: any)` | `string` | Uses the shared row renderer and colors data cells with `colorFn`. |
| `tui.Select(prompt: any, options: array)` | `any` |  |
| `tui.confirm(prompt: any)` | `boolean` |  |
| `tui.menu(title: any, items: array)` | `any` |  |
| `tui.input(prompt: any)` | `string` |  |
| `tui.password(prompt: any)` | `string` |  |
| `tui.center(text: any)` | `string` |  |
| `tui.pad(text: any, width: any, align: any)` | `string` |  |
| `tui.divider(char: any, width: any, title: any)` | `string` |  |
| `tui.status(status: any, message: any)` | `string` | Formats a named status with its icon and color. |
| `tui.frame(text: any, width: any)` | `string` |  |
| `tui.grid(items: array, columns: any)` | `string` |  |
| `tui.tree(items: array, prefix: any)` | `string` |  |
| `tui.barChart(data: array, width: any, showLabels: any)` | `string` |  |
| `tui.width()` | `number` |  |
| `tui.height()` | `number` |  |
| `tui.size()` | `array` | Returns terminal width and height as [width, height]. |
| `tui.newScreen()` | `*Screen` |  |
| `tui.readKey()` | `string` | Reads one key, preserving buffered keys from fast typing or pasted input for later calls. |
| `tui.keyPressed()` | `boolean` |  |
| `tui.interactiveSelect(prompt: any, options: array)` | `any` |  |

### `Screen` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.Set(x: any, y: any, text: string)` | `void` |  |
| `value.Clear()` | `void` |  |
| `value.Render()` | `void` |  |
| `value.WriteCenter(y: any, text: string)` | `void` | Writes center. |

## Notes

- Prefer `import "std:tui"`; the older `import "osl/tui"` spelling remains supported.

## Behavior and limits

Table padding uses visible width, so ANSI color codes do not disturb column alignment. Negative
progress becomes zero. Invalid dimensions and non-interactive output do not panic, but prompts,
menus, and key input still need a real terminal.

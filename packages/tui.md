# tui

> Terminal UI: colours, boxes, tables, prompts, menus, charts

Use `tui` to build terminal output with cursor movement, colors, boxes, tables, prompts, menus, charts, and key input.

```javascript
import "osl/tui"
```

## Example

```javascript
import "osl/tui"

log tui.color("green", "OK")
log tui.table(["Name"], [["Ada"]])
```

## API reference

### `tui`

| Method | Returns | Description |
| --- | --- | --- |
| `tui.write(value: any)` | `void` | Writes to stdout without adding a newline. |
| `tui.clear()` | `void` | Clears all stored values. |
| `tui.clearLine()` | `void` | Runs the clear line operation. |
| `tui.clearLines(count: any)` | `void` | Runs the clear lines operation. |
| `tui.moveCursor(x: any, y: any)` | `void` | Runs the move cursor operation. |
| `tui.moveUp(n: any)` | `void` | Runs the move up operation. |
| `tui.moveDown(n: any)` | `void` | Runs the move down operation. |
| `tui.moveRight(n: any)` | `void` | Runs the move right operation. |
| `tui.moveLeft(n: any)` | `void` | Runs the move left operation. |
| `tui.saveCursor()` | `void` | Saves cursor. |
| `tui.restoreCursor()` | `void` | Runs the restore cursor operation. |
| `tui.hideCursor()` | `void` | Runs the hide cursor operation. |
| `tui.showCursor()` | `void` | Runs the show cursor operation. |
| `tui.color(colorName: string, text: any)` | `string` | Applies a foreground color through shared ANSI wrapping. |
| `tui.bgColor(colorName: string, text: any)` | `string` | Applies a background color through shared ANSI wrapping. |
| `tui.style(styleName: string, text: any)` | `string` | Applies a named style through the same ANSI wrapping path. |
| `tui.rgbColor(r: any, g: any, b: any, text: any)` | `string` | Applies RGB foreground color through shared RGB formatting. |
| `tui.rgbBg(r: any, g: any, b: any, text: any)` | `string` | Applies RGB background color through shared RGB formatting. |
| `tui.progress(current: any, total: any, width: any)` | `string` | Runs the progress operation. |
| `tui.spinner(finished: boolean)` | `string` | Runs the spinner operation. |
| `tui.horizontal(width: any)` | `string` | Runs the horizontal operation. |
| `tui.vertical(height: any)` | `array` | Runs the vertical operation. |
| `tui.box(title: any, content: any)` | `string` | Runs the box operation. |
| `tui.drawBox(x: any, y: any, width: any, height: any, title: any)` | `void` | Runs the draw box operation. |
| `tui.table(headers: array, rows: array)` | `string` | Formats headers and data through one padded-row renderer. |
| `tui.tableColored(headers: array, rows: array, colorFn: any)` | `string` | Uses the shared row renderer and colors data cells with `colorFn`. |
| `tui.Select(prompt: any, options: array)` | `any` | Runs the select operation. |
| `tui.confirm(prompt: any)` | `boolean` | Runs the confirm operation. |
| `tui.menu(title: any, items: array)` | `any` | Runs the menu operation. |
| `tui.input(prompt: any)` | `string` | Runs the input operation. |
| `tui.password(prompt: any)` | `string` | Runs the password operation. |
| `tui.center(text: any)` | `string` | Runs the center operation. |
| `tui.pad(text: any, width: any, align: any)` | `string` | Runs the pad operation. |
| `tui.divider(char: any, width: any, title: any)` | `string` | Runs the divider operation. |
| `tui.status(status: any, message: any)` | `string` | Formats named status aliases through a shared icon/color lookup. |
| `tui.frame(text: any, width: any)` | `string` | Runs the frame operation. |
| `tui.grid(items: array, columns: any)` | `string` | Runs the grid operation. |
| `tui.tree(items: array, prefix: any)` | `string` | Runs the tree operation. |
| `tui.barChart(data: array, width: any, showLabels: any)` | `string` | Runs the bar chart operation. |
| `tui.width()` | `number` | Runs the width operation. |
| `tui.height()` | `number` | Runs the height operation. |
| `tui.size()` | `array` | Returns terminal width and height as [width, height]. |
| `tui.newScreen()` | `*Screen` | Runs the new screen operation. |
| `tui.readKey()` | `string` | Reads one key, preserving buffered keys from fast typing or pasted input for later calls. |
| `tui.keyPressed()` | `boolean` | Runs the key pressed operation. |
| `tui.interactiveSelect(prompt: any, options: array)` | `any` | Runs the interactive select operation. |

### `Screen` values

Methods available on `Screen` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.Set(x: any, y: any, text: string)` | `void` | Runs the set operation. |
| `value.Clear()` | `void` | Runs the clear operation. |
| `value.Render()` | `void` | Runs the render operation. |
| `value.WriteCenter(y: any, text: string)` | `void` | Writes center. |

## Notes

- Standard-library imports accept both `import "osl/tui"` and `import "tui"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Plain and coloured tables share one row renderer, including visible-width padding.
Dimension defaults and status aliases use shared lookup paths. Negative progress
clamps to zero. Non-interactive terminals and invalid
dimensions do not panic; interactive helpers still require a real TTY.

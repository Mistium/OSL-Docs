# tui

> Text User Interface utilities

```javascript
import "osl/tui"
```

## Methods

- `tui.clear()`
- `tui.clearLine()`
- `tui.clearLines(count)`
- `tui.moveCursor(x, y)`
- `tui.moveUp(n)`
- `tui.moveDown(n)`
- `tui.moveRight(n)`
- `tui.moveLeft(n)`
- `tui.saveCursor()`
- `tui.restoreCursor()`
- `tui.hideCursor()`
- `tui.showCursor()`
- `tui.color(colorName, text)` → `string`
- `tui.bgColor(colorName, text)` → `string`
- `tui.style(styleName, text)` → `string`
- `tui.rgbColor(r, g, b, text)` → `string`
- `tui.rgbBg(r, g, b, text)` → `string`
- `tui.progress(current, total, width)` → `string`
- `tui.spinner(finished)` → `string`
- `tui.horizontal(width)` → `string`
- `tui.vertical(height)` → `array`
- `tui.box(title, content)` → `string`
- `tui.drawBox(x, y, width, height, title)`
- `tui.table(headers, rows)` → `string`
- `tui.tableColored(headers, rows, colorFn)` → `string`
- `tui.Select(prompt, options)` → `any`
- `tui.confirm(prompt)` → `boolean`
- `tui.menu(title, items)` → `any`
- `tui.input(prompt)` → `string`
- `tui.password(prompt)` → `string`
- `tui.center(text)` → `string`
- `tui.pad(text, width, align)` → `string`
- `tui.divider(char, width, title)` → `string`
- `tui.status(status, message)` → `string`
- `tui.frame(text, width)` → `string`
- `tui.grid(items, columns)` → `string`
- `tui.tree(items, prefix)` → `string`
- `tui.barChart(data, width, showLabels)` → `string`
- `tui.width()` → `number`
- `tui.height()` → `number`
- `tui.size()` → `array`
- `tui.newScreen()` → `Screen`
- `tui.readKey()` → `string`
- `tui.keyPressed()` → `boolean`
- `tui.interactiveSelect(prompt, options)` → `any`

## Returned object: `Screen`

Returned by `tui` methods; call these on the value you get back.

- `screen.Set(x, y, text)`
- `screen.Clear()`
- `screen.Render()`
- `screen.WriteCenter(y, text)`

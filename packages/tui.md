# tui

Use `tui` for terminal output and input: colors and styles, cursor movement, boxes, tables, charts,
prompts, menus, key presses, and a screen buffer for full-screen drawing.

```osl
import "std:tui"
```

## Example

```osl
import "std:tui"

log tui.status("ok", "Build finished")
log tui.color("#ff8800", "warning:") ++ " " ++ tui.style("bold", "disk almost full")
log tui.progress(42, 100, 20)
log tui.table(["Name", "Role"], [["Ada", "admin"], ["Lin", "dev"]])
log tui.box("Notes", "line one\nline two")
```

Text widths are measured in terminal columns, so wide characters such as CJK and emoji take two.

## API reference

### Text and color

| Function | Returns | Notes |
| --- | --- | --- |
| `tui.color(color, text: string)` | `string` | Text in a color: a name (`black`, `red`, `green`, `yellow`, `blue`, `magenta` or `purple`, `cyan`, `white`, `gray` or `grey`, each also with a `bright` prefix such as `"brightBlue"`; any case), or `"#rrggbb"` / `{r, g, b}` drawn in 24-bit color. |
| `tui.bgColor(color, text: string)` | `string` | Text on a background color, named as for `tui.color`. |
| `tui.style(name: string, text: string)` | `string` | `"bold"`, `"dim"`, `"underline"`, `"blink"`, `"reverse"` (or `"invert"`), `"hidden"`, or `"strikethrough"`. |
| `tui.status(status: string, message: string)` | `string` | `message` after a colored symbol: `"success"`/`"ok"`/`"done"` (✓), `"error"`/`"fail"`/`"failed"` (✗), `"warning"`/`"warn"` (⚠), `"info"` (ℹ), `"loading"`/`"pending"` (⏳); anything else gets `•`. |
| `tui.center(text: string, options?)` | `string` | Centres each line. Option: `width` (default the terminal width, or 80 when output isn't a terminal). |
| `tui.pad(text: string, width: int, align: string)` | `string` | Pads to `width` columns, aligned `"left"` (or `""`), `"right"`, or `"center"`. |
| `tui.write(value)` | `void` | Prints without a newline. |

### Drawing

| Function | Returns | Notes |
| --- | --- | --- |
| `tui.progress(current: number, total: number, width: int)` | `string` | A bar such as `[█████░░░░░] 50%`. `current` is clamped to 0..total; a total of 0 or less shows 0%. |
| `tui.spinner(finished: boolean)` | `string` | The current spinner frame (it changes every 100 ms), or `✓` when finished. Print it over itself to animate. |
| `tui.horizontal(width: int)` | `string` | A `───` line. 0 or less gives 80. |
| `tui.vertical(height: int)` | `string[]` | `height` copies of `│`. 0 or less gives 10. |
| `tui.divider(char: string, width: int, title: string)` | `string` | A line of `char` (`""` means `─`) with `title` centred in it. A width of 0 or less means 80. |
| `tui.box(title: string, content: string)` | `string` | `content` in a box with `title` in the top border. |
| `tui.frame(text: string, width: int)` | `string` | `text` in a double-line frame at least `width` columns wide inside. |
| `tui.table(headers: array, rows: array, options?)` | `string` | A table drawn with `+`, `-`, and `\|`, each column as wide as its widest cell. Option: `cellColor`, a function called with each body cell that returns its color as for `tui.color`; it also turns on cyan borders and bold headers. |
| `tui.grid(items: array, columns: int)` | `string` | Items in `columns` columns (2 when 0 or less). |
| `tui.tree(items: array, prefix: string)` | `string` | A tree with `├──` and `└──`. An item is a value, or `{name, children}`. |
| `tui.barChart(data: array, width: int, colored: boolean)` | `string` | A horizontal bar chart of `{label, value}` objects or `[label, value]` arrays. |
| `tui.drawPanel(rect: object, options?)` | `void` | Draws a box filling `{x, y, width, height}` in terminal cells and blanks its inside. The cursor stays put. Option: `title`. |

```osl
import "std:tui"

log tui.table(["Service", "State"], [["api", "up"], ["db", "down"]], {cellColor: def(any cell) -> (
  if cell == "down" ( return "red" )
  return "green"
)})
log tui.tree([{name: "src", children: ["main.osl", "util.osl"]}, "README"], "")
log tui.barChart([{label: "mon", value: 3}, {label: "tue", value: 7}], 30, true)
```

### Cursor and screen

Positions count from 0 at the top-left corner.

| Function | Notes |
| --- | --- |
| `tui.clear()` | Clears the terminal and moves the cursor home. |
| `tui.clearLine()` | Clears the cursor's line. |
| `tui.clearLines(count: int)` | Clears the `count` lines above the cursor, such as the last lines printed, and leaves the cursor at the first of them. |
| `tui.moveTo(x: int, y: int)` | Moves to column `x`, row `y`. |
| `tui.moveUp(n)`, `moveDown(n)`, `moveLeft(n)`, `moveRight(n)` | Relative moves. |
| `tui.saveCursor()`, `tui.restoreCursor()` | |
| `tui.hideCursor()`, `tui.showCursor()` | |
| `tui.width()`, `tui.height()` | The terminal size, or 80 x 24 when output isn't a terminal. |

`tui.newScreen(options?)` returns a `*tui.Screen` buffer the size of the terminal (options `width`
and `height` set another size). Draw into it and show it in one write:

| Method | Notes |
| --- | --- |
| `screen.set(x: int, y: int, text: string)` | Writes text from column `x` of row `y`, one character per cell. Parts outside the screen are cut off. |
| `screen.writeCenter(y: int, text: string)` | Writes text centred on row `y`. |
| `screen.clear()` | Blanks every cell. |
| `screen.render()` | Draws the whole buffer from the top-left corner. |
| `screen.width()`, `screen.height()` | Size in cells. |

### Input

| Function | Returns | Notes |
| --- | --- | --- |
| `tui.input(prompt: string)` | `result<string, error>` | The line typed, trimmed. |
| `tui.confirm(prompt: string)` | `result<boolean, error>` | Asks `prompt? [y/N]:`. `y`/`yes` is `true`; `n`/`no`/empty is `false`; anything else asks again. |
| `tui.password(prompt: string)` | `result<string, error>` | Reads a line without echoing it when input is a terminal. |
| `tui.choose(prompt: string, choices: string[])` | `result<string?, error>` | A menu moved with the arrow or number keys, picked with Enter, cancelled (`null`) with Esc or Ctrl+C. When input is piped it lists numbered choices and reads a number; 0 cancels. |
| `tui.readKey()` | `result<string, error>` | Waits for one key: a character (`" "` for space), `"enter"`, `"tab"`, `"backspace"`, `"escape"`, arrows, `"home"`, `"end"`, `"insert"`, `"delete"`, `"pageup"`, `"pagedown"`, `"f1"`-`"f12"`, `"ctrl+a"`-`"ctrl+z"` (Ctrl+C is a key, not an interrupt), modified keys such as `"ctrl+up"`, `"shift+tab"`, `"alt+x"`, or `"unknown"`. |
| `tui.keyPressed()` | `boolean` | Whether a key press is waiting for `readKey`, without waiting. |

The input functions fail with `IOError` when standard input closes first.

```osl
import "std:tui"

string? pick = tui.choose("Deploy to", ["staging", "production"])
if pick == null (
  log "cancelled"
) else (
  if tui.confirm("Deploy to " ++ pick) ( log "deploying to " ++ pick )
)
```

## Errors

| Function | Kind | When |
| --- | --- | --- |
| `input`, `confirm`, `password`, `choose`, `readKey` | `IOError` | Standard input closed first. |
| `keyPressed` | `UnsupportedError` (thrown) | Terminals that can't be checked without waiting (Windows consoles). |
| `choose` | `ValueError` (thrown) | `choices` is empty. |
| `color`, `bgColor`, `style`, `pad`, `divider` | `ValueError` (thrown) | An unknown name, color, style, alignment, or a `char` that isn't one column wide. |
| cursor and drawing functions | `ValueError` (thrown) | A negative position, count, or width; a panel smaller than 2 x 2. |
| `table`, `barChart` | `TypeError` (thrown) | A row that isn't an array, or a chart item of the wrong shape. |

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning.

| Deprecated | Use instead |
| --- | --- |
| `tui.moveCursor(x, y)` (counted from 1) | `tui.moveTo(x, y)` (counts from 0) |
| `tui.rgbColor(r, g, b, text)` | `tui.color({r: r, g: g, b: b}, text)` or `tui.color("#rrggbb", text)` |
| `tui.rgbBg(r, g, b, text)` | `tui.bgColor({r: r, g: g, b: b}, text)` or `tui.bgColor("#rrggbb", text)` |
| `tui.tableColored(headers, rows, colorFn)` | `tui.table(headers, rows, {cellColor: colorFn})` |
| `tui.select(prompt, options)`, `tui.menu(title, items)`, `tui.interactiveSelect(prompt, options)` | `tui.choose(prompt, choices)`, which returns `null` when the user cancels |
| `tui.drawBox(x, y, width, height, title)` | `tui.drawPanel({x, y, width, height}, {title})` |
| `tui.size()` | `tui.width()` and `tui.height()` |

`tui.center` now centres in the terminal's width; pass `{width: 80}` for the old fixed width.

---
description: Build terminal output as strings (tables, boxes, bars, trees), colour and style text, and read keys and answers from the user.
package: tui
---

# tui

`tui` is for programs that live in a terminal. It has two halves. The first half returns plain strings you can print or test: tables, boxes, progress bars, bar charts, trees, dividers and padded text. The second half talks to a real terminal: colours, prompts, single key presses, cursor movement and a redrawable screen.

Reach for the string builders in any command-line tool that prints results. Reach for prompts and screens when the program is interactive.

```osl fragment
import "std:tui"
```

The first sections build strings, so they run here with their output shown. Colour codes are left out of the recorded output on this page. Prompts and screens need a real terminal, so those examples are compiled but not run.

## Tables

`tui.table(headers, rows)` draws a table. Each column is as wide as its widest cell.

```osl
import "std:tui"

auto headers = ["Name", "Language", "Stars"]
auto rows = [
  ["osl", "Go", 120],
  ["compiler", "OSL", 48],
  ["docs", "Markdown", 7]
]
log tui.table(headers, rows)
```

```output
+----------+----------+-------+
| Name     | Language | Stars |
+----------+----------+-------+
| osl      | Go       | 120   |
| compiler | OSL      | 48    |
| docs     | Markdown | 7     |
+----------+----------+-------+
```

Cells can be any value, and cells beyond the last header are left out. A row that isn't an array is a `TypeError`.

Try it: add a fourth column to the headers and a value to each row.

## Pad and align text

`tui.pad(text, width, align)` makes text a fixed width, aligned `"left"`, `"right"` or `"center"`. It is the right tool for columns you lay out yourself, such as a receipt.

```osl
import "std:tui"

for item in [["tea", "2.50"], ["coffee", "3.10"], ["cake", "12.00"]] (
  log tui.pad(item[1], 10, "left") ++ tui.pad(item[2], 8, "right")
)
log "[" ++ tui.pad("mid", 9, "center") ++ "]"
```

```output
tea           2.50
coffee        3.10
cake         12.00
[   mid   ]
```

## Progress and bar charts

`tui.progress(current, total, width)` returns a progress bar string, and `tui.barChart(data, width, colored)` a horizontal chart whose items are `[label, value]` arrays or `{label, value}` objects. The largest value fills the width.

```osl
import "std:tui"

log tui.progress(0, 100, 20)
log tui.progress(35, 100, 20)
log tui.progress(100, 100, 20)

log tui.barChart([["mon", 3], ["tue", 8], ["wed", 5]], 24, false)
```

```output
[░░░░░░░░░░░░░░░░░░░░] 0%
[███████░░░░░░░░░░░░░] 35%
[████████████████████] 100%
████████████████████████
mon             █████████ 3.00
tue             ████████████████████████ 8.00
wed             ███████████████ 5.00
```

Try it: change the second chart value to 20 and watch the bars rescale.

## Boxes, frames and dividers

`tui.box(title, content)` draws a box around text, and `tui.frame(text, width)` a double-line frame at least `width` columns wide. `tui.divider(char, width, title)` and `tui.horizontal(width)` draw rules.

```osl
import "std:tui"

log tui.box("Status", "all systems go\nuptime: 3 days")
log tui.frame("Welcome", 20)
log tui.divider("=", 30, "Section")
log tui.divider("", 12, "")
log tui.horizontal(8)
```

```output
┌─ Status ───────┐
│ all systems go │
│ uptime: 3 days │
└────────────────┘
╔════════════════════╗
║ Welcome            ║
╚════════════════════╝
========== Section ===========
────────────
────────
```

## Trees and grids

`tui.tree(items, prefix)` draws nested items with connectors. An item is a value, or an object with a `name` and `children`. `tui.grid(items, columns)` lays items out in equal columns.

```osl
import "std:tui"

auto files = [
  "README.md",
  {name: "src", children: ["main.osl", {name: "util", children: ["strings.osl"]}]},
  "osl.json"
]
log tui.tree(files, "")
log tui.grid(["a", "bb", "ccc", "d", "e"], 3)
```

```output
├── README.md
├── src
│   ├── main.osl
│   └── util
│       └── strings.osl
└── osl.json
│ a   │ bb  │ ccc 
│ d   │ e
```

## Centre text

`tui.center(text, options)` adds spaces to centre each line. Without a width it uses the terminal's, or 80 when output isn't a terminal. Pass `width` to be exact.

```osl
import "std:tui"

log "[" ++ tui.center("title", {width: 15}) ++ "]"
log tui.width() tui.height()
```

```output
[     title]
80 24
```

## Status lines

`tui.status(kind, message)` puts a symbol in front of a message: `success`, `error`, `warning`, `info` or `loading`. Anything else gets a plain bullet.

```osl
import "std:tui"

log tui.status("success", "build finished")
log tui.status("error", "3 tests failed")
log tui.status("warn", "disk almost full")
log tui.status("info", "using cache")
log tui.status("custom", "something else")
```

```output
✓ build finished
✗ 3 tests failed
⚠ disk almost full
ℹ using cache
• something else
```

## Colour and style

`tui.color(color, text)` colours text with a name (`red`, `green`, `brightBlue`, `grey`...), a hex string or an `{r, g, b}` object. `tui.bgColor` sets the background and `tui.style` applies `bold`, `dim`, `underline`, `reverse`, `strikethrough` and others. They return strings you can join. An unknown name is a `ValueError`.

The recorded output on this page strips the codes, so the text looks plain here, but it appears coloured in a terminal.

```osl
import "std:tui"

log tui.color("red", "error:") tui.style("bold", "disk full")
log tui.color("#ff8800", "orange") tui.bgColor("blue", " on blue ")
log tui.color({r: 10, g: 200, b: 120}, "rgb")
log tui.style("underline", tui.color("cyan", "link"))
```

```output
error: disk full
orange  on blue 
rgb
link
```

Pass `cellColor` to `table` to colour each cell by its value:

```osl
import "std:tui"

log tui.table(["test", "result"], [["parse", "pass"], ["render", "fail"]], {
  cellColor: def(any cell) string (
    if cell == "fail" return "red"
    return "green"
  )
})
```

```output
+--------+--------+
| test   | result |
+--------+--------+
| parse  | pass   |
| render | fail   |
+--------+--------+
```

Try it: use `"brightBlue"` or `{r: 255, g: 0, b: 128}`.

## Ask the user

Prompts print a question and wait. They are results, because standard input may be closed (`IOError`). They read from the terminal, so these examples are compiled but not run here.

```osl norun
import "std:tui"

string name = tui.input("Your name: ").unwrapOr("stranger")
bool ok = tui.confirm("Create " ++ name ++ "'s folder").unwrapOr(false)
string secret = tui.password("Token: ").unwrap()
log ok secret.len
string? pick = tui.choose("Pick a colour", ["red", "green", "blue"]).unwrap()
if pick == null ( log "cancelled" ) else ( log "chose" pick )
```

`confirm` adds `[y/N]` and treats an empty line as no. `choose` shows a menu moved with the arrow keys, and returns `null` when the user cancels with Esc. When input is piped instead of typed, the same functions read plain lines, so scripts can feed them.

## Read single keys

`tui.readKey()` waits for one key press and returns its name: `"a"`, `"enter"`, `"up"`, `"ctrl+c"`, `"f5"` and so on. `tui.keyPressed()` checks without waiting, so you can keep animating while you wait for input.

```osl norun
import "std:tui"

tui.hideCursor()
log "Press q to quit, or any other key."
while true (
  string key = tui.readKey().unwrap()
  if key == "q" break
  log "you pressed" key
)
tui.showCursor()
```

> [!note]
> In key mode Ctrl+C is read as a key, not as an interrupt, so always give the user a key that quits.

## Cursor movement and spinners

`moveTo(x, y)` jumps to a cell (1, 1 is the top-left corner), and `moveUp`, `moveDown`, `moveLeft`, `moveRight`, `saveCursor`, `restoreCursor`, `clearLine` and `clearLines` redraw part of the output in place. `spinner` returns the frame to show, which changes every 100 milliseconds.

```osl norun
import "std:tui"
import "std:thread"

for i in 1 to 5 (
  tui.clearLine()
  tui.write("\r" ++ tui.spinner(false) ++ " working " ++ tui.progress(i, 5, 10))
  thread.sleep(200)
)
tui.clearLine()
log tui.spinner(true) "done"
```

## Screens

For full-screen programs, `tui.newScreen()` returns a buffer the size of the terminal. Set cells, then call `render()` to draw everything in one write, which avoids flicker. `drawPanel` draws a titled box at a position.

```osl norun
import "std:tui"

auto screen = tui.newScreen()
tui.clear()
screen.writeCenter(2, "Dashboard")
screen.set(2, 4, "CPU  " ++ tui.progress(42, 100, 20))
screen.set(2, 5, "Disk " ++ tui.progress(87, 100, 20))
screen.render()
tui.drawPanel({x: 2, y: 8, width: 30, height: 5}, {title: "Log"})
tui.moveTo(1, screen.height())
```

A screen created with `{width: 40, height: 10}` has that size instead, which is also how you can test your layout code without a terminal.

```osl
import "std:tui"

auto s = tui.newScreen({width: 40, height: 10})
s.set(1, 1, "hello")
s.writeCenter(3, "centred")
log s.width() s.height()
```

```output
40 10
```

:::quiz
What does `tui.table(headers, rows)` return?

- [ ] Nothing: it prints the table.
- [x] A string you print or test.
- [ ] A `Screen`.

The string builders return text, so you can log it, test it or save it.
:::

:::exercise title="A tiny report"
Print a table with the headers `Task` and `Done` and two rows, then a progress bar showing 1 of 2 done, 10 wide.

```osl
import "std:tui"

log tui.progress(0, 2, 10)
```

```output
+-------+------+
| Task  | Done |
+-------+------+
| write | yes  |
| test  | no   |
+-------+------+
[█████░░░░░] 50%
```

> [!hint]
> `tui.table(["Task", "Done"], [[...], [...]])`

> [!hint]
> `tui.progress(1, 2, 10)`

```osl solution
import "std:tui"

log tui.table(["Task", "Done"], [["write", "yes"], ["test", "no"]])
log tui.progress(1, 2, 10)
```

```output
+-------+------+
| Task  | Done |
+-------+------+
| write | yes  |
| test  | no   |
+-------+------+
[█████░░░░░] 50%
```
:::

## API reference

::api

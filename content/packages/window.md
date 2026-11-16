---
description: Open native windows that show std:ui interfaces, with menus, shortcuts, dialogs, the clipboard and screenshots.
package: window
---

# window

`std:window` opens a native window and draws a [ui](ui.md) view in it. You write the interface once, with tags and a class for its state, and the same code can run in a window or as a web page with [serve](serve.md).

Windows are drawn with SDL2, which has to be installed where the program is built and run (`libSDL2` on Linux, `sdl2` from Homebrew on macOS, `SDL2.dll` beside the program on Windows). A window needs a display, so the examples on this page compile but don't run in the browser. Run them on your own machine.

## Your first window

A counter. The class holds the state, `view()` returns the interface, and `show` gives it to a window. `window.run()` keeps the window drawn until it is closed:

```osl norun
import "std:ui"
import "std:window"

class Counter (
  int count = 0

  def add() (
    self.count += 1
  )

  def view() ui.node (
    return <column pad=24 gap=12 align=center>
      <text size=28 weight=bold>${self.count}</text>
      <button on:click=self.add>Add one</button>
    </column>
  )
)

*window.Window main = window.create({title: "Counter", width: 300, height: 200}).unwrap()
main.show(def() -> Counter())
window.run()
```

Click the button, and the number changes. Make the window 600 by 400, change the title, then run it again.

## What you can show

`show` takes the same targets as `app.UI` in serve, and the type decides how it behaves:

- A function returning a `ui.node` is a view, drawn again after every action.
- A function returning an object with `view()` is a factory. It is called once for this window, so every window gets its own state.
- An object is shared with everything else it is given to, other windows and web pages included.

```osl norun
import "std:ui"
import "std:window"

class Note (
  string text = ""
  def view() ui.node (
    return <input bind=self.text placeholder="Write here"/>
  )
)

Note shared = Note()
*window.Window a = window.create({title: "A", width: 300, height: 120}).unwrap()
*window.Window b = window.create({title: "B", width: 300, height: 120}).unwrap()
a.show(shared)
b.show(shared)
window.run()
```

Type in one window and the other follows. Swap `shared` for `def() -> Note()` in both calls and they stop sharing.

:::quiz
You pass `def() -> Counter()` to `show` for two windows. What do they share?

- [ ] The same `Counter`, so the count is shared.
- [x] Nothing: each window gets its own `Counter`.
- [ ] The count, but not the labels.

A function that returns a component is a factory, called once per window. Pass the object itself to share.
:::

## Window options

`window.create` takes `title`, `width` and `height` (800 by 600), `x` and `y` (centred if left out), `resizable`, `borderless`, `fullscreen`, `hidden`, `alwaysOnTop`, `minWidth` and `minHeight`. It returns a result, because there may be no display. Positions count from 1, like everything in OSL.

```osl norun
import "std:window"

auto made = window.create({title: "Tool", width: 400, height: 300, alwaysOnTop: true})
if made.isErr() (
  log "no window: " ++ made.unwrapErr().message
  exit 1
)

*window.Window tool = made.unwrap()
tool.move(1, 1)
log tool.size() tool.bounds() tool.scale()
```

`size()` is in units and `scale()` says how many pixels a unit is (2 on a high-density screen). `title()`, `setTitle`, `resize`, `center`, `maximize`, `minimize`, `restore`, `setFullscreen`, `hide`, `unhide` and `close` do what they say.

## Keys and menus

`w.key("mod+s", fn)` runs a function when the combination is pressed, `mod` being Cmd on macOS and Ctrl elsewhere. `w.menu(items)` draws a menu bar at the top of the window. Items can name the same shortcut:

```osl norun
import "std:ui"
import "std:window"

class Editor (
  string text = ""
  string status = "Ready"

  def save() ( self.status = "Saved " ++ self.text.len ++ " characters" )
  def clear() ( self.text = "" )

  def view() ui.node (
    return <column pad=12 gap=8 width=fill>
      <input bind=self.text width=fill/>
      <text>${self.status}</text>
    </column>
  )
)

Editor editor = Editor()
*window.Window w = window.create({title: "Editor"}).unwrap()
w.show(editor)
w.key("mod+s", editor.save)
w.menu([
  {label: "File", items: [
    {label: "Save", action: editor.save, keys: "mod+s"},
    {separator: true},
    {label: "Clear", action: editor.clear}
  ]}
])
window.run()
```

An action runs like a button's `on:click`, so the window updates afterwards. SDL2 has no native menu bars, so this one is drawn inside the window and looks the same on every system.

## Asking the user

`w.ask(message, buttons)` shows a native dialog and returns the label of the button pressed (or `""` if it was closed). `openFile`, `saveFile` and `pickFolder` return a path, or `null` when the user cancels. All of them return a result, because a machine may have no dialog program:

```osl norun
import "std:window"

*window.Window w = window.create({title: "Dialogs", width: 300, height: 100}).unwrap()

string answer = w.ask("Discard your changes?", ["Discard", "Keep"]).unwrap()
log "you chose " ++ answer

string? path = w.openFile({types: ["png", "jpg"]}).unwrap()
if path != null (
  log "opening " ++ path
)
```

## Closing

`window.run()` returns when the last window closes. To stop a window closing, give it an `onClose` handler that returns `false`:

```osl norun
import "std:window"

*window.Window w = window.create({title: "Unsaved"}).unwrap()
bool dirty = true

w.onClose(def() boolean (
  if dirty (
    return w.ask("Quit without saving?", ["Quit", "Stay"]).unwrap() == "Quit"
  )
  return true
))
window.run()
```

## Your own loop

A game or a visualisation wants a frame loop of its own. Call `window.update()` once per frame instead of `run()`. It draws the windows, handles the events, waits for the next frame, and returns the milliseconds that passed:

```osl norun
import "std:ui"
import "std:window"

class Clock (
  number seconds = 0
  def view() ui.node -> <text size=40>${round(self.seconds, 1)}</text>
)

Clock clock = Clock()
*window.Window w = window.create({title: "Clock", width: 200, height: 100}).unwrap()
w.show(clock)

while w.isOpen() (
  clock.seconds += window.update() / 1000
  if w.held("space") ( clock.seconds = 0 )
)
```

`w.held(name)` says whether a key or `"mouseLeft"` is down now.

## Screenshots and the clipboard

`w.screenshot(path)` saves what the window shows as a PNG, at its full pixel size, which is how to take pictures for documentation. `window.clipboard()` and `window.setClipboard(text)` read and write the system clipboard:

```osl norun
import "std:window"

*window.Window w = window.create({title: "Shot", width: 200, height: 100}).unwrap()
window.update()
w.screenshot("shot.png").unwrap()
window.setClipboard("copied").unwrap()
log window.clipboard()
```

:::exercise title="A greeting window"
Make a window titled "Greeter" with a text input and a line that says `Hello, ` followed by what was typed. This page can't open a window, so the starter prints the greeting the component would show. Make it print `Hello, Ada`.

```osl
import "std:ui"

class Greeter (
  string name = ""

  def view() ui.node (
    return <column pad=12 gap=8>
      <input bind=self.name/>
      <text>Hello, ${self.name}</text>
    </column>
  )
)

Greeter g = Greeter()
log "Hello, " ++ g.name
```

```output
Hello, Ada
```

> [!hint]
> A class component keeps its state in fields. Set `g.name` before you print.

> [!hint]
> In a real program, add `import "std:window"`, call `window.create(...)`, then `show(g)` and `window.run()`.

```osl solution
import "std:ui"

class Greeter (
  string name = ""

  def view() ui.node (
    return <column pad=12 gap=8>
      <input bind=self.name/>
      <text>Hello, ${self.name}</text>
    </column>
  )
)

Greeter g = Greeter()
g.name = "Ada"
log "Hello, " ++ g.name
```
:::

:::exercise title="A window title helper"
Windows are named with `title`. Write `def titleFor(string file) string` that returns `"Editor - " ++ file`, or `"Editor"` when the file name is empty. Print both.

```osl
def titleFor(string file) string -> "?"

log titleFor("notes.txt")
log titleFor("")
```

```output
Editor - notes.txt
Editor
```

> [!hint]
> `if file == "" return "Editor"` then return the longer text.

```osl solution
def titleFor(string file) string (
  if file == "" return "Editor"
  return "Editor - " ++ file
)

log titleFor("notes.txt")
log titleFor("")
```

```output
Editor - notes.txt
Editor
```
:::

## API reference

::api

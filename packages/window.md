# window

The `window` package brings OSL's original graphical model to compiled programs: you open a real
desktop window and draw into it every frame using OSL's **rendering commands** (the "draw cursor",
shapes, text, icons and 3D). This is the same drawing model that powered originOS apps.

> **Migration:** renderer plumbing such as `batch*`, `icn*`, `drawIconCached`, and
> `executeIconCommands` is now internal. Use the stable drawing commands and methods such as
> `line`, `rect`, `window.Icon`, and `window.Text`.

```osl
import "std:window"
```

## Program structure

A windowed program has two parts:

1. **Setup** - top-level statements that run once. Configure the window and load assets here.
2. **The main loop** - everything after the `mainloop:` label runs **once per frame**. This is where
   you read input and draw.

```osl
import "std:window"

window.setTitle("Hello OSL")
window.setColor("#ffffff")
window.show()
window.resize(800, 450)

number x = 0

mainloop:

x += 1
goto x window.top - 40
centext "hello world" 10 : c#000
```

`mainloop:` is a bare label - it has no parentheses and no body brackets. Everything below it is the
per-frame loop, and it keeps running until the window closes.

## Window properties & methods

Read the window's size and edges as **properties** (no parentheses):

```osl
window.width      window.height
window.left       window.right
window.top        window.bottom
```

Control the window with **methods**:

| Method | Purpose |
| --- | --- |
| `window.setTitle(title)` | Set the title bar text. |
| `window.setColor(hex)` | Set the background colour. |
| `window.show()` / `window.hide()` | Show or hide the window. |
| `window.resize(w, h)` | Resize the window. |
| `window.setResizable(bool)` | Allow or block user resizing. |
| `window.fullscreen()` / `window.isFullscreen()` | Toggle / query fullscreen. |
| `window.minimise()` | Minimise. |
| `window.close()` | Close the window and stop the program. |
| `window.on(event, handler)` | Listen for window events. |

## Drawing

Inside the loop you draw with **rendering commands**. They operate on a moving "draw cursor":

```osl
goto x y                 // move the draw cursor
change_x n   change_y n  // move it relatively
c "#ff0000"              // set the draw colour
icon iconString size     // draw an ICN icon
image url w h            // draw an image
text "hello" 10          // draw text from the cursor
centext "hello" 10       // draw text centred on the cursor
```

Many commands accept an inline modifier after a colon - for example `: c#000` sets the colour just
for that element:

```osl
centext "Score: " ++ score 10 : c#000
```

The rendering commands, modifiers, clipping operations, and input globals are documented on this page because they are part of `std:window`, not the core language.

## Input

Keyboard keys are queried by name:

```osl
if "space".isKeyDown() (
  jump = true
)
move_left  = "a".isKeyDown()
move_right = "d".isKeyDown()
```

The window package also exposes per-frame **global variables** you can read directly in the loop:

| Global | Meaning |
| --- | --- |
| `mouse_x`, `mouse_y` | Mouse position. |
| `x_position`, `y_position` | The current draw-cursor position. |
| `direction` | The draw cursor's heading (for `pen`/turtle drawing). |
| `timer` | A steadily increasing timer, handy for timing events. |

## A complete example

```osl
import "std:window"

object player = { x: 0, y: 0 }

window.setColor("#fff")
window.setTitle("Move me")
window.show()
window.resize(800, 450)

mainloop:

if "a".isKeyDown() (
  player.x -= 4
)
if "d".isKeyDown() (
  player.x += 4
)
if "w".isKeyDown() (
  player.y += 4
)
if "s".isKeyDown() (
  player.y -= 4
)

goto player.x.toNum() player.y.toNum()
icon "c #000 square 0 0 20 20" 2

goto 0 window.top - 30
centext "use WASD" 10 : c#000
```

## Companion packages

- [`win-buttons`](../packages/README.md) - add clickable buttons to a window (`import "std:win-buttons"`).
- [`sound`](sound.md) - play audio in a windowed app.

> **Heads-up:** the `window` package depends on native graphics libraries, so the first compile pulls
> in extra dependencies. Server and CLI programs don't need any of this.

## Complete API reference

### `window`

| Method | Returns | Notes |
| --- | --- | --- |
| `window.on(name: any, callback: any)` | `void` |  |
| `window.emit(name: any, ...args: any)` | `void` |  |
| `window.show()` | `void` |  |
| `window.Create()` | `void` |  |
| `window.Goto(x: any, y: any)` | `void` |  |
| `window.hide()` | `void` |  |
| `window.resize(width: any, height: any)` | `void` |  |
| `window.close()` | `void` | Closes the resource. |
| `window.minimise()` | `void` | Minimizes the current native window. |
| `window.fullscreen()` | `void` | Toggles fullscreen on the current native window. |
| `window.isFullscreen()` | `boolean` | Reports whether the current native window is fullscreen. |
| `window.color()` | `string` |  |
| `window.setColor(col: any)` | `void` | Sets color. |
| `window.setTitle(title: any)` | `void` | Sets title. |
| `window.keyPressed(key: string)` | `boolean` |  |
| `window.setResizable(resizable: boolean)` | `void` | Sets resizable. |
| `window.setDragbox(box: any)` | `void` | Sets dragbox. |
| `window.dragbox()` | `array` |  |

### `Window` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.Run(loop: function)` | `void` | Runs the window loop callback until the window closes. |
| `value.width()` | `number` |  |
| `value.height()` | `number` |  |
| `value.left()` | `number` |  |
| `value.right()` | `number` |  |
| `value.top()` | `number` |  |
| `value.bottom()` | `number` |  |
| `value.SetTitle(title: string)` | `void` | Sets title. |
| `value.resize(width: any, height: any)` | `void` |  |
| `value.setResizable(resizable: boolean)` | `void` | Sets resizable. |
| `value.Clear(col: color.Color)` | `void` |  |
| `value.Update()` | `void` |  |
| `value.KeyPressed(key: string)` | `boolean` |  |

### `winRender` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.Hex(hex: any)` | `color.RGBA` |  |
| `value.Color(col: any)` | `void` |  |
| `value.Goto(x: any, y: any)` | `void` |  |
| `value.Loc(a: any, b: any, c: any, d: any)` | `void` |  |
| `value.toScreen(x: number, y: number)` | `pixel.Vec` | Converts to screen. |
| `value.drawColor()` | `color.Color` |  |
| `value.Effect(name: any, value: any)` | `void` | Sets an effect; transparency is clamped when rendered. |
| `value.penSize()` | `number` |  |
| `value.beginElement()` | `void` |  |
| `value.updateLast(minX: number, minY: number, maxX: number, maxY: number)` | `void` |  |
| `value.checkClick()` | `void` |  |
| `value.LineTo(endX: number, endY: number)` | `void` |  |
| `value.Rect(...args: any)` | `void` |  |
| `value.Icon(icon: any, size: number)` | `void` |  |
| `value.Text(text: string, size: any)` | `void` |  |
| `value.Centext(text: string, size: any)` | `void` |  |
| `value.SetThickness(thickness: number)` | `void` | Sets thickness. |
| `value.Change(offsetX: number, offsetY: number)` | `void` |  |
| `value.Direction(dirFloat: number)` | `void` |  |
| `value.Turnright(angle: number)` | `void` |  |
| `value.Turnleft(angle: number)` | `void` |  |
| `value.Pointat(x: number, y: number)` | `void` |  |
| `value.Image(key: string, w: any, h: any)` | `void` |  |
| `window.off(name: any, callback: any)` | `boolean` | Removes one event callback without disturbing other listeners. |

## Notes

- Prefer `import "std:window"`; the older `import "osl/window"` spelling remains supported.

## Behavior and limits

Empty colors and invalid image data return failure values instead of panicking. PNG and JPEG data
use Go's image decoders. A failed asynchronous image load releases its queue slot. Icon commands
split on whitespace and reject operations with the wrong number of numeric arguments.

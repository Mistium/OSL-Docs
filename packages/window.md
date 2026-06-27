# window

> Open a window and draw to it

The `window` package brings OSL's original graphical model to compiled programs: you open a real
desktop window and draw into it every frame using OSL's **rendering commands** (the "draw cursor",
shapes, text, icons and 3D). This is the same drawing model that powered originOS apps.

```javascript
import "osl/window"
```

## Program structure

A windowed program has two parts:

1. **Setup** — top-level statements that run once. Configure the window and load assets here.
2. **The main loop** — everything after the `mainloop:` label runs **once per frame**. This is where
   you read input and draw.

```javascript
import "osl/window"

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

`mainloop:` is a bare label — it has no parentheses and no body brackets. Everything below it is the
per-frame loop, and it keeps running until the window closes.

## Window properties & methods

Read the window's size and edges as **properties** (no parentheses):

```javascript
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

```javascript
goto x y                 // move the draw cursor
change_x n   change_y n  // move it relatively
c "#ff0000"              // set the draw colour
icon iconString size     // draw an ICN icon
image url w h            // draw an image
text "hello" 10          // draw text from the cursor
centext "hello" 10       // draw text centred on the cursor
```

Many commands accept an inline modifier after a colon — for example `: c#000` sets the colour just
for that element:

```javascript
centext "Score: " ++ score 10 : c#000
```

See the full reference: [Rendering basics](../commands/rendering/basics.md),
[Elements](../commands/rendering/elements/README.md),
[the ICN icon format](../commands/rendering/elements/icon.md),
[clipping & frames](../commands/rendering/clipping-and-scrolling-frames.md), and
[3D rendering](../commands/rendering/3d-rendering.md).

## Input

Keyboard keys are queried by name:

```javascript
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

```javascript
import "osl/window"

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

- [`win-buttons`](../packages/README.md) — add clickable buttons to a window (`import "osl/win-buttons"`).
- [`sound`](sound.md) — play audio in a windowed app.

> **Heads-up:** the `window` package depends on native graphics libraries, so the first compile pulls
> in extra dependencies. Server and CLI programs don't need any of this.

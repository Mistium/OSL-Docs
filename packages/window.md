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

1. **Setup** - top-level statements that run once. Configure the window and load assets here.
2. **The main loop** - everything after the `mainloop:` label runs **once per frame**. This is where
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

`mainloop:` is a bare label - it has no parentheses and no body brackets. Everything below it is the
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

Many commands accept an inline modifier after a colon - for example `: c#000` sets the colour just
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

- [`win-buttons`](../packages/README.md) - add clickable buttons to a window (`import "osl/win-buttons"`).
- [`sound`](sound.md) - play audio in a windowed app.

> **Heads-up:** the `window` package depends on native graphics libraries, so the first compile pulls
> in extra dependencies. Server and CLI programs don't need any of this.

## Complete API reference

### `window`

| Method | Returns | Description |
| --- | --- | --- |
| `window.on(name: any, callback: any)` | `void` | Runs the on operation. |
| `window.emit(name: any, ...args: any)` | `void` | Runs the emit operation. |
| `window.show()` | `void` | Runs the show operation. |
| `window.Create()` | `void` | Runs the create operation. |
| `window.Goto(x: any, y: any)` | `void` | Runs the goto operation. |
| `window.hide()` | `void` | Runs the hide operation. |
| `window.resize(width: any, height: any)` | `void` | Runs the resize operation. |
| `window.close()` | `void` | Closes the resource. |
| `window.minimise()` | `void` | Runs the minimise operation. |
| `window.fullscreen()` | `void` | Runs the fullscreen operation. |
| `window.isFullscreen()` | `boolean` | Reports whether fullscreen. |
| `window.color()` | `string` | Runs the color operation. |
| `window.setColor(col: any)` | `void` | Sets color. |
| `window.setTitle(title: any)` | `void` | Sets title. |
| `window.keyPressed(key: string)` | `boolean` | Runs the key pressed operation. |
| `window.setResizable(resizable: boolean)` | `void` | Sets resizable. |
| `window.setDragbox(box: any)` | `void` | Sets dragbox. |
| `window.dragbox()` | `array` | Runs the dragbox operation. |

### `Window` values

Methods available on `Window` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.Run(loop: function)` | `void` | Runs the window loop callback until the window closes. |
| `value.width()` | `number` | Runs the width operation. |
| `value.height()` | `number` | Runs the height operation. |
| `value.left()` | `number` | Runs the left operation. |
| `value.right()` | `number` | Runs the right operation. |
| `value.top()` | `number` | Runs the top operation. |
| `value.bottom()` | `number` | Runs the bottom operation. |
| `value.SetTitle(title: string)` | `void` | Sets title. |
| `value.resize(width: any, height: any)` | `void` | Runs the resize operation. |
| `value.setResizable(resizable: boolean)` | `void` | Sets resizable. |
| `value.Clear(col: color.Color)` | `void` | Runs the clear operation. |
| `value.Update()` | `void` | Runs the update operation. |
| `value.KeyPressed(key: string)` | `boolean` | Runs the key pressed operation. |

### `winRender` values

Methods available on `winRender` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.Hex(hex: any)` | `color.RGBA` | Runs the hex operation. |
| `value.Color(col: any)` | `void` | Runs the color operation. |
| `value.Goto(x: any, y: any)` | `void` | Runs the goto operation. |
| `value.Loc(a: any, b: any, c: any, d: any)` | `void` | Runs the loc operation. |
| `value.toScreen(x: number, y: number)` | `pixel.Vec` | Converts to screen. |
| `value.drawColor()` | `color.Color` | Runs the draw color operation. |
| `value.Effect(name: any, value: any)` | `void` | Runs the effect operation. |
| `value.penSize()` | `number` | Runs the pen size operation. |
| `value.beginElement()` | `void` | Runs the begin element operation. |
| `value.updateLast(minX: number, minY: number, maxX: number, maxY: number)` | `void` | Runs the update last operation. |
| `value.checkClick()` | `void` | Runs the check click operation. |
| `value.LineTo(endX: number, endY: number)` | `void` | Runs the line to operation. |
| `value.Rect(...args: any)` | `void` | Runs the rect operation. |
| `value.Icon(icon: any, size: number)` | `void` | Runs the icon operation. |
| `value.batchIcon(iconStr: string, size: number, offsetX: number, offsetY: number)` | `void` | Runs the batch icon operation. |
| `value.drawIconCached(iconStr: string, size: number, offsetX: number, offsetY: number)` | `void` | Runs the draw icon cached operation. |
| `value.executeIconCommands(cmds: array, size: number, offsetX: number, offsetY: number)` | `void` | Runs the execute icon commands operation. |
| `value.batchLine(startX: number, startY: number, endX: number, endY: number, thickness: number, col: color.Color)` | `void` | Runs the batch line operation. |
| `value.batchDot(cx: number, cy: number, thickness: number, col: color.Color)` | `void` | Runs the batch dot operation. |
| `value.batchSquare(cx: number, cy: number, hw: number, hh: number, thickness: number, col: color.Color)` | `void` | Runs the batch square operation. |
| `value.batchRect(cx: number, cy: number, w: number, h: number, col: color.Color)` | `void` | Runs the batch rect operation. |
| `value.batchTri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, col: color.Color)` | `void` | Runs the batch tri operation. |
| `value.batchCutcircle(cx: number, cy: number, radius: number, dir: number, arclen: number, thickness: number, col: color.Color)` | `void` | Runs the batch cutcircle operation. |
| `value.batchEllipse(cx: number, cy: number, w: number, mult: number, dir: number, thickness: number, col: color.Color)` | `void` | Runs the batch ellipse operation. |
| `value.icnDot(cx: number, cy: number)` | `void` | Runs the icn dot operation. |
| `value.icnSquare(cx: number, cy: number, hw: number, hh: number)` | `void` | Runs the icn square operation. |
| `value.icnRect(cx: number, cy: number, w: number, h: number)` | `void` | Runs the icn rect operation. |
| `value.icnTri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number)` | `void` | Runs the icn tri operation. |
| `value.icnCutcircle(cx: number, cy: number, radius: number, dir: number, arclen: number)` | `void` | Runs the icn cutcircle operation. |
| `value.icnEllipse(cx: number, cy: number, w: number, mult: number, dir: number)` | `void` | Runs the icn ellipse operation. |
| `value.Text(text: string, size: any)` | `void` | Runs the text operation. |
| `value.Centext(text: string, size: any)` | `void` | Runs the centext operation. |
| `value.SetThickness(thickness: number)` | `void` | Sets thickness. |
| `value.Change(offsetX: number, offsetY: number)` | `void` | Runs the change operation. |
| `value.Direction(dirFloat: number)` | `void` | Runs the direction operation. |
| `value.Turnright(angle: number)` | `void` | Runs the turnright operation. |
| `value.Turnleft(angle: number)` | `void` | Runs the turnleft operation. |
| `value.Pointat(x: number, y: number)` | `void` | Runs the pointat operation. |
| `value.Image(key: string, w: any, h: any)` | `void` | Runs the image operation. |

## Notes

- Standard-library imports accept both `import "osl/window"` and `import "window"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

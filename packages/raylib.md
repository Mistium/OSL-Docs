# raylib

> Native windowing, input, 2D drawing, collision helpers, and managed textures

`osl/raylib` wraps raylib-go with OSL values and a compact frame-loop API. It is for native desktop
builds. Use `osl compile` or `osl run`; browser builds intentionally reject this package.

```javascript
import "osl/raylib"

player = {x: 20}
raylib.run({width: 800, height: 450, title: "OSL raylib", fps: 60}, def(dt) -> (
  if raylib.keyDown("right") player.x += 200 * dt
), def() -> (
  raylib.clear("#181825")
  raylib.drawRectangle(player.x, 200, 40, 40, "#89b4fa")
  raylib.drawText("Move with the arrow keys", 20, 20, 24, "white")
))
```

## Values and window lifecycle

- `raylib.color(value)` accepts named colours, `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, arrays, or `{r, g, b, a}` objects.
- `raylib.vec(x, y)` and `raylib.rect(x, y, width, height)` create geometry objects.
- `initWindow(width, height, title)`, `closeWindow()`, `windowReady()`, and `windowShouldClose()` expose manual lifecycle control.
- `run(options, update, draw)` manages the window and frame loop.
- `setTargetFPS(fps)`, `fps()`, `frameTime()`, `time()`, `screenSize()`, `setWindowTitle(title)`, and `setWindowSize(width, height)` manage timing and the window.

## Drawing

Use `clear`, `drawPixel`, `drawLine`, `drawRectangle`, `drawRectangleLines`, `drawCircle`,
`drawCircleLines`, `drawTriangle`, `drawText`, and `measureText`. For manual loops,
`beginDrawing()`, `endDrawing()`, and `draw(fn)` are available.

## Input and collision

- Keyboard: `keyPressed`, `keyDown`, and `keyReleased`
- Mouse: `mousePosition`, `mousePressed`, `mouseDown`, `mouseReleased`, and `mouseWheel`
- Collision: `rectanglesCollide`, `circlesCollide`, and `pointInRectangle`

Key names include letters, arrows, space, escape, enter, modifiers, and F1 through F12.

## Textures

`raylib.loadTexture(path)` returns a texture with `valid()`, `width()`, `height()`,
`draw(x, y, rotation, scale, tint)`, and `unload()` methods.

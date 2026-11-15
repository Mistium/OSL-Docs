---
description: Draw 2D and 3D graphics and read the keyboard and mouse in a raylib window, and use its colour, geometry and image helpers without one.
package: raylib
---

# raylib

`std:raylib` is a window you draw into, once per frame: shapes, text, textures, 2D and 3D cameras, shaders, keyboard and mouse. It suits games, simulations and anything that moves. For forms and buttons, use [ui](ui.md) and [window](window.md) instead, or [raygui](raygui.md) for controls inside a raylib window.

Windows need SDL2 installed. Many helpers (colours, shapes for hit tests, cameras, image loading) work without a window, so the first examples run right here.

## Colours

Anything that takes a colour accepts a name, `"#rrggbb"`, `"#rgb"`, `"#rrggbbaa"` or `{r, g, b, a}`. `raylib.color` shows you what it understood:

```osl
import "std:raylib"

log raylib.color("raywhite")
log raylib.color("#f80")
log raylib.color({r: 1, g: 2, b: 3, a: 4})
```

```output
{"a":255,"b":245,"g":245,"r":245}
{"a":255,"b":0,"g":136,"r":255}
{"a":4,"b":3,"g":2,"r":1}
```

Try `"purple"` or `"#00ff0080"`. An unknown name throws a `ValueError`.

## Points and hit tests

`raylib.vec(x, y)` and `raylib.vec3(x, y, z)` build points. The `isPoint...` and `is...Overlapping` helpers answer the questions every game asks, with plain `{x, y, width, height}` rectangles and `{x, y, radius}` circles:

```osl
import "std:raylib"

auto button = {x: 1, y: 1, width: 100, height: 40}
log raylib.isPointInRect(raylib.vec(50, 20), button)
log raylib.isPointInRect(raylib.vec(150, 20), button)

auto a = {x: 1, y: 1, radius: 5}
auto b = {x: 4, y: 1, radius: 5}
log raylib.isCircleOverlapping(a, b)
log raylib.isRectOverlapping(button, {x: 90, y: 30, width: 20, height: 20})
```

```output
true
false
true
true
```

Positions count from 1, like everything in OSL, so `{x: 1, y: 1}` is the top-left pixel.

:::quiz
Which point is inside `{x: 1, y: 1, width: 10, height: 10}`?

- [ ] `{x: 0, y: 0}`
- [x] `{x: 5, y: 5}`
- [ ] `{x: 11, y: 11}`

The rectangle starts at pixel 1 and is 10 wide, so it covers 1 to 10.
:::

## Your first window

`raylib.initWindow` opens a window, `windowShouldClose()` becomes true when the user closes it (or presses Escape), and `raylib.draw(frame)` draws one frame. Window code can't run here, so it is marked as compile-only. Copy it to your machine:

```osl norun
import "std:raylib"

raylib.initWindow(800, 450, "Hello", {fps: 60}).unwrap()

while !raylib.windowShouldClose() (
  raylib.draw(def() (
    raylib.clear("#181825")
    raylib.text("Hello, World!", {x: 281, y: 201}, {size: 36, color: "#89b4fa"})
  ))
)

raylib.closeWindow()
```

Change the colours and the text. Everything on screen is drawn inside `raylib.draw`.

## The shorter loop

`raylib.runWindow(frame, options)` opens the window, calls `frame(ms)` every frame with the time the last frame took, and closes the window at the end. `background` clears for you, and `frames` stops after that many frames (handy for tests):

```osl norun
import "std:raylib"

number x = 20

raylib.runWindow(def(ms) (
  if raylib.isKeyDown("right") ( x += 0.3 * ms )
  if raylib.isKeyDown("left") ( x -= 0.3 * ms )
  raylib.rectangle({x: x, y: 200, width: 40, height: 40}, "#89b4fa")
  raylib.text("Arrow keys move the square", {x: 20, y: 20})
), {width: 800, height: 450, title: "Move", background: "#181825"})
```

Multiplying by `ms` makes the speed the same on a slow computer and a fast one. Here the square moves 300 pixels a second.

## Shapes and text

`rectangle`, `circle`, `line`, `polygon` and `pixel` take geometry and a colour. A `lineWidth` option draws only the outline, `radius` rounds a rectangle:

```osl norun
import "std:raylib"

raylib.runWindow(def(ms) (
  raylib.rectangle({x: 40, y: 40, width: 200, height: 100}, "#89b4fa", {radius: 12})
  raylib.rectangle({x: 40, y: 40, width: 200, height: 100}, "white", {lineWidth: 2})
  raylib.circle({x: 400, y: 90}, 40, "#f38ba8")
  raylib.line({x: 40, y: 200}, {x: 700, y: 260}, "#a6e3a1", {thickness: 3})
  raylib.polygon([{x: 500, y: 300}, {x: 600, y: 300}, {x: 550, y: 380}], "#f9e2af")
  raylib.text("Shapes", {x: 40, y: 300}, {size: 40, color: "white"})
), {background: "#181825", frames: 600})
```

`raylib.useFont(path, baseSize)` makes text use a TTF or OTF font, and `raylib.measureText(text, size)` tells you how wide it will be, for centring.

## Keyboard and mouse

`isKeyDown` is true while a key is held, `isKeyPressed` only on the frame it went down. Keys are named (`"space"`, `"enter"`, `"left"`, `"f1"`) or a single character. The mouse has the same trio with buttons `"left"`, `"right"` and `"middle"`, plus `mousePosition()`:

```osl norun
import "std:raylib"

int clicks = 0
auto target = {x: 300, y: 150, width: 200, height: 100}

raylib.runWindow(def(ms) (
  auto mouse = raylib.mousePosition()
  auto over = raylib.isPointInRect(mouse, target)
  if over and raylib.isMousePressed("left") ( clicks += 1 )

  raylib.rectangle(target, if over then "#a6e3a1" else "#89b4fa")
  raylib.text("clicks: " ++ clicks, {x: 20, y: 20}, {size: 30, color: "white"})
), {background: "#181825"})
```

`nextChar()` returns characters as they are typed, with the keyboard layout applied, which is what a text box wants.

## Images and textures

An image lives in memory, and a texture lives on the graphics card and is what you draw. `raylib.loadTexture(path)` loads a file as a texture, and `tex.drawAt(position, options)` draws it, with `scale`, `rotation`, `tint` and `source` (a part of the texture, for sprite sheets):

```osl norun
import "std:raylib"

raylib.initWindow(640, 360, "Sprite").unwrap()
auto sprite = raylib.loadTexture("player.png").unwrap()
sprite.setFilter("bilinear").unwrap()

while !raylib.windowShouldClose() (
  raylib.draw(def() (
    raylib.clear("#181825")
    sprite.drawAt({x: 100, y: 100}, {scale: 2, tint: "white"})
  ))
)
raylib.closeWindow()
```

Images from [img](img.md) work too: `raylib.textureFromImage(pic)` uploads one, so anything you drew with img can be shown, and `raylib.screenshot()` returns the window's contents as an `*img.Image`.

## Loading an image without a window

`raylib.loadImage(path)` needs no window. It returns a `raylib.Image`, and `toImage()` hands you a normal `*img.Image`:

```osl
import "std:raylib"
import "std:img"
import "std:fs"

raylib.setLogLevel("none")
fs.remove("blue.png", {force: true}).unwrap()
img.new(4, 3, {fill: "#336699"}).save("blue.png").unwrap()

auto loaded = raylib.loadImage("blue.png").unwrap()
log loaded.width() loaded.height()

*img.Image pic = loaded.toImage()
log pic.pixel(1, 1)
fs.remove("blue.png").unwrap()
```

```output
4 3
#336699
```

> [!note]
> Prefer `img.decodeFile` for images you don't draw with raylib. It reads more formats, returns an `*img.Image` at once and needs no conversion.

## A 2D camera

`raylib.camera2D({target, offset, zoom, rotation})` pans, zooms and rotates everything drawn inside `cam.use(...)`. The target is the world point shown at the offset on screen. It also converts between the two, so a click can find the world point under it:

```osl
import "std:raylib"

auto cam = raylib.camera2D({target: {x: 100, y: 100}, offset: {x: 50, y: 50}, zoom: 2})
log cam.toScreen({x: 100, y: 100})
log cam.toScreen({x: 110, y: 100})
log cam.toWorld({x: 50, y: 50})
```

```output
{"x":50,"y":50}
{"x":70,"y":50}
{"x":100,"y":100}
```

The world point 100, 100 appears at the screen's 50, 50, and 10 units to its right is 20 pixels away because of the zoom. Change `zoom` to 1 and run again. Inside a window:

```osl norun
import "std:raylib"

auto cam = raylib.camera2D({offset: {x: 400, y: 225}, zoom: 1})

raylib.runWindow(def(ms) (
  if raylib.isKeyDown("a") ( cam.setZoom(cam.zoom() * 1.01) )
  if raylib.isKeyDown("z") ( cam.setZoom(cam.zoom() / 1.01) )
  cam.use(def() (
    raylib.circle({x: 0, y: 0}, 50, "#f38ba8")
    raylib.rectangle({x: 100, y: -20, width: 80, height: 40}, "#89b4fa")
  ))
), {background: "#181825"})
```

## 3D

`raylib.camera({position, target, fovy})` is a 3D camera. Inside `cam.use`, `cube`, `sphere`, `cylinder`, `plane`, `grid` and `line3D` draw in world space. `cam.control("orbital")` moves the camera from the keyboard and mouse:

```osl norun
import "std:raylib"

auto cam = raylib.camera({position: raylib.vec3(6, 5, 6), target: raylib.vec3(0, 1, 0), fovy: 60})

raylib.runWindow(def(ms) (
  cam.control("orbital")
  cam.use(def() (
    raylib.grid(10, 1)
    raylib.cube(raylib.vec3(0, 1, 0), raylib.vec3(2, 2, 2), "#89b4fa")
    raylib.cube(raylib.vec3(0, 1, 0), raylib.vec3(2, 2, 2), "white", {wireframe: true})
    raylib.sphere(raylib.vec3(3, 0.5, 0), 0.5, "#f38ba8")
  ))
), {background: "#181825"})
```

Picking works with rays. `raylib.ray(origin, direction).box(center, size)` says whether it hits a box, and where:

```osl
import "std:raylib"

auto ray = raylib.ray(raylib.vec3(0, 0, -10), raylib.vec3(0, 0, 1))
auto hit = ray.box(raylib.vec3(0, 0, 0), raylib.vec3(2, 2, 2))
log hit.hit hit.distance
log ray.box(raylib.vec3(5, 5, 5), raylib.vec3(1, 1, 1)).hit
```

```output
true 9
false
```

## Render textures, blending and shaders

`raylib.renderTexture(w, h)` is an off-screen surface. Draw into it with `tex.use(...)`, then draw it on screen with `tex.drawAt` or save it with `tex.toImage()`. `raylib.blend("additive", draw)` changes how overlapping colours mix. `raylib.compileShader(code)` compiles a GPU [shader](shader.md), and `shader.use(draw)` draws through it. `raylib.smoothLines(draw)` draws anti-aliased lines in one batch.

:::exercise title="Hit test"
A button is at `{x: 10, y: 10, width: 100, height: 30}`. Use `raylib.isPointInRect` to print, for each click point in the list, whether it hit the button.

```osl
import "std:raylib"

auto button = {x: 10, y: 10, width: 100, height: 30}
auto clicks = [{x: 20, y: 20}, {x: 200, y: 20}, {x: 109, y: 39}]

log button.width clicks.len
```

```output
true
false
true
```

> [!hint]
> Loop over `clicks` and log `raylib.isPointInRect(click, button)`.

> [!hint]
> The rectangle covers x from 10 to 109 and y from 10 to 39.

```osl solution
import "std:raylib"

auto button = {x: 10, y: 10, width: 100, height: 30}
auto clicks = [{x: 20, y: 20}, {x: 200, y: 20}, {x: 109, y: 39}]

for click in clicks (
  log raylib.isPointInRect(click, button)
)
```
:::

:::exercise title="Where does it appear?"
A 2D camera looks at the world point 200, 100, shown at the screen point 400, 300, with no zoom. Print the screen position of the world point 250, 100.

```osl
import "std:raylib"

auto cam = raylib.camera2D({target: {x: 200, y: 100}, offset: {x: 400, y: 300}})

log cam.toScreen({x: 200, y: 100})
```

```output
{"x":450,"y":300}
```

> [!hint]
> Ask the camera: `cam.toScreen({x: 250, y: 100})`.

```osl solution
import "std:raylib"

auto cam = raylib.camera2D({target: {x: 200, y: 100}, offset: {x: 400, y: 300}})

log cam.toScreen({x: 250, y: 100})
```

```output
{"x":450,"y":300}
```
:::

## API reference

::api

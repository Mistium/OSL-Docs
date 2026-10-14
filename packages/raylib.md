# raylib

Use `raylib` for native desktop windows with 2D and 3D drawing, keyboard and mouse input, textures,
shaders, and render textures. Pixels move to and from [img](img.md) images. For buttons, sliders,
text fields, and other controls, use [raygui](raygui.md). For audio, import [sound](sound.md)
alongside it.

```osl
import "std:raylib"
```

## Example

```osl
import "std:raylib"

object player = {x: 20.0, y: 200.0}

raylib.runWindow(def(number ms) -> (
  number speed = 0.2 * ms
  if raylib.isKeyDown("right") ( player.x += speed )
  if raylib.isKeyDown("left") ( player.x -= speed )
  raylib.rectangle({x: player.x, y: player.y, width: 40, height: 40}, "#89b4fa", {radius: 6})
  raylib.text("Move with the arrow keys", {x: 20, y: 20}, {size: 24, color: "white"})
), {width: 800, height: 450, title: "OSL raylib", background: "#181825"})
```

`runWindow` opens the window, calls the frame function once per frame with the previous frame's
duration in milliseconds, and closes the window when the user asks. For a hand-written loop, open
the window with `initWindow` and draw each frame inside `raylib.draw`:

```osl
import "std:raylib"

raylib.initWindow(640, 360, "Manual loop", {fps: 60, resizable: true})
while !raylib.windowShouldClose() (
  raylib.draw(def() -> (
    raylib.clear("raywhite")
    raylib.circle(raylib.mousePosition(), 12, "#e76f51")
  ))
)
raylib.closeWindow()
```

Times are in milliseconds. Positions are `{x, y}` objects (or `{x, y, z}` in 3D) and rectangles
`{x, y, width, height}`, in window units from the top-left corner. Anything else, such as an array,
throws `TypeError`.

## API reference

### Values

| Function | Returns | Notes |
| --- | --- | --- |
| `raylib.color(value)` | `{r, g, b, a}` | Reads a color. |
| `raylib.vec(x: number, y: number)` | `{x, y}` | A 2D point. |
| `raylib.vec3(x: number, y: number, z: number)` | `{x, y, z}` | A 3D point. |

Every function that takes a color accepts `"#rgb"`, `"#rgba"`, `"#rrggbb"`, `"#rrggbbaa"`,
`{r, g, b, a}`, or one of raylib's color names: `"black"`, `"white"`, `"red"`, `"green"`, `"blue"`,
`"yellow"`, `"orange"`, `"purple"`, `"pink"`, `"gray"`, `"transparent"`, `"raywhite"`. The names
are raylib's own palette, so `"red"` is `#e62937`, not CSS red. Anything else, including an array
or a packed number, throws `ValueError`. To reuse a color every frame without parsing it again,
keep the `{r, g, b, a}` object that `raylib.color` returns.

### Window

| Function | Returns | Notes |
| --- | --- | --- |
| `raylib.runWindow(frame, options?)` | `result<unit, error>` | Runs a whole window. `frame(ms)` is called inside `draw` once a frame. Options: `width` (800), `height` (450), `title`, `fps` (60), `background` (a color to clear to each frame), `frames` (stop after this many; 0 runs until closed), and the window flags below. Uses and leaves open a window that is already open. |
| `raylib.initWindow(width: int, height: int, title: string, options?)` | `result<unit, error>` | Opens the window. Options: `fps` and the window flags below. |
| `raylib.draw(frame)` | `void` | Runs `frame()` to draw one frame and shows it. All on-screen drawing happens inside. The frame ends even when `frame` throws. |
| `raylib.closeWindow()` | `void` | Closing with no window open does nothing. |
| `raylib.isWindowReady()` | `boolean` | Whether a window is open. |
| `raylib.windowShouldClose()` | `boolean` | Whether the user asked to close (close button or Escape). |
| `raylib.setTargetFPS(fps: int)` | `void` | 0 means no cap. |
| `raylib.fps()` | `int` | Frames drawn in the last second. |
| `raylib.frameDuration()` | `number` | The last frame's duration in milliseconds. |
| `raylib.elapsed()` | `number` | Milliseconds since the window opened. |
| `raylib.dpiScale()` | `number` | Framebuffer pixels per window unit (2 on most retina screens). Measured, not taken from the platform. |
| `raylib.screenSize()` | `{width, height}` | The window size in window units. |
| `raylib.setWindowTitle(title: string)` | `void` | |
| `raylib.setWindowSize(width: int, height: int)` | `void` | |
| `raylib.on(event: string, handler)` / `raylib.off(event, handler)` | `void` | Adds or removes an event handler. The only event is `"resize"`, which runs while the window edge is dragged. macOS pauses the program's loop during the drag, so redraw in the handler. |
| `raylib.disableCursor()` / `raylib.enableCursor()` | `void` | Hide and lock, or show and unlock, the cursor. |
| `raylib.isCursorHidden()` | `boolean` | |
| `raylib.screenshot()` | `result<*img.Image, error>` | What the window shows, at full framebuffer resolution, fully opaque. |
| `raylib.takeScreenshot(path: string)` | `result<unit, error>` | Saves what the window shows to a file. |
| `raylib.setGPUPreference(preference: string)` | `string` | `"integrated"` (default) or `"discrete"` (`"dedicated"` and `"high_performance"` mean the same), for windows opened afterwards. Returns the preference in effect. |
| `raylib.gpuPreference()` | `string` | |
| `raylib.setLogLevel(level: string)` | `void` | Which of raylib's own messages print: `"all"`, `"trace"`, `"debug"`, `"info"` (default), `"warning"`, `"error"`, `"fatal"`, `"none"`. |

Window flags are boolean options, all `false` by default: `highdpi`, `resizable`, `vsync`, `msaa`,
`transparent`, `undecorated`, `borderless`, `topmost`, `hidden`, `alwaysRun`.

`initWindow` fails with `StateError` when a window is already open and `RuntimeError` when one
can't be opened. Most other functions throw `StateError` when no window is open.

### 2D drawing

| Function | Notes |
| --- | --- |
| `raylib.clear(color)` | Fills the drawing target. |
| `raylib.pixel(point, color)` | One pixel. |
| `raylib.line(from, to, color, options?)` | Option: `thickness` (default 1). |
| `raylib.rectangle(rect, color, options?)` | Filled unless `lineWidth` is given. Options: `lineWidth`, `radius` (rounded corners). |
| `raylib.circle(center, radius: number, color, options?)` | Filled unless `lineWidth` is given. |
| `raylib.polygon(points: array, color, options?)` | A convex polygon through three or more points, in either winding order. Filled unless `lineWidth` is given. |
| `raylib.text(text: string, position, options?)` | Top-left corner at `position`. Options: `size` (em size, default 20), `color` (default black). |
| `raylib.measureText(text: string, size: number)` | `int`: the width at that size. |
| `raylib.textHeight(size: number)` | `number`: the line height for a size (ascent plus descent). |
| `raylib.useFont(path: string, baseSize: int)` | `result<unit, error>`: makes `text` and `measureText` use a TTF or OTF font rasterised at `baseSize` pixels and smoothly scaled. Sizes are then em sizes, as in CSS. |
| `raylib.blend(mode: string, draw)` | Runs `draw()` with a blend mode: `"alpha"`, `"additive"`, `"multiply"`, `"premultiplied"`, or `"layer"` (alpha blending that keeps a transparent render texture premultiplied, to composite later with `"premultiplied"`). |
| `raylib.smoothLines(draw)` | `result<unit, error>`: runs `draw()`, in which `smoothLine` adds antialiased round-capped lines with premultiplied alpha, sent to the GPU in one batch at the end. |
| `raylib.smoothLine(from, to, color, options?)` | Inside `smoothLines` only. Option: `thickness` (default 1). A zero-length line is a round dot. |

```osl
import "std:raylib"

raylib.runWindow(def(number ms) -> (
  raylib.smoothLines(def() -> (
    raylib.smoothLine({x: 40, y: 40}, {x: 300, y: 200}, "#89b4fa", {thickness: 6})
    raylib.smoothLine({x: 300, y: 200}, {x: 500, y: 60}, "#f38ba8", {thickness: 6})
  ))
  raylib.blend("additive", def() -> (
    raylib.circle({x: 200, y: 300}, 60, "#ff000088")
    raylib.circle({x: 260, y: 300}, 60, "#0000ff88")
  ))
), {background: "#11111b"})
```

### 2D camera

`raylib.camera2D(options?)` returns a `*raylib.Camera2D`. Options: `target` (the world point the
camera looks at, default the origin), `offset` (where on screen that point appears, default the
top-left corner), `rotation` (degrees, default 0), `zoom` (default 1).

| Method | Notes |
| --- | --- |
| `cam.use(draw)` | Runs `draw()` panned, rotated, and zoomed by the camera. Call inside `raylib.draw`. |
| `cam.target()` / `cam.setTarget(point)` | |
| `cam.offset()` / `cam.setOffset(point)` | |
| `cam.rotation()` / `cam.setRotation(degrees)` | |
| `cam.zoom()` / `cam.setZoom(zoom)` | 2 draws everything twice as large. Must be more than 0. |
| `cam.toWorld(point)` | The world point under a screen point, such as the mouse. |
| `cam.toScreen(point)` | Where a world point appears on screen. |

### 3D

`raylib.camera(options?)` returns a `*raylib.Camera`. Options: `position` and `target` (`{x, y, z}`,
default the origin), `up` (default `{x: 0, y: 1, z: 0}`), `fovy` (degrees, or the view height for an
orthographic camera; default 60), `projection` (`"perspective"` (default) or `"orthographic"`).

| Method | Notes |
| --- | --- |
| `camera.use(draw)` | Runs `draw()` with 3D drawing seen through the camera. Call inside `raylib.draw`. |
| `camera.control(mode: string)` | Moves the camera from this frame's input: `"free"`, `"orbital"`, `"firstPerson"`, or `"thirdPerson"`. |
| `camera.position()` / `camera.setPosition(point)` | `{x, y, z}` / `void` |
| `camera.target()` / `camera.setTarget(point)` | `{x, y, z}` / `void` |
| `camera.screenRay(point)` | `*raylib.Ray` from the camera through a screen point. |
| `camera.centerRay()` | `*raylib.Ray` through the middle of the screen. |

| Function | Notes |
| --- | --- |
| `raylib.cube(center, size, color, options?)` | `size` is `{x, y, z}`. Option: `wireframe`. |
| `raylib.sphere(center, radius, color, options?)` | Options: `wireframe`, `rings` (16), `slices` (16). |
| `raylib.cylinder(from, to, color, options?)` | Options: `radius` (1), `topRadius` (default `radius`; 0 makes a cone), `slices` (16), `wireframe`. |
| `raylib.plane(center, size, color)` | A flat rectangle on the x-z plane; `size` is `{x, z}`. |
| `raylib.grid(slices: int, spacing: number)` | A ground grid centred on the origin. |
| `raylib.line3D(from, to, color)` | |
| `raylib.ray(origin, direction)` | `*raylib.Ray` |
| `ray.box(center, size)` | `{hit, distance, point, normal}`: where the ray first meets a box. `distance`, `point`, and `normal` are `null` when `hit` is `false`. |

```osl
import "std:raylib"

auto camera = raylib.camera({position: {x: 6, y: 4, z: 6}, target: {x: 0, y: 0, z: 0}})
raylib.runWindow(def(number ms) -> (
  camera.control("orbital")
  camera.use(def() -> (
    raylib.grid(10, 1)
    raylib.cube({x: 0, y: 0.5, z: 0}, {x: 1, y: 1, z: 1}, "#f4a261")
    raylib.sphere({x: 2, y: 0.5, z: 0}, 0.5, "#2a9d8f", {wireframe: true})
  ))
  auto hit = camera.screenRay(raylib.mousePosition()).box({x: 0, y: 0.5, z: 0}, {x: 1, y: 1, z: 1})
  if hit.hit ( raylib.text("cube under the mouse", {x: 10, y: 10}) )
), {background: "raywhite"})
```

### Input

| Function | Returns | Notes |
| --- | --- | --- |
| `raylib.isKeyPressed(key: string)` | `boolean` | The key went down this frame. |
| `raylib.isKeyDown(key: string)` | `boolean` | The key is held. |
| `raylib.isKeyReleased(key: string)` | `boolean` | The key came up this frame. |
| `raylib.nextKey()` | `string?` | The next key pressed since the last call, or `null` when the queue is empty. Keys without a name are skipped. |
| `raylib.nextChar()` | `string?` | The next character typed, with shift and keyboard layout applied, or `null`. |
| `raylib.mousePosition()` | `{x, y}` | In window units. |
| `raylib.mouseDelta()` | `{x, y}` | Movement since the last frame. |
| `raylib.mouseWheel()` | `number` | Wheel movement this frame; positive is away from the user. |
| `raylib.setMousePosition(x: number, y: number)` | `void` | |
| `raylib.isMousePressed(button: string)` | `boolean` | `"left"`, `"right"`, `"middle"`, `"side"`, or `"extra"`. |
| `raylib.isMouseDown(button: string)` | `boolean` | |
| `raylib.isMouseReleased(button: string)` | `boolean` | |

Key names are `"space"`, `"escape"`, `"enter"`, `"tab"`, `"backspace"`, `"insert"`, `"delete"`,
`"left"`, `"right"`, `"up"`, `"down"`, `"pageup"`, `"pagedown"`, `"home"`, `"end"`, `"shift"`,
`"ctrl"`, `"alt"` and their `"left…"`/`"right…"` forms (`"leftshift"`), `"f1"` to `"f12"`, or single
characters such as `"a"`, `"1"`, `"/"`. An unknown key or button throws `ValueError`.

### Collision

| Function | Notes |
| --- | --- |
| `raylib.isRectOverlapping(a, b)` | Two rectangles overlap. |
| `raylib.isCircleOverlapping(a, b)` | Two circles `{x, y, radius}` overlap. |
| `raylib.isPointInRect(point, rect)` | |
| `raylib.isPointInCircle(point, circle)` | `circle` is `{x, y, radius}`. |

### Textures and images

| Function | Returns | Notes |
| --- | --- | --- |
| `raylib.loadTexture(path: string)` | `result<*raylib.Texture, error>` | Loads PNG, BMP, TGA, JPEG, GIF, QOI, HDR, PSD, and more onto the GPU. Needs a window. |
| `raylib.textureFromImage(image: *img.Image, options?)` | `result<*raylib.Texture, error>` | Uploads an [img](img.md) image. Later changes to the image don't reach the texture. Option: `premultiplied`. |
| `raylib.loadImage(path: string)` | `result<*raylib.Image, error>` | Loads an image into memory. No window needed. |
| `raylib.loadSVG(path: string, scale: number)` | `result<*raylib.Image, error>` | Rasterises an SVG at `scale`, rounding the size up. See also `svg.renderFile` in [svg](svg.md). |
| `raylib.loadSVGCanvas(path: string, scale: number)` | `result<*raylib.Image, error>` | Rasterises an SVG the way a browser draws it onto a canvas of `width * scale` by `height * scale` (sizes truncated). |

`*raylib.Texture` methods:

| Method | Notes |
| --- | --- |
| `texture.drawAt(position, options?)` | Draws with the top-left corner at `position`. Options: `scale` (1), `rotation` (degrees around `origin`), `tint` (default `"#ffffff"`), `source` (part of the texture, `{x, y, width, height}`; a negative width or height flips it), `width` and `height` (drawn size), `origin` (the point in the drawn rectangle that `position` and `rotation` refer to). |
| `texture.drawBillboard(camera, position, options?)` | Draws in 3D at `{x, y, z}`, facing the camera. Call inside `camera.use`. Options: `size` (world units tall, default 1), `tint`. |
| `texture.setFilter(mode: string)` | `result<unit, error>`: `"point"` (default), `"bilinear"`, or `"trilinear"`. |
| `texture.setWrap(mode: string)` | `result<unit, error>`: `"repeat"` (default), `"clamp"`, or `"mirror"`. |
| `texture.width()`, `texture.height()` | Pixels. |
| `texture.close()`, `texture.isClosed()` | Frees GPU memory. Drawing a closed texture throws `StateError`. |

`*raylib.Image` methods:

| Method | Notes |
| --- | --- |
| `image.width()`, `image.height()` | Pixels. |
| `image.pixels()` | `int[]`: every pixel row by row, packed as `0xRRGGBBAA`. Useful for collision masks. |
| `image.toTexture(options?)` | `result<*raylib.Texture, error>`. Option: `premultiplied` (multiply color by alpha first, for `raylib.blend("premultiplied", ...)`). |
| `image.toImage()` | `*img.Image`: a copy to draw on, filter, or encode with [img](img.md). |
| `image.save(path: string)` | `result<unit, error>`: writes a file, alpha included. |
| `image.close()`, `image.isClosed()` | |

```osl
import "std:raylib"
import "std:img"

auto badge = img.new(128, 128)
badge.circle({x: 64, y: 64}, 60, {fill: img.radialGradient({x: 50, y: 50}, 70, ["#ffe9a8", "#f4a261"])})
badge.text("OSL", {x: 64, y: 64}, {size: 32, font: "sans-bold", align: "center", baseline: "middle"})

raylib.initWindow(320, 200, "Badge")
auto texture = raylib.textureFromImage(badge)
raylib.draw(def() -> (
  raylib.clear("#1e1e2e")
  texture.drawAt({x: 96, y: 36})
))
raylib.screenshot().save("window.png")
texture.close()
raylib.closeWindow()
```

### Shaders

`code` is GLSL 330 or OSL-style shader code (see [shader](shader.md)).

| Function | Returns | Notes |
| --- | --- | --- |
| `raylib.compileShader(code: string, options?)` | `result<*raylib.Shader, error>` | Compiles a fragment shader. Option: `vertex` (vertex shader code; default raylib's). |
| `raylib.compileShaderFile(path: string, options?)` | `result<*raylib.Shader, error>` | Option: `vertex` (a vertex shader file). |

| Method | Notes |
| --- | --- |
| `shader.use(draw)` | Runs `draw()` with everything passed through the shader. Call inside `raylib.draw`. |
| `shader.setUniform(name: string, value)` | `result<unit, error>`. A number, an array of 1-4 numbers, a vector `{x, y}` to `{x, y, z, w}`, a color `{r, g, b, a}` (vec4 of 0-255 channels), or a texture or render texture (`sampler2D`). Setting a uniform the shader lacks does nothing. |
| `shader.hasUniform(name: string)` | Whether the uniform exists. GLSL drops uniforms the code doesn't use. |
| `shader.drawRect(rect)` | Fills a rectangle with white drawn through the shader. |
| `shader.drawFullscreen()` | `result<unit, error>`: fills the window. |
| `shader.close()`, `shader.isClosed()` | |

`compileShader` fails with `ParseError` when the GPU driver rejects the code (raylib logs the
driver's message).

### Render textures

`raylib.renderTexture(width: int, height: int)` returns `result<*raylib.RenderTexture, error>`, an
off-screen texture.

| Method | Notes |
| --- | --- |
| `target.use(draw)` | Runs `draw()` with everything going into the texture instead of the screen. |
| `target.drawAt(position, options?)` | Draws the contents the right way up. Takes the options of `texture.drawAt`. |
| `target.texture()` | `*raylib.Texture` sharing the GPU memory, for `setUniform`. It is upside down (OpenGL stores rows bottom-up) and stops working when the render texture is closed. |
| `target.toImage()` | `*img.Image`: the contents the right way up, with the alpha they were drawn with. |
| `target.save(path: string)` | `result<unit, error>`: the contents the right way up, fully opaque. |
| `target.width()`, `target.height()` | Pixels. |
| `target.close()`, `target.isClosed()` | Also frees textures `texture()` returned. |

Closing a handle twice does nothing. Any other use of a closed handle throws `StateError`.

## Changes from earlier versions

The old raylib-style functions such as `raylib.run`, `beginDrawing`/`endDrawing`, `drawRectangle`,
`drawText`, and `keyPressed` have been removed. Use `raylib.runWindow` or `raylib.draw`, the
shape functions above (`raylib.rectangle`, `raylib.text`, ...), and `raylib.isKeyPressed`. Timing
is in milliseconds (`frameDuration`, `elapsed`), loaders return results, and handles have `close()`
rather than `unload()`.

## Behavior and limits

`raylib` is for native desktop builds (`osl run` and `osl compile`). `initWindow` and `runWindow`
keep the working directory unchanged, so relative asset paths keep working after the window opens.
On macOS the `"integrated"` GPU preference requests an OpenGL pixel format that allows automatic
graphics switching, so opening a window doesn't power up the discrete GPU.

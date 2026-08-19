# raylib

> Native windowing, input, 2D and 3D drawing, collision helpers, and managed textures

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
- `raylib.vec(x, y)`, `raylib.vec3(x, y, z)`, and `raylib.rect(x, y, width, height)` create geometry objects.
- `initWindow(width, height, title)`, `closeWindow()`, `windowReady()`, and `windowShouldClose()` expose manual lifecycle control.
- `run(options, update, draw)` manages the window and frame loop.
- `setTargetFPS(fps)`, `fps()`, `frameTime()`, `time()`, `screenSize()`, `setWindowTitle(title)`, and `setWindowSize(width, height)` manage timing and the window.
- `disableCursor()`, `enableCursor()`, and `cursorHidden()` manage captured mouse input.
- `setGPUPreference(pref)` sets GPU power mode (`"integrated"` or `"discrete"`). Defaults to `"integrated"`.
- `gpuPreference()` returns the current GPU preference.

## Drawing

Use `clear`, `drawPixel`, `drawLine`, `drawRectangle`, `drawRectangleLines`, `drawCircle`,
`drawCircleLines`, `drawTriangle`, `drawText`, and `measureText`. For manual loops,
`beginDrawing()`, `endDrawing()`, and `draw(fn)` are available.

## 3D cameras and drawing

Create a perspective camera with `raylib.camera(options)`. Options may include `position`, `target`,
`up`, `fovy`, and `projection`. The returned camera provides `update(mode)`, `position()`,
`target()`, `setPosition(value)`, and `setTarget(value)`. Camera modes are `custom`, `free`,
`orbital`, `first_person`, and `third_person`.

Use `begin3D(camera)` and `end3D()` around 3D drawing, or call `draw3D(camera, frame)`. The 3D
drawing helpers are `drawCube(center, size, color)`, `drawCubeWires(center, size, color)`,
`drawSphere(center, radius, color)`, `drawSphereWires(center, radius, rings, slices, color)`,
`drawCylinder(position, radiusTop, radiusBottom, height, slices, color)`,
`drawPlane(center, size, color)`, `drawLine3D(start, end, color)`,
`drawBillboard(camera, texture, position, size, tint)`, and `drawGrid(slices, spacing)`.

## Rays and box picking

- `raylib.ray(origin, direction)` creates a ray from two 3D vectors.
- `raylib.screenRay(point, camera)` creates a world ray through a screen position.
- `raylib.centerRay(camera)` creates a ray through the center of the window.
- `ray.box(center, size)` tests an axis-aligned box and returns `{hit, distance, point, normal}`.

## Input and collision

- Keyboard: `keyPressed`, `keyDown`, and `keyReleased`
- Mouse: `mousePosition`, `mouseDelta()`, `setMousePosition(x, y)`, `mousePressed`, `mouseDown`, `mouseReleased`, and `mouseWheel`
- Collision: `rectanglesCollide`, `circlesCollide`, and `pointInRectangle`

Key names include letters, arrows, space, escape, enter, modifiers, and F1 through F12.

## Audio

- `initAudioDevice()` and `closeAudioDevice()` manage native audio device lifecycle.
- `audioReady()` checks if audio device is initialized.
- `setMasterVolume(volume)` adjusts master volume between `0.0` and `1.0`.
- `loadSound(path)` loads a WAV/OGG/MP3 sound handle with `play()`, `stop()`, `setVolume(vol)`, `setPitch(pitch)`, `unload()`, and `valid()`.

## Textures and Render Textures

- `raylib.loadTexture(path)` returns a texture with `valid()`, `width()`, `height()`,
  `draw(x, y, rotation, scale, tint)`, and `unload()` methods.
- `raylib.renderTexture(width, height)` returns an offscreen frame buffer with `valid()`, `begin()`, `end()`,
  `width()`, `height()`, `texture()`, `draw(x, y, rotation, scale, tint)`, and `unload()` methods.
- `raylib.drawToTexture(target, drawFunc)` executes a drawing callback into the render target.

## Shaders

- `raylib.loadShader(vs, fs)` and `raylib.loadFragmentShader(fs)` load GLSL or OSL-style shaders from code strings or file paths.
- `raylib.shader(code)` is a shorthand for loading a fragment shader.
- `raylib.beginShader(s)` and `raylib.endShader()` toggle active shader mode.
- `raylib.drawShader(s, x, y, width, height)` draws a rectangle using the active shader.

### Returned Shader object methods

- `valid()` returns boolean indicating if the shader compiled and loaded.
- `begin()` and `end()` activate and deactivate the shader.
- `setValue(name, value)` sets float, vector (`[x, y]`, `[x, y, z]`, `[x, y, z, w]`), or texture uniform values.
- `setUniform(name, value)` is an alias for `setValue`.
- `draw(x, y, width, height)` draws a rectangle filled by the shader.
- `drawFullscreen()` draws a fullscreen quad using the shader.
- `unload()` frees the shader from GPU memory.


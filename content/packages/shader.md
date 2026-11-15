---
description: Write GPU shaders in OSL's syntax and turn them into GLSL for raylib windows.
package: shader
---

# shader

A shader is a small program that runs on the graphics card once for every pixel. GPUs read a language called GLSL. `std:shader` lets you write the shader in OSL-style syntax (parentheses, `number`, no semicolons) and turns it into GLSL, with the usual Shadertoy variables already declared (`iTime`, `iResolution`, `iMouse` and friends).

It only translates text. To run the result you use [raylib](raylib.md), which compiles it and draws with it.

## A shader in OSL style

Write `def mainImage(fragCoord)` and return the colour of the pixel at `fragCoord`. `transpile` returns the GLSL. This prints the lines that changed:

```osl
import "std:shader"

string code = `def mainImage(fragCoord) (
  vec2 uv = fragCoord / iResolution.xy
  number t = iTime * 1.5
  return vec4(uv, 0.5 + 0.5 * sin(t), 1.0)
)`

string glsl = shader.transpile(code)
for line in glsl.split("\n") (
  if line.contains("vec2 uv") or line.contains("float t") or line.contains("fragColor = vec4") (
    log line.trim()
  )
)
```

```output
vec2 uv = fragCoord / iResolution.xy;
float t = iTime * 1.5;
fragColor = vec4(uv, 0.5 + 0.5 * sin(t), 1.0); return;
```

`number` became `float`, the blocks got braces, every line got its semicolon, and the `return` became an assignment to `fragColor`. Rename `t` to `time` and run it again. The output follows.

## Plain statements

A shader doesn't need a function at all. Write statements that set `fragColor`, and `uv` is there for you (the pixel's position from 0 to 1):

```osl
import "std:shader"

string glsl = shader.transpile("fragColor = vec4(uv, 0.0, 1.0)")
log glsl.startsWith("#version 330")
log glsl.contains("fragColor = vec4(uv, 0.0, 1.0);")
log glsl.contains("uniform float iTime;")
```

```output
true
true
true
```

## Real GLSL passes through

Code that already has `#version` and a `main` is returned unchanged, so you can mix: hand-written GLSL for the hard cases, OSL style for the rest.

```osl
import "std:shader"

string handwritten = "#version 330\nvoid main() {}"
log shader.transpile(handwritten) == handwritten
```

```output
true
```

## Vertex shaders and the built-ins

`shader.transpile(code, {stage: "vertex"})` makes a vertex shader. `shader.vertexDefault()` is raylib's standard one, which passes the texture coordinate and colour on. Two example fragment shaders are included:

```osl
import "std:shader"

log shader.vertexDefault().contains("gl_Position")
log shader.plasma().contains("mainImage")
log shader.gradient().contains("iTime")
```

```output
true
true
true
```

:::quiz
What does `shader.transpile` do with the code you give it?

- [ ] Runs it on the CPU and returns an image.
- [x] Returns GLSL source text.
- [ ] Opens a window and draws it.

It's only a translator. Compiling and drawing happen in raylib.
:::

## Drawing with it

Pass the code to `raylib.compileShader`. It accepts OSL style or GLSL, so you rarely call `transpile` yourself. `shader.use(draw)` runs the drawing calls inside it, and uniforms like `iTime` are set each frame. This needs a window, so it doesn't run here:

```osl norun
import "std:raylib"
import "std:shader"

raylib.initWindow(640, 360, "Plasma").unwrap()
raylib.setTargetFPS(60)

auto plasma = raylib.compileShader(shader.plasma()).unwrap()

while !raylib.windowShouldClose() (
  plasma.setUniform("iTime", raylib.elapsed() / 1000).unwrap()
  plasma.setUniform("iResolution", raylib.vec(640, 360)).unwrap()
  raylib.draw(def() (
    plasma.drawFullscreen().unwrap()
  ))
)
raylib.closeWindow()
```

Swap `shader.plasma()` for `shader.gradient()` and run it on your machine. A shader that the graphics driver rejects fails with a `ParseError`, and raylib prints the driver's message.

:::exercise title="Check your shader"
Translate this shader, then print whether the GLSL starts with `#version 330` and whether it contains `float`.

```osl
import "std:shader"

string code = "number glow = uv.x * uv.y\nfragColor = vec4(glow, glow, glow, 1.0)"

log code.len
```

```output
true
true
```

> [!hint]
> `shader.transpile(code)` returns a string. Use `.startsWith` and `.contains`.

```osl solution
import "std:shader"

string code = "number glow = uv.x * uv.y\nfragColor = vec4(glow, glow, glow, 1.0)"

string glsl = shader.transpile(code)
log glsl.startsWith("#version 330")
log glsl.contains("float")
```
:::

> [!note]
> `shader.renderImage` and `shader.eval` are deprecated and always fail. Shaders only run on the GPU.

## API reference

::api

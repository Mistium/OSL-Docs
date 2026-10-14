# shader

Use `shader` to write fragment and vertex shaders in OSL style and turn them into GLSL 330 for
[raylib](raylib.md). Shaders run on the GPU only; draw them with `raylib.compileShader`.

```osl
import "std:shader"
```

## Example

```osl
import "std:shader"
import "std:raylib"

string glow = `vec2 p = uv - 0.5
number d = length(p)
return vec4(vec3(1.0 - d * 2.0) * vec3(0.5, 0.8, 1.0), 1.0)`

log shader.transpile(glow)

raylib.initWindow(400, 400, "Glow")
auto fx = raylib.compileShader(glow)
fx.setUniform("iResolution", {x: 400, y: 400})
while !raylib.windowShouldClose() (
  fx.setUniform("iTime", raylib.elapsed() / 1000)
  raylib.draw(def() -> (
    fx.drawFullscreen()
  ))
)
fx.close()
raylib.closeWindow()
```

`raylib.compileShader` accepts OSL-style code directly, so calling `shader.transpile` yourself is
only needed to inspect or save the GLSL.

## API reference

### `shader`

| Function | Returns | Notes |
| --- | --- | --- |
| `shader.transpile(code: string, options?)` | `string` | Turns OSL-style shader code into GLSL 330. GLSL that already has `#version` and `main` comes back unchanged. Option: `stage`, `"fragment"` (default) or `"vertex"`. |
| `shader.vertexDefault()` | `string` | raylib's standard vertex shader as GLSL 330. It passes `fragTexCoord` and `fragColor` to the fragment shader. |
| `shader.plasma()` | `string` | An example fragment shader in OSL style: animated plasma bands driven by `iTime`. |
| `shader.gradient()` | `string` | An example fragment shader in OSL style: a color gradient that cycles with `iTime`. |

An unknown `stage` throws `ValueError`.

## OSL-style shader code

A fragment shader is either a Shadertoy-style `def mainImage(fragCoord) ( ... )` that sets
`fragColor` or returns a `vec4`, or a plain list of statements. Statements run with `fragCoord`
(pixels), `uv` (0 to 1), and `fragColor` (preset to white) in scope and may return a `vec4`.

In both forms:

- `def name(type param, ...) type ( ... )` declares a function.
- `number` becomes `float`. `vec2` to `vec4` and `mat2` to `mat4` are as in GLSL.
- `if`/`else`, `for`, and `while` blocks use OSL parentheses. `for i n (` counts from 0 to n - 1.
- Line endings end statements; no semicolons are needed.
- The uniforms `iResolution`, `iTime`, `iTimeDelta`, `iFrame`, `iMouse`, `iDate`, `iChannel0`,
  `iChannel1`, `texture0`, and `colDiffuse` are declared unless the code declares them. Set them
  with `setUniform` on the compiled `*raylib.Shader`.

```osl
import "std:shader"

string rings = `def mainImage(fragCoord) (
  vec2 uv = fragCoord / iResolution.xy
  number d = length(uv - 0.5)
  number band = 0.5 + 0.5 * sin(d * 40.0 - iTime * 4.0)
  fragColor = vec4(vec3(band), 1.0)
)`

log shader.transpile(rings)
```

## Changes from earlier versions

`shader.toGLSL(code, "vert")` is now `shader.transpile(code, {stage: "vertex"})`. `shader.renderImage`
and `shader.eval` have been removed, since shaders run only on the GPU: compile with
`raylib.compileShader(code)`, draw into a `raylib.renderTexture`, and call `target.toImage()` for an
`*img.Image`.

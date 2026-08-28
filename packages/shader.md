# shader

`osl/shader` allows writing fragment and vertex shaders in OSL syntax or standard GLSL, compiling
them into valid GLSL code, and rendering procedural graphics directly to images or raylib windows.

```osl
import "std:shader"
import "std:img"

string plasma = "def mainImage(fragCoord) (
    vec2 uv = fragCoord / iResolution.xy
    number t = iTime * 1.5
    number v = sin(uv.x * 10.0 + t) + sin(uv.y * 10.0 + t)
    vec3 col = 0.5 + 0.5 * cos(v + vec3(0.0, 2.0, 4.0))
    return vec4(col, 1.0)
)"

// Render directly to an image without opening a window
auto image = shader.renderImage(plasma, 400, 300, {time: 1.0})
img.savePNG(image, "plasma.png")
```

## Functions

### `shader.toGLSL(code, [type])`

Transpiles OSL-style shader syntax into complete, valid GLSL shader source code.
Accepts `"frag"` (default) or `"vert"`.

OSL syntax features supported:
- Block delimiters `(` ... `)` mapped to `{` ... `}`
- Functions: `def mainImage(fragCoord) ( ... )` and `def name(args) returnType ( ... )`
- Type keywords: `number` mapped to `float`, `vec2`, `vec3`, `vec4`, `mat2`, `mat3`, `mat4`
- Automatic semicolon insertion for line endings
- Standard uniform injection (`iResolution`, `iTime`, `iTimeDelta`, `iFrame`, `iMouse`, `iDate`, `iChannel0..3`, `texture0`, `colDiffuse`)
- Automatic `main()` entrypoint generation

### `shader.renderImage(code, width, height, [uniforms])`

Evaluates the shader across a `width` by `height` pixel grid and returns an `*img.Image` object.
`uniforms` is an optional object supporting `time` (`iTime`) and `mouse` coordinates.

### `shader.vertexDefault()`

Returns the standard Raylib-compatible 2D vertex shader source code.

### `shader.plasma()`

Returns a built-in OSL-style plasma fragment shader source string.

### `shader.gradient()`

Returns a built-in cosine gradient fragment shader source string.

### `shader.eval(expr, [context])`

Evaluates a mathematical shader expression with the provided uniform context.

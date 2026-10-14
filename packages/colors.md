# colors

Use `colors` to parse CSS colors and to convert, mix, lighten, and darken them. Every OSL package
that takes a color accepts the `"#rrggbb"` strings and `{r, g, b, a}` objects these functions
return.

```osl
import "std:colors"
```

## Example

```osl
import "std:colors"

auto brand = colors.parse("rebeccapurple")
log brand.r ++ ", " ++ brand.g ++ ", " ++ brand.b

log colors.stringify(brand)
log colors.lighten(brand, 0.2)
log colors.mix("red", "blue", 0.5)
log colors.toHSL("#3a6ea5").h
```

## API reference

### `colors`

| Function | Returns | Notes |
| --- | --- | --- |
| `colors.parse(text: string)` | `result<{r, g, b, a}, error>` | Reads a CSS color: `"#rgb"`, `"#rgba"`, `"#rrggbb"`, `"#rrggbbaa"`, a CSS color name, `"transparent"`, `rgb()`/`rgba()`, or `hsl()`/`hsla()` (commas or spaces, percentages, optional `/ alpha`), in any case. Channels are 0-255. |
| `colors.stringify(color)` | `string` | `"#rrggbb"`, or `"#rrggbbaa"` when the color isn't fully opaque. |
| `colors.toHSL(color)` | `{h, s, l, a}` | Hue in degrees (0-360), saturation and lightness 0-1, alpha 0-255. |
| `colors.fromHSL(hsl: object)` | `string` | Converts `{h, s, l, a}` back to `"#rrggbb"` or `"#rrggbbaa"`. `a` is optional (default 255); the hue wraps around 360. |
| `colors.mix(a, b, amount: number)` | `string` | Blends two colors channel by channel, alpha included. `amount` 0 gives `a`, 1 gives `b`. |
| `colors.lighten(color, amount: number)` | `string` | Raises HSL lightness by `amount` (0-1); `lighten(c, 1)` is white. |
| `colors.darken(color, amount: number)` | `string` | Lowers HSL lightness by `amount` (0-1); `darken(c, 1)` is black. |

`color` arguments take a CSS color string or `{r, g, b, a}`. An invalid color, an amount outside
0-1, or a malformed HSL object throws `ValueError`. `colors.parse` fails with `ParseError` for
anything it can't read.

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning. They returned objects with
upper-case `R`, `G`, `B`, `A` keys and wrapped channels modulo 256.

| Deprecated | Use instead |
| --- | --- |
| `colors.rgba(r, g, b, a)` / `colors.RGBA(...)` | `{r: r, g: g, b: b, a: a}` or `colors.stringify` |
| `colors.rgb(r, g, b)` | `{r: r, g: g, b: b}` or `colors.stringify` |
| `colors.nrgba(r, g, b, a)` | `{r: r, g: g, b: b, a: a}` |
| `colors.gray(v)` | `{r: v, g: v, b: v}` |
| `colors.hex(text)` (gave opaque black for bad input) | `colors.parse(text)`, which reports invalid input |

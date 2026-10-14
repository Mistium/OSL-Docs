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

## Changes from earlier versions

`colors.rgba`, `colors.RGBA`, `colors.rgb`, `colors.nrgba`, and `colors.gray` are gone; write the
color as an `{r, g, b, a}` object, or pass it to `colors.stringify` for a hex string.
`colors.hex(text)` is replaced by `colors.parse(text)`, which reports invalid input instead of
returning black.

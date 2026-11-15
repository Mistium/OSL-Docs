---
description: Parse CSS colors, convert between RGB, hex and HSL, and lighten, darken and mix them.
package: colors
---

# colors

Colors arrive in many shapes: `#ff8800`, `rgb(255, 136, 0)`, `tomato`, `hsl(32, 100%, 50%)`. `std:colors` reads any of those, lets you change them in ways that make sense to people (lighter, darker, a blend of two), and writes them back out as hex text.

A color here is one of three things, and the functions accept any of them where they take a `color`:

- a CSS color string such as `"#336699"` or `"tomato"`,
- an object with `r`, `g`, `b` and `a` from 0 to 255, which is what `colors.parse` returns,
- an `img.Color` made with `img.rgb`.

## Parsing

`colors.parse(text)` returns a [result](result.md) holding `{r, g, b, a}`:

```osl
import "std:colors"

auto orange = colors.parse("#ff8800").unwrap()
log orange
log orange.r orange.g orange.b orange.a
```

```output
{"a":255,"b":0,"g":136,"r":255}
255 136 0 255
```

Alpha `a` is opacity: 255 is solid. It reads the common CSS forms:

```osl
import "std:colors"

string[] inputs = ["#f80", "#ff8800", "#ff880080", "rgb(10, 20, 30)", "hsl(120, 100%, 50%)", "red"]
for text in inputs (
  auto c = colors.parse(text).unwrap()
  log text colors.stringify(c)
)
```

```output
#f80 #ff8800
#ff8800 #ff8800
#ff880080 #ff880080
rgb(10, 20, 30) #0a141e
hsl(120, 100%, 50%) #00ff00
red #ff0000
```

Text that is not a color is a `ParseError`:

```osl
import "std:colors"

auto bad = colors.parse("not a color")
log bad.isErr()
log bad.unwrapErr().kind
```

```output
true
ParseError
```

## Writing colors out

`colors.stringify` gives `#rrggbb`, or `#rrggbbaa` when the color isn't fully opaque. It accepts any of the color forms:

```osl
import "std:colors"

log colors.stringify({r: 255, g: 99, b: 71, a: 255})
log colors.stringify({r: 1, g: 2, b: 3, a: 128})
log colors.stringify("tomato")
```

```output
#ff6347
#01020380
#ff6347
```

## Lighter, darker, mixed

`lighten` and `darken` move the lightness by an amount from 0 to 1. `mix(a, b, amount)` blends two colors, where 0 is all `a` and 1 is all `b`. All three return hex text:

```osl
import "std:colors"

string base = "#336699"
log colors.lighten(base, 0.2)
log colors.darken(base, 0.2)
log colors.mix("#ff0000", "#0000ff", 0.5)
log colors.mix("black", "white", 0.25)
```

```output
#6699cc
#1a334d
#800080
#404040
```

These work on lightness in HSL, which is how people judge "lighter", rather than adding to the RGB channels.

## HSL

Hue, saturation and lightness make some changes easy that are awkward in RGB, such as rotating the hue to find a related color. `toHSL` gives `{h, s, l, a}` with hue in degrees (0 to 360) and the others from 0 to 1. `fromHSL` goes back:

```osl
import "std:colors"

auto hsl = colors.toHSL("#ff8800")
log hsl
log hsl.h

auto shifted = colors.fromHSL({h: hsl.h + 120, s: hsl.s, l: hsl.l})
log shifted
```

```output
{"a":255,"h":32,"l":0.5,"s":1}
32
#00ff88
```

Hue 152 is a green, 120 degrees around the wheel from orange.

## Example: a palette from one color

Starting from a brand color, build a scale for a UI: three tints, the base, and two shades.

```osl
import "std:colors"

string brand = "#336699"
string[] steps = []
for amount in [0.3, 0.15] (
  steps.append(colors.lighten(brand, amount))
)
steps.append(brand)
for amount in [0.1, 0.2] (
  steps.append(colors.darken(brand, amount))
)
log steps
```

```output
["#8cb3d9","#538cc6","#336699","#264d73","#1a334d"]
```

## Colors in images

`colors` works with the `std:img` package's colors: `img.rgb(255, 0, 0)` can go into `colors.lighten`, and a hex string or the object from `colors.parse` can go into `image.fill`. There are three shapes of color across packages (a string, an object and `img.Color`), and they convert freely, so pick whichever is convenient and let `colors.stringify` normalise to text.

## API reference

::api

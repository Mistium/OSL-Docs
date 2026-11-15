---
description: Use any Go package from OSL with a go: import, pass values both ways, and read the Go that OSL generates.
lesson: 22
---

# Using Go

OSL compiles to Go, so the whole Go ecosystem is part of OSL's. Import any Go package with `go:` in front of its path, and call it as you would in Go. There are no bindings to write.

```osl
import "go:strings"
import "go:unicode"

log strings.ToUpper("quiet")
log strings.Count("banana", "a")
log strings.Fields(" spread   out  words ")
log unicode.IsDigit(55)
```

```output
QUIET
3
["spread","out","words"]
true
```

Refer to the package by its Go name, usually the last part of its path: `go:net/http` is `http`, `go:path/filepath` is `filepath`.

## Values cross over

OSL values convert to the Go types a function expects, and Go results come back as OSL values. Strings stay strings, numbers convert to the right Go number type, and typed OSL arrays become Go slices:

```osl
import "go:strings"
import "go:slices"
import "go:math"

def hyphenate(string[] words) string -> strings.Join(words, "-")
def largest(int[] values) int -> slices.Max(values)

log hyphenate(["a", "b", "c"])
log largest([3, 9, 4])
log math.Hypot(3, 4)
```

```output
a-b-c
9
5
```

> [!note] Go and threads
> Go code runs outside OSL's automatic thread safety, so passing a top-level variable to a Go function earns a `ConcurrencyWarning`: Go could keep hold of it while another thread changes it. Values that live inside a function, like `words` above, don't warn.

## Go types

Go types work as OSL types, for variables, parameters and return values. Read and set exported fields directly; lowercase field names map to Go's exported ones:

```osl
import "go:image"

image.Point p = image.Pt(1, 2)
p.X = 5
log p.X p.Y

image.Point q = image.Point(x = 10, y = 20)
image.Point sum = q.Add(p)
log sum.String()
```

```output
5 2
(15,22)
```

Pointers to Go types are written with `*`, as in `*strings.Builder`.

## Modules from outside the standard library

Packages beyond Go's standard library come from Go modules. Add them to your project with Opal, which records them in `go.mod`:

```bash
opal add go:github.com/google/uuid
```

```osl norun
import "go:github.com/google/uuid"

log uuid.NewString()
```

## Reading the generated Go

`osl transpile file.osl` prints the Go that OSL generates. Every example on this site has a **Go** button that shows it. It's a good way to see what your code costs: typed OSL becomes plain, direct Go.

```bash
osl transpile main.osl
```

> [!tip] OSL first, Go second
> Reach for the standard library before Go: `std:` packages are written for OSL, return results instead of Go's `(value, error)` pairs, and work with OSL's types. Use `go:` for what the standard library doesn't cover.

:::quiz
How do you call Go's `strings.TrimSpace` from OSL?

- [x] `import "go:strings"` and then `strings.TrimSpace(text)`
- [ ] Write a binding file first.
- [ ] `go.strings.TrimSpace(text)`

A `go:` import gives you the package by its Go name, ready to call.
:::

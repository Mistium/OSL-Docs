---
description: Split a program across files and folders, choose what each file exposes, and use packages from the standard library, Git and Go.
lesson: 19
---

# Modules and imports

One file goes a long way, but real programs grow. `import` brings in code from another file, a folder, the standard library, a Git repository or Go.

## Importing a file

Put shared code in its own file and import it by its path, relative to the file doing the importing. Everything the file declares becomes available:

```osl file=main.osl
import "./shapes.osl"

log area(circle(2))
log area(square(3))
```

```osl file=shapes.osl
struct Shape (
  string kind = ""
  number size = 0
)

def circle(number r) Shape -> Shape("circle", r)
def square(number side) Shape -> Shape("square", side)

def area(Shape s) number -> match s.kind (
  "circle" -> 3.14 * s.size * s.size
  _ -> s.size * s.size
)
```

```output
12.56
9
```

The two tabs above are one program: `main.osl` imports `shapes.osl`. Click a tab to see each file.

## Importing a folder

`import "shapes"`, without `./` or `.osl`, imports every `.osl` file directly inside the folder `shapes`. It's the usual way to group a feature's files together:

```text
main.osl
api/
  routes.osl
  handlers.osl
db/
  users.osl
  queries.osl
```

```osl fragment
import "api"
import "db"
```

Files in a folder are loaded in alphabetical order. Subfolders aren't included; import each one you need.

## Choosing what a file exposes

Without an `export` line, a file exposes everything it declares. Add one to make a file's public API explicit; the rest stays private to the file and its folder:

```osl file=main.osl
import "./counter.osl"

log next()
log next()
```

```osl file=counter.osl
export {next}

int count = 0

def next() int (
  count++
  return format(count)
)

def format(int n) int -> n * 10
```

```output
10
20
```

`main.osl` can call `next`, but not `format` or `count`.

## Importing parts, or a namespace

Pick names from a file, or put everything under a prefix to avoid clashes:

```osl file=main.osl
import {celsius} from "./convert.osl"
import * as convert from "./convert.osl"

log celsius(212)
log convert.fahrenheit(100)
```

```osl file=convert.osl
def celsius(number f) number -> ((f - 32) * 5) / 9
def fahrenheit(number c) number -> ((c * 9) / 5) + 32
```

```output
100
212
```

## The standard library

Packages that ship with the compiler start with `std:`. They cover servers, files, JSON, databases, images, threads and much more; the [package pages](../packages/index.md) have a tutorial for each:

```osl
import "std:json"
import "std:math"

log json.stringify({ok: true, values: [1, 2]})
log math.pi.toStr().left(4)
```

```output
{"ok":true,"values":[1,2]}
3.14
```

`set`, `map`, `result` and a few other core types are built in and need no import to use as types.

## Git packages

Opal, the package manager that installs with OSL, adds packages from Git repositories:

```bash
opal init
opal add someone/some-package
```

Then import it by its repository name: `import "someone/some-package"`. Opal pins the exact version in `opal.lock`, so everyone building the project gets the same code. The [Opal reference](../reference/opal.md) has the details.

## Go packages

Any Go package is an import away, with the `go:` prefix. The [Go lesson](go.md) covers this properly:

```osl
import "go:strings"

log strings.Repeat("ab", 3)
log strings.Title("hello world")
```

```output
ababab
Hello World
```

## Organising a project

A layout that scales well: one entry file that wires things together, and a folder per area of the program.

```text
src/
  main.osl        imports the folders, starts the program
  api/            HTTP routes and handlers
  db/             storage and queries
  helpers/        small shared functions
```

Keep `main.osl` short. If it's doing real work, that work probably belongs in a folder.

:::quiz
What does `import "utils"` import?

- [ ] The file `utils.osl`.
- [x] Every `.osl` file directly inside the folder `utils`.
- [ ] A Git package called `utils`.

A bare name without `./` or `.osl` is a folder. A file needs its path: `import "./utils.osl"`.
:::

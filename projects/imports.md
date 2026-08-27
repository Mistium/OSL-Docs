# Imports and modules

OSL resolves imports from the file that contains the import statement.

| Form | Source |
| --- | --- |
| `import "std:fs"` | Embedded standard-library package. |
| `import "./helpers.osl"` | Local OSL file. |
| `import "./utils"` | Every `.osl` file directly inside a local directory. |
| `import "owner/repository"` | Git package installed by Opal. |
| `import "go:net/http"` | Go package. |

Directory imports sort files by name and do not recurse into child directories.

## Local files

A statement import adds another file's declarations to the program:

```osl
import "./greeting.osl"

log greet("Ada")
```

Imported top-level statements run once where the compiler first encounters the import. Function and class declarations are available before their source position.

## Named exports

Without an `export` statement, a local file exposes all its declarations. Adding an export statement gives the file an explicit public API:

```osl
export {add, subtract as difference}
export {Vector} from "./geometry/vector.osl"
export * as geometry from "./geometry"
```

Consumers can choose how names enter their scope:

```osl
import * from "./math.osl"
import {add, subtract as difference} from "./math.osl"
import * as math from "./math.osl"
```

Files in one directory may share private declarations. A consumer in another directory sees only exported declarations when an explicit export list exists.

## Module objects

The expression form returns a module object instead of merging names into the current scope:

```osl
object math = import("./math.osl")
log math.add(2, 3)
```

The path must be a string literal naming a local OSL file.

## Standard packages

Use `std:` for packages shipped with the compiler. The older `osl/` prefix is accepted with a migration warning.

## Go packages

Use the `go:` namespace for direct Go interop:

```osl
import "go:strings"
```

The compiler uses the `go.mod` found in the entry file's directory or a parent directory. If no module exists, it creates a generated module in the OSL cache. Missing Go dependencies may be added during a native build.

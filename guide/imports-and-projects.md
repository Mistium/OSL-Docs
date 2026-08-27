# Imports and project structure

Imports are relative to the file that contains them.

## Import forms

| Form | Meaning |
| --- | --- |
| `import "std:fs"` | Package embedded in the compiler |
| `import "./helpers.osl"` | One local source file |
| `import "helpers"` | Every `.osl` file directly inside a local directory |
| `import "owner/repository"` | Git package installed by Opal |
| `import "go:net/http"` | Go package |

Directory imports are sorted by filename and are not recursive. Import each child directory explicitly.

## A practical layout

Use one top-level entry file and group the rest by responsibility:

```text
src/
  main.osl
  api/
    index.osl
    handlers/
  db/
    users/
      storage.osl
      queries.osl
  helpers/
```

`main.osl` should compose the application. Put feature behavior in imported directories. OriginChats uses this layout at production scale: its entry file imports packages, declares shared types and state, imports feature groups, then starts the HTTP and WebSocket servers.

```osl
// src/main.osl
import "std:serve"
import "api"
import "db"
import "helpers"
```

## Exports

Without an export statement, a local file exposes all declarations. Add exports to define an explicit public API:

```osl
export {createUser, deleteUser}
export {User} from "./models.osl"
export * as validation from "./validation"
```

Consumers can merge exports, select names, or create a namespace:

```osl
import * from "./users.osl"
import {createUser} from "./users.osl"
import * as users from "./users.osl"
```

Sibling files in one directory can share private declarations. A consumer in another directory sees only the explicit exports.

## Module objects

The expression form returns a local module as an object:

```osl
object math = import("./math.osl")
log math.add(2, 3)
```

## Go modules

Native builds look for `go.mod` in the entry file's directory and its parents. The compiler copies the selected module files into its generated workspace. A project without `go.mod` uses a generated module in the OSL cache.

## Opal projects

Opal manages Git and Go dependencies, exact lock data, scripts, and package commands. An Opal project uses `opal.json`, `opal.lock`, and an ignored `.opal/` directory. See [Opal projects](../reference/opal.md).

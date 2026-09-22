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

Call exported Go functions through the package name:

```osl
import "go:strings"
string upper = strings.ToUpper("abc")
```

Go arguments follow the Go signature, and a misspelled member is reported as
`ReferenceError: Go package 'strings' has no exported member '...'`.

A local import that cannot be found reports the import line and, when a file in that directory has
a similar name, suggests it. Import paths are case-sensitive, so `./caseonly.osl` does not match
`CaseOnly.osl` on Linux.

Directory imports are sorted by filename and are not recursive. Import each child directory explicitly.
The compiler emits runtime initialization only for imported files that contain top-level executable
statements. A file containing declarations alone adds no runtime initializer.

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

Package method discovery follows exported variable aliases to their receiver type.
Methods implemented with a Go `error` return, or with an explicit `nil` return, retain
that nullability in OSL checks. A valid `== null` check on those results is accepted.

## Package handle types

Use the package name when declaring a handle, for example `*cache.Cache`, `*db.DB`,
`*process.Process`, or `*ptr.Pointer`. The same names work in function parameters and
return types. Go types for package handles use `OSL<package><Type>` consistently, so `*cache.Cache`
resolves to `*OSLcacheCache` without a special compiler alias.

An empty array fallback inherits the left operand's element type:

```osl
string[string[]?] groups = {}
string[] values = groups["missing"] ?? []
```

Built-in types such as `result`, `set`, `map`, `option`, `canvas`, and `xml` use bare
language names. They do not have qualified package type names or require imports.
For example, use `result<int, string>` for a typed result.

Explicit types on imported global variables are available to top-level statements in
importing files, including typed arrays, dictionaries, and package handles. Accessing
an imported `*cache.Cache` does not require a type assertion. Module initialization
still runs once at the import position.

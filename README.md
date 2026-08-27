# OSL documentation

OSL is a programming language that compiles to Go and builds native executables. An OSL program can be a single script or an Opal project with local modules, Git dependencies, Go modules, tests, and executable commands.

```osl
import "std:serve"

*serve.Router app = serve.new()

app.GET("/", def(*serve.Context context) -> (
  context.string(200, "Hello from OSL")
))

app.serve(":8080")
```

Run the source directly while developing:

```bash
osl run server.osl
```

Build a standalone executable for distribution:

```bash
osl compile server.osl
./server
```

## Start here

New to OSL? Follow [Install and run OSL](getting-started/README.md), then read the [language overview](language/syntax.md).

Use the documentation by task:

| Task | Documentation |
| --- | --- |
| Run, build, format, or inspect a program | [Compiler CLI](cli/README.md) |
| Create a project or add dependencies | [Opal projects](projects/opal.md) |
| Learn variables, types, functions, and control flow | [Language guide](language/syntax.md) |
| Import local files, standard packages, or Go packages | [Imports and modules](projects/imports.md) |
| Find a standard-library API | [Standard library](packages/README.md) |
| Write and run tests | [Testing](tooling/testing.md) |
| Configure editor features | [Editor tooling](tooling/editor.md) |
| Diagnose compiler or runtime behavior | [Compiler diagnostics](language/compiler-diagnostics.md) |

## What the compiler does

The compiler parses and checks the reachable OSL files, lowers the program to Go, links only the runtime helpers and embedded packages it uses, then invokes the Go toolchain for native builds. `osl transpile` stops before the Go build and writes the generated Go instead.

Successful compiler artifacts and native builds are cached. Use `osl cache status` to inspect the cache and `osl cache clean` to remove it.

## Standard library

Standard packages use the `std:` namespace:

```osl
import "std:fs"
import "std:json"

object config = json.parse(fs.readFile("config.json"))
```

The library covers files, processes, networking, databases, serialization, cryptography, concurrency, terminal interfaces, images, documents, audio, native windows, and physics. Start with the [package index](packages/README.md).

## Legacy originOS documentation

OSL began as the scripting language for originOS. Browser globals, simulated input, the old window command system, promises, and OFSF belong to that runtime and do not describe the native compiler. They are kept under [Legacy originOS](legacy-osl/README.md).

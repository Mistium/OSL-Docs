# OSL

OSL is a compiled scripting language. The compiler reads `.osl` source, generates Go, and builds a native executable.

```osl
import "std:serve"

*serve.Router app = serve.New()

app.GET("/", def(*serve.Context context) -> (
  context.string(200, "Hello from OSL")
))

app.run(":8080")
```

Run a source file while working on it:

```bash
osl run main.osl
```

Build an executable when you want a binary:

```bash
osl compile main.osl -o app
./app
```

## Read this first

Start with [Install and run OSL](guide/getting-started.md). The rest of the guide follows the order in which the language becomes useful:

1. [Programs and variables](guide/programs-and-variables.md)
2. [Types](guide/types.md)
3. [Arrays and objects](guide/collections.md)
4. [Control flow](guide/control-flow.md)
5. [Functions](guide/functions.md)
6. [Structs, enums, and classes](guide/nominal-types.md)
7. [Operators](guide/operators.md)
8. [Errors and results](guide/errors.md)
9. [Imports and project structure](guide/imports-and-projects.md)

The examples use the same style as the production code in `originchats-osl`: type-first declarations, narrow functions, directory imports, typed package handles, explicit assertions at dynamic boundaries, and parentheses around mixed arithmetic.

## Find an API

Language-level functions and methods are listed in [Built-ins and value methods](reference/builtins-and-methods.md). Imported APIs live in the [standard-library package reference](packages/README.md).

Compiler and project commands have separate references:

- [OSL command line](reference/cli.md)
- [Opal projects](reference/opal.md)
- [Testing](reference/testing.md)
- [Editor tooling](reference/editor.md)

## One rule worth learning now

OSL arrays and strings are 1-indexed. The first item is at index `1`. This affects indexing, loops, slicing, and every example in this guide.

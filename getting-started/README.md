# Getting Started

This page takes you from nothing to a running OSL program.

## Installation

The quickest way to install the OSL compiler is the one-line installer:

```bash
curl -fsSL https://gosl.mistium.com | sh
```

This downloads one release build and installs it as both the `osl` compiler and the `opal` package
manager. To confirm they work:

```bash
osl version
opal version
```

### Building from source (optional)

OSL is itself written in Go. If you'd rather build it yourself you'll need a recent
[Go toolchain](https://go.dev/dl/):

```bash
git clone https://git.rotur.dev/osl/.go osl
cd osl
go build
./osl setup   # installs /usr/local/bin/osl and /usr/local/bin/opal
```

### Keeping it up to date

```bash
osl update      # fetch and install the latest version
osl uninstall   # remove OSL and Opal binaries
```

> **Note:** OSL compiles your program by generating Go and building it, so the **Go toolchain must be
> installed** on the machine where you compile. It is only needed at *compile* time - the binaries you
> produce are standalone and need nothing extra to run.

## Your first program

Create a file called `hello.osl`:

```javascript
log "Hello, OSL!"
```

Run it directly:

```bash
osl run hello.osl
```

```
Hello, OSL!
```

`osl run` compiles to a temporary binary and runs it in one step - perfect while developing. When
you're ready to ship, compile to a real binary instead:

```bash
osl compile hello.osl     # produces ./hello
./hello
```

## The CLI

`osl` is a single command with sub-commands. Run `osl` with no arguments to see them all.

| Command | What it does |
| --- | --- |
| `osl run <file.osl>` | Compile and immediately run a file. |
| `osl compile <file.osl> [-o name]` | Compile through shared temporary-workspace and cached-module preparation with live TTY progress. |
| `osl transpile <file.osl>` | Print the generated Go code to stdout (useful for debugging). |
| `osl fmt <path> [...]` | Validate nested AST errors, format, and rewrite OSL files or whole project directories in place. |
| `osl package <name>` | Print the source of a standard-library package (omit `<name>` to list them all). |
| `osl lsp` | Start the language server for editor integration (autocomplete, errors, hover). |
| `osl lsp check <file.osl>` | Print the same project-aware diagnostics the language server reports. |
| `osl opal <command>` | Run the same package manager as the standalone `opal` command. |
| `osl version` | Show the compiler version. |

Commands return a non-zero process status when compilation, validation, execution, or editor
diagnostics fail. Usage errors return status 2. `osl run` preserves the status selected by an OSL
`exit status` command, so OSL programs compose correctly with shell scripts and CI pipelines.

`osl transpile` stops after lean parser initialization with shared immutable operator and built-in signature tables, scans generated and imported code for runtime dependencies, and emits only the helper files the program references. It does not invoke the Go compiler.
With `-o <path>`, it creates missing parent directories and atomically replaces a regular
owner-readable output file, so interrupted writes cannot leave partial generated Go.
Each compilation owns its generated temporary names and embedded-image state, so compiling identical
source repeatedly produces deterministic Go without retaining assets from an earlier project.
The native binary cache keeps only the newest executable artifact for each source directory. A
successful compile replaces that directory's older cached executable.

`osl ast <file.osl>` emits the parsed token tree as JSON. The `compile`, `run`, and `transpile`
commands also accept that JSON representation when integrations need to provide an AST directly.

`osl fmt` is OSL's equivalent of `gofmt`. It deterministically applies two-space indentation,
canonical operator and delimiter spacing, multiline command blocks, one blank line between top-level
declarations, and no leading or repeated blank lines. The editor uses this same formatter. It preserves comments
and literal contents, and leaves a file unchanged when parsing fails. Pass a project directory,
such as `osl fmt .`, to format every `.osl` file below it recursively.

## The execution model

An OSL file needs **no `main` function**. The file's top-level statements *are* the
program, and they run top to bottom:

```javascript
log "first"
log "second"
log "third"
```

If you prefer an explicit entry point, you *can* define `def main()` — it takes no
parameters and is called automatically after the top-level statements run:

```javascript
log "setup runs first"

def main() (
  log "then main runs"
)
```

Function and class definitions are *hoisted*, so you can call a function before it appears in the
file. Other top-level statements still run once in source order:

```javascript
log greet("world")          // works, even though greet is defined below

def greet(string name) string (
  return "Hello, " ++ name
)
```

## A bigger example

```javascript
import "std:fs"

string path = "names.txt"

if fs.exists(path) (
  string contents = fs.readFile(path)
  array names = contents.split("\n")
  log "Found " ++ names.len ++ " names:"
  for i names.len (
    log "  - " ++ names[i]
  )
) else (
  log "No names file yet - creating one."
  fs.writeFile(path, "Ada\nGrace\nLin")
)
```

## Project structure & imports

A project can be a single file, or many. There are three kinds of `import`:

```javascript
import "std:fs"            // a standard-library package
import "./helpers.osl"     // another OSL file in your project (relative to this file; ./ optional for same-dir: import "helpers.osl")
import "./utils"           // every .osl file directly inside a project directory
import "go/strings"        // a raw Go package, for advanced interop
```

A directory import is sorted by filename, is not recursive, and follows the same resolution rules in the compiler and editor. Splitting code across files is just a matter of defining functions in one file and importing it in another:

Package dependencies are read from the package's leading `// requires:` header during compilation;
Go dependencies may use `package/path as alias`; missing modules are installed once per distinct path.

```javascript
// helpers.osl
def greet(string name) string (
  return "Hello, " ++ name ++ "!"
)
```

```javascript
// main.osl
import "./helpers.osl"

log greet("World")
```

```bash
osl run main.osl     # Hello, World!
```

See the [Packages](../packages/README.md) section for everything the standard library provides.

## Editor support

Run the bundled project-aware language server for indexed completion, inline semantic errors, hover and signature help, definitions and type definitions, references and rename, semantic highlighting, inferred-type hints, document symbols and links, folding and selection ranges, call hierarchy, safe import organization, and deterministic formatting:

Editor messages use Content-Length-framed JSON-RPC and encode each payload once.
Diagnostics compile imported leaf files through the `main.osl` that includes them and overlay live editor buffers, so shared project symbols resolve without hiding errors in unsaved changes. Use `osl lsp check <file.osl>` from the project root to reproduce editor diagnostics in a terminal.

```bash
osl lsp
```

Point your editor's LSP client at that command for `.osl` files.

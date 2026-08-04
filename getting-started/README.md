# Getting Started

This page takes you from nothing to a running OSL program.

## Installation

The quickest way to install the OSL compiler is the one-line installer:

```bash
curl -fsSL https://gosl.mistium.com | sh
```

This downloads the `osl` binary and installs it. To confirm it worked:

```bash
osl version
```

### Building from source (optional)

OSL is itself written in Go. If you'd rather build it yourself you'll need a recent
[Go toolchain](https://go.dev/dl/):

```bash
git clone https://git.rotur.dev/osl/.go osl
cd osl
go build
sudo ./osl setup   # installs the binary to /usr/local/bin/osl
```

### Keeping it up to date

```bash
osl update      # fetch and install the latest version
osl uninstall   # remove OSL
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
| `osl compile <file.osl> [-o name]` | Compile to a native binary with live TTY progress (default name = the file's stem). |
| `osl transpile <file.osl>` | Print the generated Go code to stdout (useful for debugging). |
| `osl ast <file.osl>` | Print the parsed syntax tree as JSON. |
| `osl fmt <path> [...]` | Parse, format, and rewrite OSL files or whole project directories in place. |
| `osl package <name>` | Print the source of a standard-library package (omit `<name>` to list them all). |
| `osl lsp` | Start the language server for editor integration (autocomplete, errors, hover). |
| `osl todo` | List every `// TODO:` comment in the current project. |
| `osl version` | Show the compiler version. |

`osl transpile` stops after lean parser initialization with shared immutable operator and built-in signature tables, then uses one-pass raw Go import detection during code generation; it does not invoke the Go compiler.

`osl fmt` is OSL's equivalent of `gofmt`. It uses two-space indentation, stable spacing, one blank
line between top-level declarations, and no leading or repeated blank lines. It preserves comments
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
import "osl/fs"

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
import "osl/fs"            // a standard-library package (the osl/ prefix is optional: import "fs")
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

Run the bundled project-aware language server for indexed symbol and deduplicated, prefix-filtered keyword, builtin, method and snippet autocomplete, incremental document synchronization, inline errors, UTF-16-accurate definitions and document highlights, Markdown hover docs, multiline folding and configurable document formatting:

Editor messages use Content-Length-framed JSON-RPC and encode each payload once.
Diagnostics reuse the typed parser result instead of parsing the document twice.

```bash
osl lsp
```

Point your editor's LSP client at that command for `.osl` files.

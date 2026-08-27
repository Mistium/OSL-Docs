# Install and run OSL

OSL uses Go to build native executables. Install a current Go toolchain on the machine where you compile. The executable produced by OSL does not need Go.

## Install the compiler

```bash
curl -fsSL https://gosl.mistium.com | sh
```

Check the installed commands:

```bash
osl version
opal version
```

To build from source:

```bash
git clone https://git.rotur.dev/osl/.go osl
cd osl
go build -o osl .
./osl setup
```

## Write a program

Create `hello.osl`:

```osl
string name = "world"
log "Hello, " ++ name
```

Run it:

```bash
osl run hello.osl
```

`log` prints a value followed by a newline. `++` converts both operands to text and joins them.

## Build a binary

```bash
osl compile hello.osl
./hello
```

Use `-o` to choose the output path:

```bash
osl compile hello.osl -o bin/hello
```

## Format source

OSL uses two-space indentation. Let the formatter handle it:

```bash
osl fmt hello.osl
osl fmt src/
```

The directory form formats every `.osl` file below that directory.

## Import a package

```osl
import "std:fs"

if fs.exists("message.txt") (
  log fs.readFile("message.txt")
)
```

Packages shipped with the compiler use `std:<name>`. Continue with [Programs and variables](programs-and-variables.md), or open the [package index](../packages/README.md) when you need a library API.

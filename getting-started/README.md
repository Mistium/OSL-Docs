# Install and run OSL

## Requirements

OSL uses the Go toolchain to build native executables. Install a current Go release before compiling programs. The executable produced by OSL does not require Go at runtime.

## Install

```bash
curl -fsSL https://gosl.mistium.com | sh
```

Check both installed commands:

```bash
osl version
opal version
```

To build the compiler from source instead:

```bash
git clone https://git.rotur.dev/osl/.go osl
cd osl
go build -o osl .
./osl setup
```

`osl update` installs the latest version. `osl uninstall` removes the installed OSL and Opal executables.

## Run a program

Create `hello.osl`:

```osl
log "Hello, OSL!"
```

```bash
osl run hello.osl
```

Build a reusable executable with `compile`:

```bash
osl compile hello.osl
./hello
```

Pass `-o` to choose the output path:

```bash
osl compile hello.osl -o bin/hello
```

## Add a package

```osl
import "std:fs"

string message = fs.readFile("message.txt")
log message
```

The compiler includes only the package code and runtime helpers that the program uses. See [Imports and modules](../projects/imports.md) for local modules, directory imports, Git packages, and Go interop.

## Format and check code

```bash
osl fmt hello.osl
osl fmt .
osl lsp check hello.osl
```

## Create a project

```bash
opal init hello
cd hello
opal run
```

Continue with [Opal projects](../projects/opal.md) or browse the complete [compiler CLI](../cli/README.md).
